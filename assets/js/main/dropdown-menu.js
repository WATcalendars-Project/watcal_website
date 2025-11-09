document.addEventListener('DOMContentLoaded', () => {
    const topbar = document.getElementById('topbar');
    const svg = document.querySelector('.menu svg');
    if (svg && topbar) {
        svg.addEventListener('click', (e) => {
            e.stopPropagation();
            topbar.classList.toggle('active');
            
            if (topbar.classList.contains('active')) {
                openTopbar();
            } else {
                closeTopbar();
            }
        });
    }
});

function openTopbar() {
    document.body.classList.add('noscroll');
}

function closeTopbar() {
    document.body.classList.remove('noscroll');
}

function setupDropdown(triggerSelector, menuSelector) {
    const trigger = document.querySelector(triggerSelector);
    const menu = document.querySelector(menuSelector);
    // Link we want to keep visually hovered while its dropdown is open
    const hoverLink = trigger ? trigger.querySelector('a[alt="navigation-hover"]') : null;
    const topbar = document.getElementById('topbar');
    const isMore = !!(trigger && trigger.classList.contains('dropdown-more'));
    let hideTimeout;

    // Invisible bridge element to cover the gap between trigger and menu on desktop
    let bridge = null;

    function ensureBridge() {
        if (bridge) return;
        bridge = document.createElement('div');
        bridge.className = 'dropdown-hover-bridge';
        // Invisible but interactive area
        Object.assign(bridge.style, {
            position: 'fixed',
            background: 'transparent',
            pointerEvents: 'auto',
            zIndex: '99999',
            display: 'none'
        });
        bridge.addEventListener('mouseenter', () => {
            clearTimeout(hideTimeout);
            showMenu();
        });
        bridge.addEventListener('mouseleave', () => {
            hideTimeout = setTimeout(() => {
                if (!menu.matches(':hover') && !(trigger && trigger.matches(':hover'))) {
                    hideMenu();
                }
            }, 100);
        });
        document.body.appendChild(bridge);
    }

    function positionBridge() {
        if (!bridge || !trigger || !menu) return;
        if (window.innerWidth <= 850) { bridge.style.display = 'none'; return; }
        const t = trigger.getBoundingClientRect();
        const m = menu.getBoundingClientRect();
        const gapTop = t.bottom;
        const gapBottom = m.top;
        const height = Math.max(0, gapBottom - gapTop);
        // If there's overlap or no gap, hide bridge
        if (height <= 0) { bridge.style.display = 'none'; return; }
        // Cover the horizontal span overlapping trigger and menu
        const left = Math.max(0, Math.min(t.left, m.left));
        const right = Math.min(window.innerWidth, Math.max(t.right, m.right));
        const width = Math.max(0, right - left);
        if (width <= 0) { bridge.style.display = 'none'; return; }
        // Slightly enlarge for safety
        const SAFE_PAD = 2;
        bridge.style.left = (left - SAFE_PAD) + 'px';
        bridge.style.top = gapTop + 'px';
        bridge.style.width = (width + SAFE_PAD * 2) + 'px';
        bridge.style.height = Math.max(10, height) + 'px';
        bridge.style.display = 'block';
    }

    function attachBridgeListeners() {
        window.addEventListener('scroll', positionBridge, true);
        window.addEventListener('resize', positionBridge);
    }

    function detachBridgeListeners() {
        window.removeEventListener('scroll', positionBridge, true);
        window.removeEventListener('resize', positionBridge);
    }

    function showMenu() {
        const rect = trigger.getBoundingClientRect();
        // Prevent 'More' dropdown from opening if changelog is already open (avoid flicker)
        if (isMore && document.querySelector('.dropdown-changelog.open')) {
            if (hoverLink) hoverLink.classList.remove('force-hover');
            return; // skip opening 'More'
        }
        menu.classList.add('open');
        // Force persistent hover styling while dropdown visible
        if (hoverLink) hoverLink.classList.add('force-hover');
        // Mark topbar state when 'More' is open (helps CSS move elements below on mobile)
        if (isMore && topbar) topbar.classList.add('more-open');
        requestAnimationFrame(() => {
            const menuRect = menu.getBoundingClientRect();
            menu.style.top = (rect.bottom + 2) + 'px';
            // Left align dropdown with trigger's left edge; clamp so it doesn't overflow right edge
            let left = rect.left;
            const padding = 8; // small safety margin to viewport edge
            const maxLeft = window.innerWidth - menuRect.width - padding;
            if (left > maxLeft) left = Math.max(padding, maxLeft);
            menu.style.left = left + 'px';
            // Create and position bridge on desktop to span the gap
            if (window.innerWidth > 850) {
                ensureBridge();
                positionBridge();
                attachBridgeListeners();
            }
        });
    }

    function hideMenu() {
        menu.classList.remove('open');
        // Remove forced hover styling when dropdown hidden
        if (hoverLink) hoverLink.classList.remove('force-hover');
        if (isMore && topbar) topbar.classList.remove('more-open');
        // Hide and detach bridge
        if (bridge) {
            bridge.style.display = 'none';
        }
        detachBridgeListeners();
    }

    trigger.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        showMenu();
    });

    trigger.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(() => {
            if (!menu.matches(':hover')) {
                hideMenu();
            }
        }, 100);
    });

    menu.addEventListener('mouseenter', () => {
        clearTimeout(hideTimeout);
        showMenu();
    });

    menu.addEventListener('mouseleave', () => {
        hideTimeout = setTimeout(hideMenu, 100);
    });
}

setupDropdown('.dropdown-schedules', '.menu-schedules');
setupDropdown('.dropdown-changelog', '.menu-changelog');
setupDropdown('.dropdown-more', '.menu-more');

document.querySelectorAll('.dropdown-trigger').forEach(trigger => {
    trigger.addEventListener('click', function(e){
        if(window.innerWidth > 850) return;

        e.preventDefault();
        const dropdown = this.closest('.dropdown-schedules, .dropdown-changelog, .dropdown-more');
        if(!dropdown) return;

        const isOpen = dropdown.classList.contains('open');
        // Zamknij wszystkie inne otwarte dropdowny
        document.querySelectorAll('.dropdown-schedules.open, .dropdown-changelog.open, .dropdown-more.open').forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('open');
                const otherLink = d.querySelector('a[alt="navigation-hover"]');
                if (otherLink) otherLink.classList.remove('force-hover');
                // Jeśli zamykamy 'More', zdejmij stan z topbara
                if (d.classList.contains('dropdown-more')) {
                    const tb = document.getElementById('topbar');
                    if (tb) tb.classList.remove('more-open');
                }
            }
        });

        // Przełącz aktualnie kliknięty: jeśli był otwarty — zamknij, jeśli nie — otwórz
        dropdown.classList.toggle('open', !isOpen);
        const anchor = dropdown.querySelector('a[alt="navigation-hover"]');
        if (anchor) anchor.classList.toggle('force-hover', !isOpen);
        // Ustaw klasę na #topbar kiedy otwieramy/zamykamy 'More' (mobile)
        if (dropdown.classList.contains('dropdown-more')) {
            const tb = document.getElementById('topbar');
            if (tb) tb.classList.toggle('more-open', !isOpen);
        }
    });
});

// Obsługa linków anchor w menu mobilnym
document.querySelectorAll('.accordion-schedules a, .accordion-changelog a, .accordion-more a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#') || this.getAttribute('href').includes('#')) {
            const topbar = document.getElementById('topbar');
            const svg = document.querySelector('.menu svg');
            if (topbar && topbar.classList.contains('active')) {
                topbar.classList.remove('active');
                if (svg && svg.classList.contains('active')) {
                    svg.classList.remove('active');
                }
                if (typeof closeTopbar === 'function') {
                    closeTopbar();
                }
            }
        }
    });
});


