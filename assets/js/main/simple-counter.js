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
        console.log('🔄 Ładuję licznik z:', this.endpoint);
        try {
            const response = await fetch(this.endpoint);
            console.log('📡 Odpowiedź:', response.status, response.statusText);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dane z API:', data);
                this.displayCount(data.count);
            } else {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.warn('❌ Nie można pobrać licznika, używam fallback:', error);
            console.log('🔄 Próbuję alternatywną ścieżkę...');
            
            // Spróbuj alternatywnej ścieżki
            try {
                const altEndpoint = '/api/simple-counter.php';
                const altResponse = await fetch(altEndpoint);
                if (altResponse.ok) {
                    const data = await altResponse.json();
                    console.log('✅ Sukces z alternatywną ścieżką:', data);
                    this.endpoint = altEndpoint; // Zapisz działającą ścieżkę
                    this.displayCount(data.count);
                    return;
                }
            } catch (altError) {
                console.warn('❌ Alternatywna ścieżka też nie działa:', altError);
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
        console.log('🔥 KLIKNIĘCIE! Wysyłam POST do:', this.endpoint);
        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 POST Odpowiedź:', response.status, response.statusText);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Dane z POST:', data);
                if (data.success) {
                    // Zaktualizuj wyświetlaną liczbę
                    this.displayCount(data.count);
                    console.log('🎉 Subskrypcja zarejestrowana! Nowa liczba:', data.count);
                }
            } else {
                console.error('❌ POST błąd:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('❌ Nie udało się zarejestrować kliknięcia:', error);
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
