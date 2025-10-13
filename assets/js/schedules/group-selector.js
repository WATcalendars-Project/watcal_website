// Populate the #group <select> with group names loaded from local JSON files in /db/groups_url/
// Detects faculty from URL: /schedules/{faculty}/ and fetches {faculty}_groups_url.json
// Extras: placeholder option, sorted names, persistence in localStorage, optional preselect via ?group=

(function () {
	'use strict';

	// Run after DOM is ready (script is deferred on pages, but keep it safe)
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	function init() {
		const selectEl = document.getElementById('group');
			if (!selectEl) return;

		const faculty = detectFacultyFromPath(location.pathname);
		const jsonMap = {
			ioe: 'ioe_groups_url.json',
			wcy: 'wcy_groups_url.json',
			wel: 'wel_groups_url.json',
			wim: 'wim_groups_url.json',
			wlo: 'wlo_groups_url.json',
			wtc: 'wtc_groups_url.json'
		};

		if (!faculty || !(faculty in jsonMap)) {
			setOptions(selectEl, [placeholderOption('Brak danych dla tego wydziału', true)]);
			return;
		}

		// Show loading state
		setOptions(selectEl, [placeholderOption('Ładowanie…', true)]);

		const cacheBuster = Date.now();
		const url = `/db/groups_url/${jsonMap[faculty]}?v=${cacheBuster}`;

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
				return res.json();
			})
					.then((data) => {
				// data shape: { "GROUP_NAME": "https://...", ... }
				const names = Object.keys(data || {});
				if (!names.length) {
					setOptions(selectEl, [placeholderOption('Brak grup do wyświetlenia', true)]);
					return;
				}

				// Sort alphabetically, natural, Polish locale
				names.sort((a, b) => a.localeCompare(b, 'pl', { numeric: true, sensitivity: 'base' }));

				// Build options list: placeholder + groups
				const opts = [placeholderOption('Wybierz grupę', true, true)];
				for (const name of names) {
					const opt = document.createElement('option');
					opt.value = name;
					opt.textContent = name;
					// keep URL for potential future use
					try { opt.dataset.url = String(data[name]); } catch (_) {}
					opts.push(opt);
				}
						setOptions(selectEl, opts);

				// Preselect from ?group= or localStorage
				const preselect = getPreselectedGroup(faculty, names);
				if (preselect) {
					selectEl.value = preselect;
							renderGroupPreview(faculty, preselect);
				}

				// Persist selection
				selectEl.addEventListener('change', () => {
					const val = selectEl.value;
					if (val && names.includes(val)) {
						try { localStorage.setItem(lsKey(faculty), val); } catch (_) {}
								renderGroupPreview(faculty, val);
					}
				});
			})
			.catch((err) => {
				console.error('[group-selector] Failed to load groups:', err);
				setOptions(selectEl, [placeholderOption('Nie udało się wczytać grup', true)]);
			});
	}

	function detectFacultyFromPath(path) {
		// Expected path examples: /schedules/wcy/, /schedules/wim/index.html
		const m = /\/schedules\/([^/]+)\//i.exec(path || '');
		return m ? m[1].toLowerCase() : null;
	}

	function setOptions(selectEl, optionElements) {
		while (selectEl.firstChild) selectEl.removeChild(selectEl.firstChild);
		for (const opt of optionElements) selectEl.appendChild(opt);
	}

	function placeholderOption(text, disabled, selected) {
		const opt = document.createElement('option');
		opt.textContent = text;
		if (disabled) opt.disabled = true;
		if (selected) opt.selected = true;
		opt.hidden = true;
		opt.value = '';
		return opt;
	}

	function lsKey(faculty) {
		return `watcal:selectedGroup:${faculty}`;
	}

	function getPreselectedGroup(faculty, names) {
		const params = new URLSearchParams(location.search);
		const byQuery = params.get('group');
		if (byQuery && names.includes(byQuery)) return byQuery;
		try {
			const byLS = localStorage.getItem(lsKey(faculty));
			if (byLS && names.includes(byLS)) return byLS;
		} catch (_) {}
		return null;
	}

		function renderGroupPreview(faculty, groupName) {
			const output = document.getElementById('output');
			if (!output || !faculty || !groupName) return;

			// Map group name to local filename conventions
			// Rule observed: '*' in JSON names maps to '_' in local files for some faculties (e.g., WCY24*MM -> WCY24_MM)
			const fileBase = groupName.replace(/\*/g, '_');
			const encoded = encodeURIComponent(fileBase);

			const icsUrl = `/db/calendars/${faculty}_calendars/${encoded}.ics`;
			const pngUrl = `/db/schedules/${faculty}_schedules/${encoded}.png`;

			// Build DOM
			output.innerHTML = '';

			const container = document.createElement('div');
			container.className = 'schedule-output';

			const actions = document.createElement('div');
			actions.className = 'schedule-actions';

			const icsFile = document.createElement('a');
			icsFile.href = icsUrl;
			icsFile.setAttribute('download', `${fileBase}.ics`);
			icsFile.textContent = 'Download .ICS';
			icsFile.className = 'download-ics-btn';

      const icsLink = document.createElement('a');
      icsLink.href = `webcal://watcalendars.byst.re/db/calendars/${encodeURIComponent(groupName)}.ics`;
      icsLink.textContent = 'Subscribe Calendar';
      icsLink.className = 'download-ics-btn';

      const googleLink = document.createElement('a');
      googleLink.href = `https://calendar.google.com/calendar/u/0/r/settings/addbyurl`;
      googleLink.target = '_blank';
      googleLink.rel = 'noopener noreferrer';
      googleLink.textContent = 'Subscribe in Google Calendar';
      googleLink.className = 'download-ics-btn';
      googleLink.addEventListener('click', (e) => {
        e.preventDefault();
          const originalText = googleLink.textContent;
          let seconds = 5;
          googleLink.textContent = `Opening in ${seconds}...`;
          const countdown = setInterval(() => {
            seconds--;
            if (seconds > 0) {
              googleLink.textContent = `Opening in ${seconds}...`;
            } else {
              clearInterval(countdown);
              googleLink.textContent = originalText;
              window.open(googleLink.href, googleLink.target); 
            }
          }, 1000);
        });

			const preview = document.createElement('div');
			preview.className = 'schedule-preview';

			const img = document.createElement('img');
			img.src = pngUrl;
			img.alt = `Plan zajęć: ${groupName}`;
			img.loading = 'lazy';
			img.decoding = 'async';
			img.onerror = () => {
				// Fallback when PNG is missing
				preview.innerHTML = '';
				const msg = document.createElement('div');
				msg.className = 'schedule-missing';
				msg.textContent = 'Brak podglądu PNG dla wybranej grupy.';
				preview.appendChild(msg);
			};

			actions.appendChild(icsFile);
      actions.appendChild(icsLink);
      actions.appendChild(googleLink);
			preview.appendChild(img);

			container.appendChild(actions);
			container.appendChild(preview);
			output.appendChild(container);
		}
})();

