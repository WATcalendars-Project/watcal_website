// Unified group selector used by all faculty-specific wrappers.
// Usage: set window.__groupSelectorConfig = { plansTemplate: 'https://.../{group}.htm' }
// then call window.initGroupSelector() or include this file before wrappers (they will call init if available).

/* global window, document, navigator */

// Helper: robust cross-origin .ics download
async function downloadIcs(url, filename) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = filename || 'calendar.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (e) {
    console.error('Download failed, falling back to direct link', e);
    // Fallback: navigate to the URL so the browser handles it
    window.location.href = url;
  }
}

function replaceTemplate(tpl, group) {
  if (!tpl) return '';
  return tpl.replace(/\{\s*group\s*\}/gi, encodeURIComponent(group));
}

async function loadGroupsGeneric() {
  try {
    const select = document.getElementById('group');
    const output = document.getElementById('output');
    if (!select || !output) return;

    const config = Object.assign({}, window.__groupSelectorConfig || {});

    const repo = select.dataset.repo || config.repo || 'dominikx2002/WATcalendars';
    const mainBranch = select.dataset.branch || config.branch || 'main';
    const calendarsCandidates = (select.dataset.calendarsPaths || config.calendarsPaths || 'db/calendars').split(',').map(s => s.trim()).filter(Boolean);
    const schedulesCandidates = (select.dataset.schedulesPaths || config.schedulesPaths || 'db/schedules').split(',').map(s => s.trim()).filter(Boolean);
    const plansTemplate = select.dataset.plansTemplate || config.plansTemplate || '';

    select.innerHTML = '';
    const loadingOpt = document.createElement('option');
    loadingOpt.setAttribute('data-i18n', 'groups.loading');
    loadingOpt.textContent = 'Ładowanie…';
    loadingOpt.disabled = true;
    loadingOpt.selected = true;
    select.appendChild(loadingOpt);
    document.dispatchEvent(new CustomEvent('i18n:refresh'));

    const fetchApiArray = async (apiUrl) => {
      const res = await fetch(apiUrl, { headers: { Accept: 'application/vnd.github.v3+json' } });
      if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Unexpected API response shape');
      return data;
    };

    let calBaseApi = null;
    let usedPngFallback = false;
    let icsFiles = [];

    const tried = [];
    for (const path of calendarsCandidates) {
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
      tried.push(apiUrl);
      try {
        const arr = await fetchApiArray(apiUrl);
        const found = arr.filter(f => f && typeof f.name === 'string' && f.name.toLowerCase().endsWith('.ics'));
        if (found.length > 0) {
          calBaseApi = apiUrl;
          icsFiles = found;
          break;
        }
      } catch (e) {
        // ignore and try next
      }
    }

    if (icsFiles.length === 0) {
      for (const path of schedulesCandidates) {
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
        tried.push(apiUrl);
        try {
          const arr = await fetchApiArray(apiUrl);
          const pngs = arr.filter(f => f && typeof f.name === 'string' && f.name.toLowerCase().endsWith('.png'));
          if (pngs.length > 0) {
            icsFiles = pngs.map(f => ({ name: f.name.replace(/\.png$/i, '.ics') }));
            usedPngFallback = true;
            break;
          }
        } catch (e) {
          // ignore
        }
      }
    }

    if (icsFiles.length === 0) {
      select.innerHTML = '';
      const emptyOpt = document.createElement('option');
      emptyOpt.setAttribute('data-i18n', 'groups.none.title');
      emptyOpt.textContent = 'Brak dostępnych grup (.ics/.png)';
      emptyOpt.disabled = true;
      emptyOpt.selected = true;
      select.appendChild(emptyOpt);
      output.setAttribute('data-i18n', 'groups.none.text');
      output.textContent = 'Brak dostępnych grup do wyświetlenia.';
      console.warn('Nie znaleziono plików grup.', { tried });
      document.dispatchEvent(new CustomEvent('i18n:refresh'));
      return;
    }

    // Clear loading and add placeholder so nothing is preselected
    select.innerHTML = '';
    const placeholder = document.createElement('option');
    placeholder.textContent = '           ';
    placeholder.value = '';
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    icsFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    icsFiles.forEach(file => {
      const option = document.createElement('option');
      option.value = file.name;
      option.textContent = file.name.replace(/\.ics$/i, '');
      select.appendChild(option);
    });

    const render = (groupName) => {
      if (!groupName) return;
      const pngName = groupName.replace('.ics', '.png');
      const grupaId = groupName.replace(/\.(ics|json)$/i, '');
      const icsBaseRaw = calBaseApi
        ? calBaseApi.replace('https://api.github.com/repos/', 'https://raw.githubusercontent.com/').replace('/contents/', `/${mainBranch}/`)
        : null;
      const icsUrl = icsBaseRaw ? `${icsBaseRaw}/${groupName}` : null;
      const pngBaseRaw = `https://raw.githubusercontent.com/${repo}/${mainBranch}/${schedulesCandidates[0]}`;
      const pngUrl = `${pngBaseRaw}/${pngName}`;

      const planzajecUrl = plansTemplate ? replaceTemplate(plansTemplate, grupaId) : '';
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);

      if (usedPngFallback || !icsUrl) {
        output.innerHTML = `
          <span class="png-generated-from" data-i18n="groups.png_from">PNG generated from:</span>
          ${planzajecUrl ? `<a href="${planzajecUrl}" target="_blank">${planzajecUrl}</a><br>` : ''}
          <img id="PNG-Preview" src="${pngUrl}" alt="PNG-preview" />
        `;
        document.dispatchEvent(new CustomEvent('i18n:refresh'));
        return;
      }

      const webcalUrl = icsUrl.replace(/^https?:\/\//i, 'webcal://');

      if (isIOS) {
        output.innerHTML = `
          <a href="${webcalUrl}" id="subscribe-calendar-link"><span data-i18n="groups.subscribe.link">Subscribe Calendar</span></a><br>
          ${!isIOS && planzajecUrl ? '' : ''}
          <span class="png-generated-from" data-i18n="groups.png_from">PNG generated from:</span>
          ${planzajecUrl ? `<a href="${planzajecUrl}" id="schedule-url" target="_blank">${planzajecUrl}</a>` : ''}
          <img id="PNG-Preview" src="${pngUrl}" alt="PNG-preview" />
        `;
        document.dispatchEvent(new CustomEvent('i18n:refresh'));
      } else {
        let gcalIcs = icsUrl;
        if (gcalIcs && gcalIcs.startsWith('https://raw.githubusercontent.com/')) {
          const parts = gcalIcs.replace('https://raw.githubusercontent.com/', '').split('/');
          if (parts.length >= 4) {
            gcalIcs = `https://github.com/${parts[0]}/${parts[1]}/raw/${parts[2]}/${parts.slice(3).join('/')}`;
          }
        }
        const gcalHref = gcalIcs ? `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(gcalIcs)}` : '';
        output.innerHTML = `
          <button id=\"download-ics-btn\" type=\"button\" data-i18n=\"groups.download_btn\">Download .ICS file</button><br>
          ${isAndroid && gcalHref ? `<a class=\"gcal-subscribe\" target=\"_blank\" href=\"${gcalHref}\" data-i18n=\"groups.subscribe.gcal\">Subscribe in Google Calendar</a><br>` : ''}
          <span class=\"subscribe-url\" data-i18n=\"groups.subscribe.orcopy\">or copy URL to subscribe:</span>
          <div class=\"command\"> 
              <code>${webcalUrl}</code>
              <span class=\"copy\"><img src=\"/img/icons/copy-icon.png\" alt=\"copy-icon\" onclick=\"copyToClipboard('${webcalUrl}', this)\"></span>
          </div>
          <span class=\"png-generated-from\" data-i18n=\"groups.png_from\">PNG generated from:</span>
          ${planzajecUrl ? `<a href=\"${planzajecUrl}\" id=\"schedule-url\" target=\"_blank\">${planzajecUrl}</a>` : ''}
          <img id=\"PNG-Preview\" src=\"${pngUrl}\" alt=\"PNG-preview\" />
        `;
        window.dispatchEvent(new Event('i18n:refresh'));
        const btn = document.getElementById('download-ics-btn');
        if (btn) {
          btn.addEventListener('click', () => downloadIcs(icsUrl, groupName));
        }
      }
    };

    select.addEventListener('change', () => {
      if (select.value) render(select.value);
      else output.textContent = '';
    });

    // leave placeholder until user selects
    output.textContent = '';
  } catch (err) {
    const output = document.getElementById('output');
    if (output) {
      output.setAttribute('data-i18n', 'groups.fetch_error');
      output.textContent = 'Nie udało się pobrać listy grup. Spróbuj ponownie później.';
      document.dispatchEvent(new CustomEvent('i18n:refresh'));
    }
    console.error(err);
  }
}

window.initGroupSelector = function(cfg) {
  window.__groupSelectorConfig = Object.assign({}, window.__groupSelectorConfig || {}, cfg || {});
  // Run loader after a tick so wrappers can set config first
  setTimeout(() => loadGroupsGeneric(), 0);
};

// If some wrapper set config before this file loaded, initialize now
if (window.__groupSelectorConfig) {
  setTimeout(() => loadGroupsGeneric(), 0);
}
