// Topbar interactions & responsive menu
// Features:
//  - Mobile menu toggle (<1300px) using #topbar.open
//  - Dropdown open/close on click (mobile) & hover (desktop keeps existing CSS hover behavior)
//  - Close menu on outside click / Escape / resize
//  - Optional scroll hide/show (disabled for very small screens to avoid jank)
//  - Basic ARIA attributes for accessibility
//  - No dependencies

(function () {
	const topbar = document.getElementById('topbar');
	if (!topbar) return;

	const menuSvg = topbar.querySelector('.menu svg');
	const navLinksWrapper = topbar.querySelector('.navigation-links');
	const dropdownGroups = Array.from(navLinksWrapper?.children || []); // each div holding anchor + dropdown
	const BREAKPOINT = 1300;

	let lastScrollY = window.scrollY;
	let scrollLocked = false;

	// --- Helpers ---
	const isMobile = () => window.innerWidth <= BREAKPOINT;

	function openMenu() {
		// Open mobile menu; keep any previously opened dropdowns (multi-open persistence)
		topbar.classList.add('open');
		menuSvg?.classList.add('active');
		applyAriaMenu(true);
		lockBodyScroll(true);
	}

	function closeMenu() {
		// Close menu but DO NOT collapse open dropdowns (user can reopen without losing state)
		topbar.classList.remove('open');
		menuSvg?.classList.remove('active');
		applyAriaMenu(false);
		lockBodyScroll(false);
	}

	function toggleMenu() {
		if (!isMobile()) return; // ignore toggle if desktop
		topbar.classList.contains('open') ? closeMenu() : openMenu();
	}

	function applyAriaMenu(open) {
		if (!menuSvg) return;
		menuSvg.setAttribute('aria-expanded', String(open));
		menuSvg.setAttribute('aria-label', open ? 'Zamknij menu' : 'Otwórz menu');
	}

	function lockBodyScroll(lock) {
		if (lock) {
			if (!scrollLocked) {
				document.body.style.overflow = 'hidden';
				scrollLocked = true;
			}
		} else {
			if (scrollLocked) {
				document.body.style.overflow = '';
				scrollLocked = false;
			}
		}
	}

	// Close all dropdowns (used when closing entire mobile menu)
	function closeAllDropdowns() {
		dropdownGroups.forEach(group => {
			const dropdown = group.querySelector('[class^="dropdown-"]');
			const trigger = group.querySelector('a');
			if (dropdown) {
				dropdown.classList.remove('open');
				trigger?.setAttribute('aria-expanded', 'false');
			}
		});
	}

	// Toggle single dropdown; allow multiple open (no auto-closing others)
	function toggleDropdown(group) {
		const dropdown = group.querySelector('[class^="dropdown-"]');
		const trigger = group.querySelector('a');
		if (!dropdown) return;
		const willOpen = !dropdown.classList.contains('open');
		if (willOpen) {
			dropdown.classList.add('open');
		} else {
			dropdown.classList.remove('open');
		}
		trigger?.setAttribute('aria-expanded', String(willOpen));
	}

    function enhanceDropdownsForAccessibility() {
        dropdownGroups.forEach(group => {
            const dropdown = group.querySelector('[class^="dropdown-"]');
            const trigger = group.querySelector('a');
            if (!dropdown || !trigger) return;
            trigger.setAttribute('aria-haspopup', 'true');
            trigger.setAttribute('aria-expanded', 'false');

            // Mobile: click toggles
            trigger.addEventListener('click', (e) => {
                if (!isMobile() || !dropdown) return;
                const alreadyOpen = dropdown.classList.contains('open');
                if (!alreadyOpen) {
                    // first tap: open dropdown (keep others open)
                    e.preventDefault();
                    toggleDropdown(group);
                } else if (alreadyOpen && trigger.getAttribute('href')) {
                    // second tap: follow link; close entire menu for clarity
                    closeMenu();
                } else {
                    // toggle close if no href
                    e.preventDefault();
                    toggleDropdown(group);
                }
            });
        });
    }

	function handleResize() {
		if (!isMobile()) {
			// reset mobile state when going desktop
			closeMenu();
			lockBodyScroll(false);
		}
	}

	function handleOutsideClick(e) {
		if (!isMobile()) return;
		if (!topbar.contains(e.target)) {
			closeMenu();
		}
	}

	function handleKey(e) {
		if (e.key === 'Escape') {
			closeMenu();
		}
	}

	function handleScroll() {
		if (!isMobile()) return; // only on mobile for now
		const current = window.scrollY;
		const goingDown = current > lastScrollY && current > 20;
		topbar.classList.toggle('hide-on-scroll', goingDown && !topbar.classList.contains('open'));
		lastScrollY = current;
	}

	// --- Init ---
	if (menuSvg) {
		menuSvg.setAttribute('role', 'button');
		menuSvg.setAttribute('tabindex', '0');
		applyAriaMenu(false);
		menuSvg.addEventListener('click', (e) => {
			e.stopPropagation(); // prevent outside listener immediate close
			toggleMenu();
		});
		menuSvg.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleMenu();
			}
		});
	}

	enhanceDropdownsForAccessibility();

	window.addEventListener('resize', handleResize);
	document.addEventListener('click', handleOutsideClick);
	document.addEventListener('keydown', handleKey);
	window.addEventListener('scroll', handleScroll, { passive: true });

	// Close on navigation link click (mobile) after slight delay to allow user to see action
	topbar.querySelectorAll('.navigation-links a[href]').forEach(a => {
		a.addEventListener('click', () => {
			if (isMobile()) {
				setTimeout(closeMenu, 150);
			}
		});
	});
})();

