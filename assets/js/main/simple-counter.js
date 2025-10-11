// Prosty licznik subskrypcji - wspólny dla wszystkich użytkowników
class SimpleSubscriptionCounter {
    constructor() {
        // Automatycznie wykryj poprawną ścieżkę do API
        const currentPath = window.location.pathname;
        if (currentPath.includes('/web/')) {
            this.endpoint = '../api/simple-counter.php'; // Z podstron
        } else {
            this.endpoint = './api/simple-counter.php';  // Z strony głównej
        }
        this.fallbackCount = 31;
        this.init();
    }

    init() {
        this.loadCount();
        this.setupClickTracking();
    }

    // Załaduj i wyświetl aktualną liczbę
    async loadCount() {
        try {
            const response = await fetch(this.endpoint);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dane z API:', data);
                this.displayCount(data.count);
            } else {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            
            // Spróbuj alternatywnej ścieżki
            try {
                const altEndpoint = '/api/simple-counter.php';
                const altResponse = await fetch(altEndpoint);
                if (altResponse.ok) {
                    const data = await altResponse.json();
                    this.endpoint = altEndpoint; // Zapisz działającą ścieżkę
                    this.displayCount(data.count);
                    return;
                }
            } catch (altError) {
            }
            
            this.displayCount(this.fallbackCount);
        }
    }

    // Wyświetl liczbę z animacją
    displayCount(targetCount) {
        const counter = document.getElementById('subscription-counter');
        if (!counter) return;

        // Animacja licznika
        const duration = 2000; // 2 sekundy
        const start = Date.now();
        const startCount = 0;

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startCount + (targetCount - startCount) * easeOut);
            
            counter.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    // Wyślij kliknięcie na serwer (+1 do licznika)
    async trackClick() {
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    // Zaktualizuj wyświetlaną liczbę
                    this.displayCount(data.count);
                }
            } else {
            }
        } catch (error) {
        }
    }

    // Śledź wszystkie kliknięcia w subskrypcje
    setupClickTracking() {
        // iOS calendar subscription links (webcal://)
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href^="webcal://"]');
            if (link) {
                this.trackClick();
            }
        });

        // Download .ICS buttons
        document.addEventListener('click', (event) => {
            const button = event.target.closest('#download-ics-btn, button[data-i18n="groups.download_btn"]');
            if (button) {
                this.trackClick();
            }
        });

        // Google Calendar subscription links
        document.addEventListener('click', (event) => {
            const gcalLink = event.target.closest('a[href*="calendar.google.com"]');
            if (gcalLink) {
                this.trackClick();
            }
        });

        // Subscribe Calendar links (general)
        document.addEventListener('click', (event) => {
            const subscribeLink = event.target.closest('a[id*="subscribe"], a[href*="subscribe"]');
            if (subscribeLink) {
                this.trackClick();
            }
        });
    }
}

// Uruchom licznik gdy strona się załaduje
document.addEventListener('DOMContentLoaded', () => {
    window.subscriptionCounter = new SimpleSubscriptionCounter();
});
