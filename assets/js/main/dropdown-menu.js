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
    let hideTimeout;

    function showMenu() {
        const rect = trigger.getBoundingClientRect();
        menu.classList.add('open');
        requestAnimationFrame(() => {
            const menuRect = menu.getBoundingClientRect();
            menu.style.top = (rect.bottom + 2) + 'px';
            menu.style.left = (rect.right - menuRect.width) + 'px';
        });
    }

    function hideMenu() {
        menu.classList.remove('open');
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
        hideTimeout = setTimeout(hideMenu, 0);
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
            if (d !== dropdown) d.classList.remove('open');
        });

        // Przełącz aktualnie kliknięty: jeśli był otwarty — zamknij, jeśli nie — otwórz
        dropdown.classList.toggle('open', !isOpen);
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


