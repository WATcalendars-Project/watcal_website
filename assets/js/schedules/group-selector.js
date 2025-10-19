// Populate the #group <select> with group names loaded from local JSON files in /db/groups_url/
// Detects faculty from URL: /schedules/{faculty}/ and fetches {faculty}_groups_url.json
// Extras: placeholder option, sorted names, persistence in localStorage, optional preselect via ?group=

(function () {
	'use strict';

	// Cache: faculty -> { groupName: sourceUrl }
	const groupUrlMapByFaculty = {};

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
			wig: 'wig_groups_url.json',
			wim: 'wim_groups_url.json',
			wlo: 'wlo_groups_url.json',
			wml: 'wml_groups_url.json',
			wtc: 'wtc_groups_url.json'
		};

		if (!faculty || !(faculty in jsonMap)) {
			setOptions(selectEl, [placeholderOption('No data available for this faculty', true)]);
			return;
		}

		// Show loading state
		setOptions(selectEl, [placeholderOption('Loading…', true)]);

		const cacheBuster = Date.now();
		const url = `/db/groups_url/${jsonMap[faculty]}?v=${cacheBuster}`;

		fetch(url)
			.then((res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${url}`);
				return res.json();
			})
					.then((data) => {
				// cache mapping for later use in preview
				try { groupUrlMapByFaculty[faculty] = data || {}; } catch (_) {}
				// data shape: { "GROUP_NAME": "https://...", ... }
				const names = Object.keys(data || {});
				if (!names.length) {
					setOptions(selectEl, [placeholderOption('No groups to display', true)]);
					return;
				}

				// Sort alphabetically, natural, Polish locale
				names.sort((a, b) => a.localeCompare(b, 'pl', { numeric: true, sensitivity: 'base' }));

				// Build options list: placeholder + groups
				const opts = [placeholderOption('Select group', true, true)];
				for (const name of names) {
					const opt = document.createElement('option');
					opt.value = name;
					opt.textContent = name;
					// keep URL for potential future use
					try { opt.dataset.url = String(data[name]); } catch (_) {}
					opts.push(opt);
				}
						setOptions(selectEl, opts);

				// Preselect from hash, path, or ?group= (do NOT preselect from localStorage on root)
				const preselect = getPreselectedGroup(faculty, names);
				if (preselect) {
					selectEl.value = preselect;
							renderGroupPreview(faculty, preselect);
				} else {
					// Show placeholders under each device section until a group is selected
					selectEl.value = '';
					renderPlaceholders();
				}

				// Persist selection + update URL hash
				selectEl.addEventListener('change', () => {
					const val = selectEl.value;
					if (val && names.includes(val)) {
						try { localStorage.setItem(lsKey(faculty), val); } catch (_) {}
								// Set hash to the group (refresh-safe)
								location.hash = encodeURIComponent(val);
								renderGroupPreview(faculty, val);
					}
				});

				// Handle Back/Forward via hashchange: sync select + preview with URL
				window.addEventListener('hashchange', () => {
					const fromHash = getGroupFromHash(location.hash);
					if (fromHash && names.includes(fromHash)) {
						selectEl.value = fromHash;
						renderGroupPreview(faculty, fromHash);
					} else {
						// Back to root (no hash): clear selection and show placeholders
						selectEl.value = '';
						clearOutputs();
					}
				});
			})
			.catch((err) => {
				console.error('[group-selector] Failed to load groups:', err);
				setOptions(selectEl, [placeholderOption('Cannot load groups', true)]);
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
		// 1) From hash: #GROUP_NAME
		const fromHash = getGroupFromHash(location.hash);
		if (fromHash && names.includes(fromHash)) return fromHash;

		// 2) From path (legacy): /schedules/{faculty}/{group}/
		const fromPath = getGroupFromPath(location.pathname, faculty);
		if (fromPath && names.includes(fromPath)) return fromPath;

		const params = new URLSearchParams(location.search);
		const byQuery = params.get('group');
		if (byQuery && names.includes(byQuery)) return byQuery;
		return null;
	}

	function getGroupFromPath(path, faculty) {
		if (!path || !faculty) return null;
		const m = new RegExp(`/schedules/${faculty}/([^/?#]+)/?`, 'i').exec(path);
		return m ? decodeURIComponent(m[1]) : null;
	}

	function getGroupFromHash(hash) {
		if (!hash) return null;
		const raw = hash.startsWith('#') ? hash.slice(1) : hash;
		try { return decodeURIComponent(raw); } catch (_) { return raw; }
	}

	function clearOutputs() {
		// Replace current content with placeholders
		renderPlaceholders();
	}

	function renderPlaceholders() {
		const outputs = [
			document.getElementById('output-iphone'),
			document.getElementById('output-android'),
			document.getElementById('output-desktop'),
			document.getElementById('output'), // legacy single container
		];
		for (const root of outputs) {
			if (!root) continue;
			root.innerHTML = '';
			const wrapper = document.createElement('div');
			wrapper.className = 'schedule-output';
			const msg = document.createElement('div');
			msg.className = 'schedule-placeholder';
			msg.textContent = '// Select a group to see options and preview.';
			wrapper.appendChild(msg);
			root.appendChild(wrapper);
		}
	}

	function renderGroupPreview(faculty, groupName) {
		if (!faculty || !groupName) return;

		// Target per-device outputs
		const outputs = {
			iphone: document.getElementById('output-iphone'),
			android: document.getElementById('output-android'),
			desktop: document.getElementById('output-desktop'),
		};

		// If none exist (older pages), fallback to single #output
		if (!outputs.iphone && !outputs.android && !outputs.desktop) {
			const legacy = document.getElementById('output');
			if (!legacy) return;
			outputs.iphone = legacy;
		}

		// Map JSON name to local filename (e.g. * -> _)
		const fileBase = groupName.replace(/\*/g, '_');
		const encoded = encodeURIComponent(fileBase);

		const icsUrl = `/db/calendars/${faculty}_calendars/${encoded}.ics`;
		const icsWebcalUrl = `webcal://watcalendars.byst.re/db/calendars/${faculty}_calendars/${encoded}.ics`;
		const icsHttpUrl = `https://watcalendars.byst.re/db/calendars/${faculty}_calendars/${encoded}.ics`;
		const pngUrl = `/db/schedules/${faculty}_schedules/${encoded}.png`;

		const makeActions = (device) => {
			const actions = document.createElement('div');
			actions.className = 'schedule-actions';

			const icsFile = document.createElement('a');
			icsFile.href = icsUrl;
			icsFile.setAttribute('download', `${fileBase}.ics`);
			icsFile.textContent = 'Download .ICS';
			icsFile.className = 'download-ics-btn';
			icsFile.setAttribute('aria-label', 'Download .ICS');
			icsFile.innerHTML = `
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
				>
					<path fill="none" d="M0 0h24v24H0z"></path>
					<path
					fill="currentColor"
					d="M1 14.5a6.496 6.496 0 0 1 3.064-5.519 8.001 8.001 0 0 1 15.872 0 6.5 6.5 0 0 1-2.936 12L7 21c-3.356-.274-6-3.078-6-6.5zm15.848 4.487a4.5 4.5 0 0 0 2.03-8.309l-.807-.503-.12-.942a6.001 6.001 0 0 0-11.903 0l-.12.942-.805.503a4.5 4.5 0 0 0 2.029 8.309l.173.013h9.35l.173-.013zM13 12h3l-4 5-4-5h3V8h2v4z"
					></path>
				</svg>
				<span class="btn-label">Download .ICS</span>
			`;

			const icsLink = document.createElement('a');
			icsLink.href = icsWebcalUrl;
			icsLink.className = 'apple-login-button';
			icsLink.setAttribute('aria-label', 'Subscribe Calendar (Apple)');
			icsLink.innerHTML = `
				<svg class="apple-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
					<path fill="currentColor" d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z"/>
				</svg>
				<span class="btn-label">Subscribe Calendar</span>
			`;

			const command1 = document.createElement('div');
			command1.className = 'command';
			const codeEl1 = document.createElement('code');
			codeEl1.textContent = icsWebcalUrl;
			const copyEl1 = document.createElement('span');
			copyEl1.className = 'copy';
			const imgEl1 = document.createElement('img');
			imgEl1.src = '/assets/images/icons/copy-icon.png';
			imgEl1.alt = 'copy-icon';
			imgEl1.setAttribute('onclick', `copyToClipboard('${icsWebcalUrl.replace(/'/g, "\\'")}', this)`);
			copyEl1.appendChild(imgEl1);
			command1.appendChild(codeEl1);
			command1.appendChild(copyEl1);

			const googleLink = document.createElement('a');
			googleLink.href = 'https://calendar.google.com/calendar/u/0/r/settings/addbyurl';
			googleLink.target = '_blank';
			googleLink.rel = 'noopener noreferrer';
			googleLink.textContent = 'Go to Google Calendar';
			googleLink.className = 'google-calendar-btn';

			const command2 = document.createElement('div');
			command2.className = 'command';
			const codeEl2 = document.createElement('code');
			codeEl2.textContent = icsHttpUrl;
			const copyEl2 = document.createElement('span');
			copyEl2.className = 'copy';
			const imgEl2 = document.createElement('img');
			imgEl2.src = '/assets/images/icons/copy-icon.png';
			imgEl2.alt = 'copy-icon';
			imgEl2.setAttribute('onclick', `copyToClipboard('${icsHttpUrl.replace(/'/g, "\\'")}', this)`);
			copyEl2.appendChild(imgEl2);
			command2.appendChild(codeEl2);
			command2.appendChild(copyEl2);

			const AppleicsLinkTitle = document.createElement('div');
			AppleicsLinkTitle.className = 'subscribe-apple-title';
			AppleicsLinkTitle.textContent = 'or Copy webcal URL to subscribe in Apple Calendar settings:';

			const AppleicsDownloadTitle = document.createElement('div');
			AppleicsDownloadTitle.className = 'download-apple-title';
			AppleicsDownloadTitle.textContent = 'you can also Download .ICS file to import into calendar apps:';

			const AppleGoogleTitle = document.createElement('div');
			AppleGoogleTitle.className = 'google-apple-title';
			AppleGoogleTitle.textContent = 'or go to Google Calendar to add by URL:';

			const AndroidGoogleTitle = document.createElement('div');
			AndroidGoogleTitle.className = 'google-android-title';
			AndroidGoogleTitle.textContent = 'Copy URL to add via Google Calendar:';

			const AndroidicsDownloadTitle = document.createElement('div');
			AndroidicsDownloadTitle.className = 'download-android-title';
			AndroidicsDownloadTitle.textContent = 'or Download .ICS file to import into calendar apps:';

			const DesktopDownloadTitle = document.createElement('div');
			DesktopDownloadTitle.className = 'download-desktop-title';
			DesktopDownloadTitle.textContent = 'Download .ICS to import into calendar apps:';

			const DesktopGoogleTitle = document.createElement('div');
			DesktopGoogleTitle.className = 'google-desktop-title';
			DesktopGoogleTitle.textContent = 'you can also copy the link to add via Google Calendar:';

			const DesktopMACOSTitle = document.createElement('div');
			DesktopMACOSTitle.className = 'macos-desktop-title';
			DesktopMACOSTitle.textContent = 'For macOS, you can subscribe from button below:';

			const DesktopWebcalTitle = document.createElement('div');
			DesktopWebcalTitle.className = 'webcal-desktop-title';
			DesktopWebcalTitle.textContent = 'or copy the webcal URL to subscribe in Apple Calendar settings:';

			const outputLine = document.createElement('div');
			outputLine.className = 'output-line';

			// Arrange items differently per device
			if (device === 'iphone') {
				// iOS prefers webcal; include Google as alternative; download last
				actions.appendChild(outputLine);
				actions.appendChild(icsLink);
				actions.appendChild(AppleicsLinkTitle);
				actions.appendChild(command1);
				actions.appendChild(AppleicsDownloadTitle);
				actions.appendChild(icsFile);
				actions.appendChild(AppleGoogleTitle);
				actions.appendChild(command2);
				actions.appendChild(googleLink);

			} else if (device === 'android') {
				// Android: emphasize download and Google (https). Omit webcal.
				actions.appendChild(AndroidGoogleTitle);
				actions.appendChild(googleLink);
				actions.appendChild(command2);
				actions.appendChild(AndroidicsDownloadTitle);
				actions.appendChild(icsFile);
			} else {
				// Desktop: show everything, download first
				actions.appendChild(DesktopDownloadTitle);
				actions.appendChild(icsFile);
				actions.appendChild(DesktopGoogleTitle);
				actions.appendChild(command2);
				actions.appendChild(googleLink);
				actions.appendChild(DesktopMACOSTitle);
				actions.appendChild(icsLink);
				actions.appendChild(DesktopWebcalTitle);
				actions.appendChild(command1);
			}

			return actions;
		};

		const makePreview = () => {
			const preview = document.createElement('div');
			preview.className = 'schedule-preview';
			const img = document.createElement('img');
			img.src = pngUrl;
			img.alt = `${groupName}`;
			img.loading = 'lazy';
			img.decoding = 'async';
			img.onerror = () => {
				preview.innerHTML = '';
				const msg = document.createElement('div');
				msg.className = 'schedule-missing';
				msg.textContent = 'No preview available.';
				preview.appendChild(msg);
			};

			// Source link mapped from db/groups_url JSON
			const sourceUrl = (() => {
				try {
					const m = groupUrlMapByFaculty[faculty];
					const raw = m ? m[groupName] : null;
					return raw ? String(raw) : null;
				} catch (_) { return null; }
			})();

			const sourceWrap = document.createElement('div');
			sourceWrap.className = 'png-generated-from';
			sourceWrap.textContent = '// PNG screenshoted from:';
			preview.appendChild(sourceWrap);

			const srcLink = document.createElement('a');
			srcLink.className = 'schedule-url';
			if (sourceUrl) {
				srcLink.href = sourceUrl;
				srcLink.target = '_blank';
				srcLink.rel = 'noopener noreferrer';
				srcLink.textContent = sourceUrl;
			} else {
				srcLink.href = '#';
				srcLink.textContent = 'source link unavailable';
				srcLink.style.opacity = '0.7';
				srcLink.style.pointerEvents = 'none';
			}
			preview.appendChild(srcLink);
			preview.appendChild(img);
			return preview;
		};

		const renderInto = (root, device) => {
			if (!root) return;
			root.innerHTML = '';
			const wrapper = document.createElement('div');
			wrapper.className = 'schedule-output';
			wrapper.appendChild(makeActions(device));
			wrapper.appendChild(makePreview());
			root.appendChild(wrapper);
		};

		renderInto(outputs.iphone, 'iphone');
	}
})();

