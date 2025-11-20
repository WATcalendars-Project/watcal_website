// Dropdown hover behavior for topbar navigation
// Shows dropdowns on hover/focus for desktop (pointer: fine), with graceful hide and outside/Escape close.

(function () {
	const onReady = (fn) => {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', fn, { once: true });
		} else {
			fn();
		}
	};

	onReady(() => {
		// Only enable hover-driven dropdowns on devices that support hover (desktops/laptops).
		const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

		const topbar = document.querySelector('#topbar');
		if (!topbar) return;

		const pairs = [
			{
				name: 'schedules',
				trigger: topbar.querySelector('.navigation-schedules'),
				dropdown: topbar.querySelector('.dropdown-schedules'),
			},
			{
				name: 'project',
				trigger: topbar.querySelector('.navigation-project'),
				dropdown: topbar.querySelector('.dropdown-project'),
			},
			{
				name: 'more',
				trigger: topbar.querySelector('.navigation-more'),
				dropdown: topbar.querySelector('.dropdown-more'),
			},
		].filter(p => p.trigger && p.dropdown);

		if (!pairs.length) return;

		// Ensure triggers are positioned for absolute dropdown anchoring.
		pairs.forEach(({ trigger }) => {
			const style = window.getComputedStyle(trigger);
			if (style.position === 'static') {
				trigger.style.position = 'relative';
			}
		});

		// Mark dropdown containers with a class for external CSS styling
		pairs.forEach(({ dropdown }) => dropdown.classList.add('dropdown-panel'));

		let openName = null;
		const hideTimers = new Map();

		function getAnchor(trigger) {
			return trigger.querySelector('a');
		}

		function showDropdown(name) {
			// Hide any other open dropdown first
			pairs.forEach(p => {
				if (p.name !== name) hideDropdown(p.name, true);
			});

			const pair = pairs.find(p => p.name === name);
			if (!pair) return;

			clearHideTimer(name);

			pair.dropdown.classList.add('open');
			const anchor = getAnchor(pair.trigger);
			if (anchor) anchor.setAttribute('aria-expanded', 'true');
			openName = name;
		}

		function hideDropdown(name, immediate = false) {
			const pair = pairs.find(p => p.name === name);
			if (!pair) return;

			const doHide = () => {
				pair.dropdown.classList.remove('open');
				const anchor = getAnchor(pair.trigger);
				if (anchor) anchor.setAttribute('aria-expanded', 'false');
				if (openName === name) openName = null;
			};

			if (immediate) {
				clearHideTimer(name);
				doHide();
			} else {
				startHideTimer(name, doHide);
			}
		}

		function startHideTimer(name, fn) {
			clearHideTimer(name);
			const id = setTimeout(fn, 150);
			hideTimers.set(name, id);
		}

		function clearHideTimer(name) {
			const id = hideTimers.get(name);
			if (id) {
				clearTimeout(id);
				hideTimers.delete(name);
			}
		}

		function insidePairEl(name, target) {
			const pair = pairs.find(p => p.name === name);
			if (!pair) return false;
			return pair.trigger.contains(target) || pair.dropdown.contains(target);
		}

		// Hover and focus handlers
		pairs.forEach(({ name, trigger, dropdown }) => {
			// Accessibility: initialize aria-expanded on anchors
			const anchor = getAnchor(trigger);
			if (anchor) {
				anchor.setAttribute('aria-haspopup', 'true');
				anchor.setAttribute('aria-expanded', 'false');
				anchor.setAttribute('role', 'button');
			}

			// Hover only when supported
			if (supportsHover) {
				trigger.addEventListener('mouseenter', () => showDropdown(name));
				trigger.addEventListener('mouseleave', () => hideDropdown(name));
				dropdown.addEventListener('mouseenter', () => showDropdown(name));
				dropdown.addEventListener('mouseleave', () => hideDropdown(name));
			}

			// Keyboard focus support
			trigger.addEventListener('focusin', () => showDropdown(name));
			trigger.addEventListener('focusout', (e) => {
				// If focus moves outside trigger+dropdown, hide
				setTimeout(() => {
					const active = document.activeElement;
					if (!insidePairEl(name, active)) hideDropdown(name, true);
				}, 0);
			});

			// Optional: click on the trigger toggles on touch/non-hover devices
			trigger.addEventListener('click', (e) => {
				if (supportsHover) return; // do not toggle on desktop via click
				const isInsideLink = e.target.closest('a[href]');
				// If the click is on the label (no href) or on the container, toggle dropdown
				if (!isInsideLink || isInsideLink.getAttribute('href') === '#') {
					e.preventDefault();
					if (openName === name) hideDropdown(name, true); else showDropdown(name);
				}
			});
		});

		// Close on outside click
		document.addEventListener('pointerdown', (e) => {
			if (!openName) return;
			const isInsideAny = pairs.some(p => p.trigger.contains(e.target) || p.dropdown.contains(e.target));
			if (!isInsideAny) {
				hideDropdown(openName, true);
			}
		});

		// Close on Escape
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && openName) {
				hideDropdown(openName, true);
				// Return focus to the trigger anchor for accessibility
				const pair = pairs.find(p => p.name === openName);
				if (pair) {
					const anchor = getAnchor(pair.trigger);
					if (anchor) anchor.focus();
				}
			}
		});
	});
})();

