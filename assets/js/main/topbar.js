document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("topbar");
    if (!header) return;

    const DEBUG = false; // set true to see logs
    const log = (...a) => DEBUG && console.log('[topbar]', ...a);

    // Robust getter for vertical scroll position
    const getY = () => {
        // Prefer scrollingElement, then documentElement/body, then window
        const se = document.scrollingElement || document.documentElement || document.body;
        return (
            (se && typeof se.scrollTop === 'number' ? se.scrollTop : 0) ||
            (typeof window.pageYOffset === 'number' ? window.pageYOffset : 0) ||
            (typeof window.scrollY === 'number' ? window.scrollY : 0) ||
            0
        );
    };

    const tol = 2;        // minimal delta to toggle
    const topClamp = 30;  // always show near top
    let lastY = getY();
    let ticking = false;

    // When dropdown menus are open or body is locked, don't auto-hide
    const isInteractionOpen = () => {
        if (header.classList.contains('active')) return true; // mobile menu
        if (document.body.classList.contains('noscroll')) return true; // body locked
        // any desktop dropdown open
        return (
            document.querySelector('.menu-schedules.open, .menu-changelog.open, .menu-more.open') !== null
        );
    };

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const y = getY();
            log('scroll y=', y);

            // don't hide when menus are open / interaction overlays
            if (isInteractionOpen()) {
                header.classList.remove('hide');
                lastY = y;
                return;
            }

            if (y <= topClamp) {
                header.classList.remove('hide');
                lastY = y;
                return;
            }

            const dy = y - lastY;
            if (dy > tol) {
                // scrolling down
                header.classList.add('hide');
            } else if (dy < -tol) {
                // scrolling up
                header.classList.remove('hide');
            }
            lastY = y;
        });
    }

    function attach() {
        // Listen on multiple potential emitters for robustness
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('scroll', onScroll, { passive: true });

        // Wheel hint: when components prevent page scroll (e.g., tutorial slider),
        // still infer intent to hide/show the topbar from wheel direction.
        const onWheel = (e) => {
            // Ignore if overlays/menus are open
            if (isInteractionOpen()) return;
            const y = getY();
            const threshold = 2; // minimal wheel delta to react
            if (y <= topClamp && e.deltaY < 0) {
                header.classList.remove('hide');
                lastY = y;
                return;
            }
            if (e.deltaY > threshold) {
                header.classList.add('hide');
            } else if (e.deltaY < -threshold) {
                header.classList.remove('hide');
            }
            // keep lastY in sync with current page scroll position
            lastY = y;
        };
        window.addEventListener('wheel', onWheel, { passive: true });

        // touchmove as hint is less reliable cross-devices; keep scroll-based logic
        window.addEventListener('touchmove', onScroll, { passive: true });

        window.addEventListener('resize', () => {
            lastY = getY();
            if (getY() <= topClamp) header.classList.remove('hide');
        });

        // When visibility changes (tab switch), reset baseline
        document.addEventListener('visibilitychange', () => {
            lastY = getY();
        });
    }

    attach();
    onScroll();
});

// Avoid redefining if another script already provides these helpers
function openTopbar() {
  if (!document.body.classList.contains('noscroll')) {
    document.body.classList.add('noscroll');
  }
}

function closeTopbar() {
  if (document.body.classList.contains('noscroll')) {
    document.body.classList.remove('noscroll');
  }
}

/* ------------------
     Topbar nav: keep clicked/current link highlighted
     - Adds `.current` to nav links when user clicks them, when the URL path matches,
         or when scrolling through sections (using IntersectionObserver).
     - Graceful fallback: if IntersectionObserver not supported, highlight by hash on load/click.
*/
(function() {
    const navLinks = Array.from(document.querySelectorAll('nav a'));
    if (!navLinks.length) return;

    function clearCurrent() {
        navLinks.forEach(a => a.classList.remove('current'));
    }

    function setCurrent(link) {
        clearCurrent();
        if (link) link.classList.add('current');
    }

    // on click, mark clicked link current (useful for same-page navigation)
    navLinks.forEach(a => {
        a.addEventListener('click', (e) => {
            // If link is anchor to same page, still mark it
            setCurrent(a);
        });
    });

    // highlight based on pathname or href match (multi-page)
    function matchByPath() {
        const path = location.pathname.replace(/\/index\.html$/, '/');
        for (const a of navLinks) {
            try {
                const url = new URL(a.href, location.origin);
                const ahrefPath = url.pathname.replace(/\/index\.html$/, '/');
                if (ahrefPath === path) {
                    setCurrent(a);
                    return true;
                }
            } catch (e) { /* ignore invalid URLs */ }
        }
        return false;
    }

    // highlight by hash or id of section
    function highlightByHash() {
        const hash = location.hash;
        if (!hash) return false;
        const targetId = decodeURIComponent(hash.substring(1));
        const link = navLinks.find(a => {
            try { return new URL(a.href, location.origin).hash === hash; }
            catch (e) { return a.getAttribute('href') === hash; }
        });
        if (link) { setCurrent(link); return true; }
        // fallback: find a link pointing to the same id via relative href
        const rel = navLinks.find(a => a.getAttribute('href') === `#${targetId}`);
        if (rel) { setCurrent(rel); return true; }
        return false;
    }

    // IntersectionObserver to mark link when corresponding section is visible
    function setupObserver() {
        if (!('IntersectionObserver' in window)) return false;
        const idToLink = new Map();
        const targets = [];
        navLinks.forEach(a => {
            const href = a.getAttribute('href');
            if (!href) return;
            if (href.startsWith('#')) {
                const id = href.substring(1);
                const el = document.getElementById(id);
                if (el) {
                    idToLink.set(id, a);
                    targets.push(el);
                }
            }
        });
        if (!targets.length) return false;

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    const link = idToLink.get(id);
                    if (link) setCurrent(link);
                }
            });
        }, { root: null, rootMargin: '0px 0px -40% 0px', threshold: [0, 0.2, 0.5] });

        targets.forEach(t => obs.observe(t));
        return true;
    }

    // Initial highlighting order: exact path -> hash -> observer (if works)
    if (!matchByPath()) {
        if (!highlightByHash()) {
            // set up observer; if it doesn't find anything, leave state as-is
            setupObserver();
        }
    }

    // update on hashchange/navigation
    window.addEventListener('hashchange', () => {
        highlightByHash();
    });

    // update on popstate (back/forward navigation)
    window.addEventListener('popstate', () => {
        matchByPath() || highlightByHash();
    });
})();