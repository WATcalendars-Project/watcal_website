document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("topbar");
    if (!header) return;

    const DEBUG = false; // set true to see logs
    const log = (...a) => DEBUG && console.log('[topbar]', ...a);

    function getScrollContainers() {
        const picked = [];
        const guess = document.querySelectorAll(
            'main, #content, [data-scroll], [data-scroll-container], [data-scrollable], .scroll-container, .content, body, html'
        );
        guess.forEach(el => {
            const cs = getComputedStyle(el);
            const oy = cs.overflowY;
            if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
                picked.push(el);
            }
        });
        if (!picked.length) {
            const se = document.scrollingElement || document.documentElement || document.body;
            if (se.scrollHeight > se.clientHeight + 1) picked.push(se);
        }
        return Array.from(new Set(picked));
    }

    // Zawsze używaj window jako scrollEl
    const scrollEl = window;
    const tol = 2;
    const topClamp = 30;
    let lastY = window.scrollY;
    let ticking = false;
    const getY = () => window.scrollY;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const y = getY();
            console.log('[topbar] scroll event, y:', y);

            // don't hide when mobile menu is open
            if (header.classList.contains('active')) {
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
                console.log('[topbar] hide (scroll down)', dy);
                header.classList.add('hide'); // scrolling down
            } else if (dy < -tol) {
                console.log('[topbar] show (scroll up)', dy);
                header.classList.remove('hide'); // scrolling up
            }
            lastY = y;
        });
    }

    function attach() {
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            lastY = getY();
            if (getY() <= topClamp) header.classList.remove('hide');
        });
    }

    attach();
    onScroll(); 
});

function openTopbar() {
  document.body.classList.add('noscroll');
}

function closeTopbar() {
  document.body.classList.remove('noscroll');
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