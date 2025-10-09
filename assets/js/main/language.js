// Lightweight client-side i18n toggler for EN/PL
(function () {
  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = document.documentElement.lang || 'pl';

  const translations = {
    en: {
        // Index page
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.schedules': 'Schedules',
      'nav.changelog': 'Changelog',
      'nav.more': 'More',
      'nav.more.installer': 'Local Installation',
      'nav.more.dependencies': 'Dependencies',
      'nav.more.tutorial': 'Get Started',
      'nav.more.support': 'Donate',
      'nav.more.showcase': 'Showcase',
      'nav.more.feedback': 'Feedback',
      'nav.more.license': 'License',

      'hero.title.desktop': 'The WATcalendars for<br>.ICS Schedules',
      'hero.desktop.text': 'Created to simplify access to academic<br>\nschedules and ensure continuous development<br>\nthrough openness and collaboration.',
      'hero.buttons.get-started': 'Get Started',
      'hero.buttons.schedules': 'Schedules',
      'hero.buttons.github': 'GitHub',
      'stats.faculties1': 'The calendars were subscribed by ',
      'stats.faculties2': ' users.',
      'hero.title.media': 'The WATcalendars for .ICS Schedules',
      'hero.media.tablet': 'Created to simplify access to academic schedules and ensure\n                            continuous development through openness and\n                            collaboration.',
      'hero.media.mobile': 'Created to simplify access to academic schedules\n                            and ensure continuous development through\n                            openness and collaboration.',

      'three.detailed.title': 'Detailed View',
      'three.detailed.text': "Full course information: the lecturer’s name,\n                            classroom and building, complete subject title,\n                            order of classes, and type of activity.",
      'three.oss.title': 'Open-Source',
      'three.oss.text': 'Users can review and modify as needed.\n                            Active feedback and contributions keep the project reliable and future-proof.',
      'three.auto.title': 'Automated Up-to-Date',
      'three.auto.text': 'Scripts for scraping, parsing, fetching, and saving\n                            are run every day so schedules always stay current.',

      'showcase.title': 'Showcase',

      'tutorial.title': 'Get Your Calendar',
      'tutorial.step1': 'Open the <a href="/web/Schedules.html" class="schedules">Schedules</a> menu and choose your Faculty.',
      'tutorial.step2': 'Select the group of your choice.',
      'tutorial.step3': 'On <img src="/img/logo/apple-logo.png" alt="apple-logo"> iPhone, the schedule will appear as a calendar subscription.',
      'tutorial.step4': 'Once you confirm with the <strong>Find</strong> option, your group schedule will\n                        be available directly in your calendar app.',

      'install.title': 'Manual Installation',
      'install.p1': 'You can install the WATcalendars project available on Github that include <img src="/img/icons/python-icon.png" alt="python-icon"> Python Scripts.',
      'install.p2': 'Clone the repository to your local machine.',
      'install.p3': 'Next add rights to the setup script.',
      'install.p4': 'Running following script will automaticaly install required dependencies.',
      'install.p5': 'After that, you can Use the scraping scripts, Change them, Customize them, Fix as needed.',
      'install.p6': 'In the repository check "help.txt" file for available options and useful informations or simply type cat help.txt:',
      'install.p7': 'Setup script to install the required dependencies are included for\n                        <img src="/img/distribution/arch.png" alt=Arch> <strong>Arch</strong>.\n                        <br>For other distros, please install <a href="/web/Dependencies.html">the dependencies</a> first.',

      'footer.mit': 'Released under the MIT license',
      'footer.copyright': 'Copyright © 2025 Dominik Serafin',

  // schedules page
  'hero.schedules.title': 'Select your Faculty below',
  // groups selector (IOE and similar)
  'groups.loading': 'Loading…',
  'groups.none.title': 'No available groups (.ics/.png)',
  'groups.none.text': 'No available groups to display.',
  'groups.png_from': 'PNG generated from:',
  'groups.subscribe.link': 'Subscribe Calendar',
  'groups.subscribe.orcopy': 'or copy URL to subscribe:',
  'groups.subscribe.gcal': 'Subscribe in Google Calendar',
  'groups.download_btn': 'Download .ICS file',
  'groups.fetch_error': 'Failed to fetch the list of groups. Try again later.' ,

  // dependencies page
  'dependencies.title': 'Dependencies',
  'dependencies.description': 'You can install the WATcalendars Project on every Linux distribution if you install the following packages upfront.',
  'dependencies.note.title': 'Note',
  'dependencies.note.text': `Playwright is officially supported only on Debian 12, Debian 13, Ubuntu 22.04 and Ubuntu 24.04 (for both x86-64 and ARM64 architectures).<br>On other Linux distributions, Playwright may not work correctly and could require workarounds such as using Docker or creating symbolic links for missing libraries.`,
  'dependencies.last_updated': 'Last updated: 4/9/25, 10:05 PM',

  // license page
  'footer.license': 'License',
  'license.text': `MIT License<br><br>
Copyright © 2025 Dominik Serafin<br><br>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:<br><br>
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.<br><br>
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
      // groups page
      'groups.title': 'Select group:',

      // about page
      'about.coming_soon': 'Coming Soon!',
    },
    pl: {
        // Index page
      'nav.home': 'Strona główna',
      'nav.about': 'O projekcie',
      'nav.schedules': 'Plany zajęć',
      'nav.changelog': 'Dziennik zmian',
      'nav.more': 'Więcej',
      'nav.more.installer': 'Lokalna instalacja',
      'nav.more.dependencies': 'Zależności',
      'nav.more.tutorial': 'Rozpocznij',
      'nav.more.support': 'Wesprzyj',
      'nav.more.showcase': 'Prezentacja',
      'nav.more.feedback': 'Kontakt',
      'nav.more.license': 'Licencja',

      'hero.title.desktop': 'WATcalendars dla<br>harmonogramów .ICS',
      'hero.desktop.text': 'Utworzone, aby uprościć dostęp do planów zajęć<br>\noraz zapewnić ciągły rozwój dzięki otwartości\n<br>i współpracy.',
      'hero.buttons.get-started': 'Rozpocznij',
      'hero.buttons.schedules': 'Rozkłady zajęć',
      'hero.buttons.github': 'GitHub',
      'stats.faculties1': 'Kalendarze wykorzystało już ',
      'stats.faculties2': ' użytkowników.',
      'hero.title.media': 'WATcalendars dla harmonogramów .ICS',
      'hero.media.tablet': 'Utworzone, aby uprościć dostęp do planów zajęć oraz zapewnić\n                            ciągły rozwój dzięki otwartości i współpracy.',
      'hero.media.mobile': 'Utworzone, aby uprościć dostęp do planów zajęć\n                            oraz zapewnić ciągły rozwój dzięki otwartości i współpracy.',

      'three.detailed.title': 'Szczegółowy widok',
      'three.detailed.text': 'Pełne informacje o zajęciach: prowadzący,\n                            sala i budynek, pełny tytuł przedmiotu, kolejność zajęć\n                            oraz rodzaj aktywności.',
      'three.oss.title': 'Open-Source',
      'three.oss.text': 'Użytkownicy mogą przeglądać i modyfikować według potrzeb.\n                            Aktywne opinie i kontrybucje utrzymują projekt niezawodnym i przyszłościowym.',
      'three.auto.title': 'Automatycznie aktualne',
      'three.auto.text': 'Skrypty do scrapowania, parsowania, pobierania i zapisywania\n                            uruchamiane są codziennie, więc plany są zawsze aktualne.',

      'showcase.title': 'Prezentacja',

      'tutorial.title': 'Zdobądź swój kalendarz',
      'tutorial.step1': 'Otwórz menu <a href="/web/Schedules.html" class="schedules">Plany</a> i wybierz swoj Wydział.',
      'tutorial.step2': 'Wybierz interesującą Cię grupę.',
      'tutorial.step3': 'Na <img src="/img/logo/apple-logo.png" alt="apple-logo"> iPhone, plan pojawi się jako subskrypcja kalendarza.',
      'tutorial.step4': 'Po potwierdzeniu opcją <strong>Znajdź</strong>, plan grupy będzie\n                        dostępny bezpośrednio w aplikacji Kalendarz.',

      'install.title': 'Instalacja ręczna',
      'install.p1': 'Możesz zainstalować projekt WATcalendars dostępny na Githubie, który zawiera <img src="/img/icons/python-icon.png" alt="python-icon"> skrypty Pythona.',
      'install.p2': 'Sklonuj repozytorium na swój komputer.',
      'install.p3': 'Następnie nadaj uprawnienia do skryptu instalacyjnego.',
      'install.p4': 'Uruchomienie poniższego skryptu automatycznie zainstaluje wymagane zależności.',
      'install.p5': 'Po tym możesz używać skryptów do scrapowania, zmieniać je, dostosowywać i poprawiać.',
      'install.p6': 'W repozytorium sprawdź plik "help.txt" po dostępne opcje i informacje lub wpisz: cat help.txt:',
      'install.p7': 'Skrypt instalacyjny instalujący wymagane zależności jest dostępny dla\n                        <img src="/img/distribution/arch.png" alt=Arch> <strong>Arch</strong>.\n                        <br>Dla innych dystrybucji najpierw zainstaluj <a href="/web/Dependencies.html">zależności</a>.',

      'footer.mit': 'Wydane na licencji MIT',
      'footer.copyright': 'Copyright © 2025 Dominik Serafin',

      // schedules page
      'hero.schedules.title': 'Wybierz swój Wydział poniżej',
  // groups selector (IOE and similar)
  'groups.loading': 'Ładowanie…',
  'groups.none.title': 'Brak dostępnych grup (.ics/.png)',
  'groups.none.text': 'Brak dostępnych grup do wyświetlenia.',
  'groups.png_from': 'PNG wygenerowane z:',
  'groups.subscribe.link': 'Subskrybuj kalendarz',
  'groups.subscribe.orcopy': 'albo skopiuj URL do subskrypcji:',
  'groups.subscribe.gcal': 'Subskrybuj w Google Kalendarzu',
  'groups.download_btn': 'Pobierz plik .ICS',
  'groups.fetch_error': 'Nie udało się pobrać listy grup. Spróbuj ponownie później.' ,

  // dependencies page
  'dependencies.title': 'Zależności',
  'dependencies.description': 'Możesz zainstalować projekt WATcalendars na każdej dystrybucji Linuksa, jeśli wcześniej zainstalujesz poniższe pakiety.',
  'dependencies.note.title': 'Uwaga',
  'dependencies.note.text': `Playwright jest oficjalnie wspierany tylko na Debian 12, Debian 13, Ubuntu 22.04 i Ubuntu 24.04 (dla architektur x86-64 i ARM64).<br>Na innych dystrybucjach Linuksa Playwright może nie działać poprawnie i może wymagać obejść, takich jak użycie Dockera lub tworzenie dowiązań symbolicznych dla brakujących bibliotek.`,
  'dependencies.last_updated': 'Ostatnia aktualizacja: 4/9/25, 10:05 PM',

      // license page
      'footer.license': 'Licencja',
      'license.text': `Licencja MIT<br><br>
Copyright © 2025 Dominik Serafin<br><br>
Niniejszym udziela się każdej osobie, która wejdzie w posiadanie kopii tego oprogramowania i powiązanej dokumentacji ("Oprogramowanie"), bezpłatnego zezwolenia na nieograniczone korzystanie z Oprogramowania, w tym bez ograniczeń prawa do używania, kopiowania, modyfikowania, łączenia, publikowania, rozpowszechniania, udzielania sublicencji i/lub sprzedaży kopii Oprogramowania, a także zezwalania osobom, którym Oprogramowanie zostało dostarczone, na to samo, z zastrzeżeniem następujących warunków:<br><br>
Powyższa informacja o prawach autorskich oraz niniejsza zgoda muszą być dołączone do wszystkich kopii lub istotnych części Oprogramowania.<br><br>
Oprogramowanie dostarczane jest "tak, jak jest", bez jakiejkolwiek gwarancji, wyraźnej bądź dorozumianej, w tym między innymi gwarancji przydatności handlowej, przydatności do określonego celu oraz braku naruszenia praw. W żadnym wypadku autorzy ani posiadacze praw autorskich nie ponoszą odpowiedzialności za jakiekolwiek roszczenia, szkody lub inne zobowiązania, niezależnie od tego, czy wynikają one z umowy, czynu niedozwolonego, czy też w inny sposób, a powstałe w związku z Oprogramowaniem lub korzystaniem z niego, bądź w związku z innymi działaniami dotyczącymi Oprogramowania.`,

      // groups page
      'groups.title': 'Wybierz grupę:',

      // about page
      'about.coming_soon': 'Wkrótce!',

    }

  };

  function applyTranslations(lang) {
    const root = document.documentElement;
    root.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const isHtml = el.hasAttribute('data-i18n-html') || key === 'license.text' || key === 'dependencies.note.text';
      const dict = translations[lang] || {};
      const text = dict[key];
      if (typeof text === 'string') {
        if (isHtml) {
          el.innerHTML = text;
        } else {
          el.textContent = text;
        }
      }
    });
  }

  // --- Language code badge next to the toggle ---
  function ensureLangCodeLabels() {
    const labels = document.querySelectorAll('.language label');
    labels.forEach(label => {
      let codeSpan = label.querySelector('.lang-code');
      if (!codeSpan) {
        codeSpan = document.createElement('span');
        codeSpan.className = 'lang-code';
        // Minimal styling so it sits nicely to the right of the toggle
        codeSpan.style.marginLeft = '8px';
        codeSpan.style.fontWeight = '700';
        codeSpan.style.fontSize = '12px';
        codeSpan.style.color = '#fff';
        codeSpan.style.opacity = '0.85';
        label.appendChild(codeSpan);
      }
    });
  }

  function updateLangCodeLabels(lang) {
    const abbr = (lang || 'pl').toUpperCase();
    document.querySelectorAll('.language label .lang-code').forEach(span => {
      span.textContent = abbr;
    });
  }

  function setCheckboxesForLang(lang) {
    const shouldBeChecked = lang === 'en';
    document.querySelectorAll('#checkbox').forEach(cb => {
      cb.checked = shouldBeChecked;
    });
  }

  // Expose a refresh hook and event listener for dynamic content
  window.i18nApply = function() {
    const lang = localStorage.getItem(STORAGE_KEY) || getInitialLang();
    applyTranslations(lang);
  };
  window.addEventListener('i18n:refresh', () => {
    window.i18nApply();
  });

  function getInitialLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'pl') return saved;
    // Fallback to html[lang] or browser
    const htmlLang = (document.documentElement.lang || '').toLowerCase();
    if (htmlLang.startsWith('pl')) return 'pl';
    if (htmlLang.startsWith('en')) return 'en';
    const nav = navigator.language || navigator.userLanguage || 'en';
    return nav.toLowerCase().startsWith('pl') ? 'pl' : 'en';
  }

  function init() {
    const initial = getInitialLang();

    // Ensure the PL/EN code label exists next to each toggle
    ensureLangCodeLabels();

    // Sync all toggle checkboxes (desktop + mobile) to the current language
    setCheckboxesForLang(initial);
    updateLangCodeLabels(initial);

    // Wire up change handler for all toggles and keep them in sync
    let syncing = false;
    document.querySelectorAll('#checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        if (syncing) return;
        syncing = true;
        const lang = cb.checked ? 'en' : 'pl';
        localStorage.setItem(STORAGE_KEY, lang);
        setCheckboxesForLang(lang);
        updateLangCodeLabels(lang);
        applyTranslations(lang);
        syncing = false;
      });
    });

    // Apply translations on load
    applyTranslations(initial);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
