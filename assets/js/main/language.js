// Lightweight client-side i18n toggler for EN/PL
(function () {
  const STORAGE_KEY = 'lang';
  const DEFAULT_LANG = document.documentElement.lang || 'pl';

  const translations = {
    en: {
      // Feedback page
      'contact': 'Feedback & Contact',
      'contact.text': `
        WATcalendars is an ongoing project that constantly evolves to accourately refflect
        real class schedules and make them easy to follow.
        <br>
        Despite my best efforts, there may be issues - for example, a schedule
        for a specific group might display incorrectly, classes might shift or overlap, or
        certain elements may not appear as expected.
        <br><br>
        To keep the calendars accurate and reliable, <span class="strong">I'm relying on your feedback.</span>
        <br><br>
        If you notice any errors in your group's schedule or have suggestions for improvements,
        please let me know using one of the methods listed below.
      `,
      'contact.email': 'E-mail',
      'contact.email.text1': `
        You can contact me directly via email at <a href="mailto:serafin652002@gmail.com">serafin652002@gmail.com</a>,<br>
        or send a message using your preferred email client.
      `,
      'contact.email.text2': `
        <br><br>
        In your message, please include:
      `,
      'contact.email.text3': `
          <li>Short title/issue or improvements description,</li>
          <li>Date, when the issue occurred,</li>
          <li>(Optional) screenshots or examples that might help.</li>
      `,
      'contact.github': 'Reporting Issues & Suggestions',
      'contact.github.text': `
        You can also report issues or suggest improvements directly from <a class="normal" href="https://github.com/dominikx2002/WATcalendars/issues">Github</a> - it's the
        fastest way for me to respond and track progress.
        <br><br>
        Also, on the github page, you can find contributing guidelines if you want to help
        improve the project by yourself - <a class="normal" href="https://github.com/dominikx2002/WATcalendars">check it out</a>.
      `,
      'contact.important': '!Important',
      'contact.important.text': `
        Please avoid sharing any personal or sensitive information in your messages.
        I respect your privacy and will only use the information you provide to address
        the reported issues or suggestions.
      `,

      // footer
      'footer.home': 'HOME',
      'footer.home.elements': `
        <a href="/#Tutorial" alt="normal">Instructions</a>
        <a href="/#Showcase" alt="normal">Showcase</a>
        <a href="/#Installer" alt="normal">Local Installation</a>
        <a href="/#support" alt="normal">Donate</a>
      `,
      'footer.about': 'ABOUT PROJECT',
      'footer.about.elements': `
        <a href="/about/1" alt="normal">How it works</a>
        <a href="/about/2" alt="normal">1. Python Scripts</a>
        <a href="/about/3" alt="normal">2. Github Actions</a>
        <a href="/about/4" alt="normal">3. Deployment</a>
      `,
      'footer.schedules': 'SCHEDULES',
      'footer.more': 'MORE',
      'footer.more.elements': `
        <a href="/dependencies/" alt="normal">Dependencies</a>
        <a href="https://github.com/dominikx2002/WATcalendars/activity" target="_blank" alt="normal">GitHub Actions</a>
        <div class="buttons">
            <a href="/" class="get-started" data-i18n="footer.get-started">GO TO HOME PAGE</a>
            <a href="https://github.com/dominikx2002/WATcalendars" class="github" target="_blank">GITHUB</a>
        </div>
        <a href="/feedback/" data-i18n="footer.feedback" alt="sections2">FEEDBACK</a>
        <a href="/privacypolicy/" data-i18n="privacypolicy.feedback" alt="sections2">PRIVACY POLICY</a>
        <a href="/license/" alt="sections2">LICENSE</a>
        <a href="/license/" alt="signature">© DOMINIK SERAFIN 2025</a>
      `,

      // topbar
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.schedules': 'Schedules ',
      'nav.project': 'Project ',
      'nav.changelog': 'GitHub Actions',
      'nav.more': 'More',
      'nav.more.tutorial': 'Instructions',
      'nav.more.support': 'Donate',
      'nav.more.installer': 'Local Installation',
      'nav.more.dependencies': 'Dependencies',
      'nav.more.showcase': 'Showcase',
      'nav.more.feedback': 'Feedback',
      'nav.more.license': 'License',

      // dependencies page
      'dependencies.title': 'Dependencies',
      'dependencies.description': 'You can install the WATcalendars Project on every Linux distribution if you install the following packages upfront.',
      'dependencies.note.title': 'Note',
      'dependencies.note.text': `Playwright is officially supported only on Debian 12, Debian 13, Ubuntu 22.04 and Ubuntu 24.04 (for both x86-64 and ARM64 architectures).<br>On other Linux distributions, Playwright may not work correctly and could require workarounds such as using Docker or creating symbolic links for missing libraries.`,
      'dependencies.last_updated': 'Last updated: 20/10/25, 10:05 AM',

      // schedules page
      'hero.schedules.title': 'Select your Faculty below',

      // groups selector
      'groups.title': 'Select group:',
      'groups.none.text': '// Select a group to see options and preview.',
      'groups.subscribe.link': 'Subscribe Calendar',
      'groups.subscribe.orcopy': 'or Copy webcal URL to subscribe in Apple Calendar settings:',
      'groups.download': 'you can also Download .ICS file to import into calendar apps:',
      'groups.download_btn': 'Download .ICS',
      'groups.subscribe.gcal': 'or go to Google Calendar to add by URL:',
      'groups.subscribe.gcal.btn': 'Go to Google Calendar',
      'groups.png_from': '// PNG screenshoted from:',

      // privacy policy
      'privacy': 'Privacy Policy',
      'privacy.text': `
        This website does not collect, store, or process any personal data from its visitors.
        I do not use cookies, analytics tools, or any third-party services that track users.
        If this changes in the future, this policy will be updated accordingly.
      `,

        // Index page

      'hero.title.desktop': 'The WATcalendars for<br>.ICS Schedules',
      'hero.desktop.text': 'Created to simplify access to academic<br>\nschedules and ensure continuous development<br>\nthrough openness and collaboration.',
      'hero.buttons.get-started': 'Get Started',
      'hero.buttons.schedules': 'Schedules',
      'hero.buttons.github': 'GitHub',
      'stats.faculties1': 'The calendars have been subscribed by ',
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
      'tutorial.step1': 'Open the <a href="/schedules/" class="schedules">Schedules</a> menu and choose your Faculty.',
      'tutorial.step2': 'Select the group of your choice.',
      'tutorial.step3': 'On <img src="/assets/images/logo/apple-logo.png" alt="apple-logo"> iPhone, the schedule will appear as a calendar subscription.',
      'tutorial.step4': 'Once you confirm with the <strong>Find</strong> option, your group schedule will\n                        be available directly in your calendar app.',

      'install.title': 'Manual Installation',
      'install.p1': 'You can install the WATcalendars project available on Github that include <img src="/assets/images/icons/python-icon.png" alt="python-icon"> Python Scripts.',
      'install.p2': 'Clone the repository to your local machine.',
      'install.p3': 'Next add rights to the setup script.',
      'install.p4': 'Running following script will automaticaly install required dependencies.',
      'install.p5': 'After that, you can Use the scraping scripts, Change them, Customize them, Fix as needed.',
      'install.p6': 'In the repository check "help.txt" file for available options and useful informations or simply type cat help.txt:',
      'install.p7': 'Setup script to install the required dependencies are included for\n                        <img src="/assets/images/distribution/arch.png" alt=Arch> <strong>Arch</strong>.\n                        <br>For other distros, please install <a href="/web/Dependencies.html">the dependencies</a> first.',

      'footer.mit': 'Released under the MIT license',
      'footer.copyright': 'Copyright © 2025 Dominik Serafin',






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


      // about page
      'about.coming_soon': 'Coming Soon!',
    },
    pl: {
      // Feedback page
      'contact': 'Feedback & Kontakt',
      'contact.text': `
        WATcalendars to ciągły projekt, który nieustannie ewoluuje, aby dokładnie odzwierciedlać
        rzeczywiste harmonogramy zajęć i ułatwiać ich śledzenie.
        <br>
        Mimo moich najlepszych starań, mogą wystąpić problemy - na przykład harmonogram
        dla konkretnej grupy może być wyświetlany niepoprawnie, zajęcia mogą się przesuwać lub nakładać, lub
        niektóre elementy mogą nie pojawiać się zgodnie z oczekiwaniami.
        <br><br>
        Aby utrzymać kalendarze w dokładności i niezawodności, <span class="strong">polegam na Twojej opinii.</span>
        <br><br>
        Jeśli zauważysz jakiekolwiek błędy w harmonogramie swojej grupy lub masz sugestie dotyczące ulepszeń,
        daj mi znać, korzystając z jednej z metod wymienionych poniżej.
      `,
      'contact.email': 'E-mail',
      'contact.email.text1': `
        Możesz skontaktować się ze mną bezpośrednio za pomocą e-maila na adres <a href="mailto:serafin652002@gmail.com">serafin652002@gmail.com</a>,<br>
        lub wysłać wiadomość, korzystając z preferowanego klienta poczty e-mail.
      `,
      'contact.email.text2': `
        <br><br>
        W wiadomości proszę uwzględnić:
      `,
      'contact.email.text3': `
        <li>Krótki tytuł/opis problemu lub sugestii dotyczącej ulepszeń,</li>
        <li>Data, kiedy wystąpił problem,</li>
        <li>(Opcjonalnie) zrzuty ekranu lub przykłady, które mogą pomóc.</li>
      `,
      'contact.github': 'Zgłaszanie problemów i sugestii',
      'contact.github.text': `
        Możesz również zgłaszać problemy lub sugerować ulepszenia bezpośrednio z poziomu <a class="normal" href="https://github.com/dominikx2002/WATcalendars/issues">Github</a> - to najszybszy sposób dla mnie, aby odpowiedzieć i śledzić postępy.
        <br><br>
        Ponadto na stronie github możesz znaleźć wytyczne dotyczące współpracy, jeśli chcesz samodzielnie pomóc w ulepszaniu projektu - <a class="normal" href="https://github.com/dominikx2002/WATcalendars">sprawdź to</a>.
      `,
      'contact.important': '!Ważne',
      'contact.important.text': `
        Unikaj udostępniania jakichkolwiek danych osobowych lub wrażliwych informacji w swoich wiadomościach.
        Szanuję Twoją prywatność i wykorzystam tylko informacje, które podasz, aby zająć się
        zgłoszonymi problemami lub sugestiami.
      `,

      // footer
      'footer.home': 'STRONA GŁÓWNA',
      'footer.home.elements': `
        <a href="/#Tutorial" alt="normal">Instrukcje</a>
        <a href="/#Showcase" alt="normal">Prezentacja</a>
        <a href="/#Installer" alt="normal">Instalacja lokalna</a>
        <a href="/#support" alt="normal">Wsparcie</a>
      `,
      'footer.about': 'O PROJEKCIE',
      'footer.about.elements': `
        <a href="/about/1" alt="normal">Jak to działa</a>
        <a href="/about/2" alt="normal">1. Skrypty Pythona</a>
        <a href="/about/3" alt="normal">2. Github Actions</a>
        <a href="/about/4" alt="normal">3. Wdrożenie</a>
      `,
      'footer.schedules': 'PLANY ZAJĘĆ',
      'footer.more': 'WIĘCEJ',
      'footer.more.elements': `
        <a href="/dependencies/" alt="normal">Zależności</a>
        <a href="https://github.com/dominikx2002/WATcalendars/activity" target="_blank" alt="normal">GitHub Actions</a>
        <div class="buttons">
            <a href="/" class="get-started" data-i18n="footer.get-started">GO TO HOME PAGE</a>
            <a href="https://github.com/dominikx2002/WATcalendars" class="github" target="_blank">GITHUB</a>
        </div>
        <a href="/feedback/" data-i18n="footer.feedback" alt="sections2">FEEDBACK</a>
        <a href="/privacypolicy/" data-i18n="privacypolicy.feedback" alt="sections2">POLITYKA PRYWATNOŚCI</a>
        <a href="/license/" alt="sections2">LICENCJA</a>
        <a href="/license/" alt="signature">© DOMINIK SERAFIN 2025</a>
      `,

      // topbar
      'nav.home': 'Strona główna',
      'nav.about': 'O projekcie',
      'nav.schedules': 'Plany zajęć',
      'nav.project': 'Projekt',
      'nav.changelog': 'GitHub Actions',
      'nav.more': 'Więcej',
      'nav.more.tutorial': 'Instrukcje',
      'nav.more.support': 'Donate',
      'nav.more.installer': 'Instalacja lokalna',
      'nav.more.dependencies': 'Zależności',
      'nav.more.showcase': 'Prezentacja',
      'nav.more.feedback': 'Feedback',
      'nav.more.license': 'Licencja',

      // dependencies page
      'dependencies.title': 'Zależności',
      'dependencies.description': 'Możesz zainstalować projekt WATcalendars na każdej dystrybucji Linuksa, jeśli wcześniej zainstalujesz poniższe pakiety.',
      'dependencies.note.title': 'Uwaga',
      'dependencies.note.text': `Playwright jest oficjalnie wspierany tylko na Debian 12, Debian 13, Ubuntu 22.04 i Ubuntu 24.04 (dla architektur x86-64 i ARM64).<br>Na innych dystrybucjach Linuksa Playwright może nie działać poprawnie i może wymagać obejść, takich jak użycie Dockera lub tworzenie dowiązań symbolicznych dla brakujących bibliotek.`,
      'dependencies.last_updated': 'Ostatnia aktualizacja: 20/10/25, 10:05 AM',

      // schedules page
      'hero.schedules.title': 'Wybierz swój Wydział poniżej',

      // groups selector
      'groups.title': 'Wybierz grupę:',
      'groups.none.text': '// Wybierz grupę, aby zobaczyć opcje i podgląd.',
      'groups.subscribe.link': 'Subskrybuj kalendarz',
      'groups.subscribe.orcopy': 'albo skopiuj URL do subskrypcji:',
      'groups.download': 'Możesz również pobrać plik .ics do importu ręcznego.',
      'groups.download_btn': 'Pobierz Plik .ICS',
      'groups.subscribe.gcal': 'Albo przejdź do Kalendarza Google, aby dodać przez URL:',
      'groups.subscribe.gcal.btn': 'Przejdź do Kalendarza Google',
      'groups.png_from': '// Zdjęcie wycięte z:',

      // privacy policy
      'privacy': 'Polityka Prywatności',
      'privacy.text': `
        Ta strona internetowa nie zbiera, nie przechowuje ani nie przetwarza żadnych danych osobowych swoich odwiedzających.
        Nie używam plików cookie, narzędzi analitycznych ani żadnych usług stron trzecich, które śledzą użytkowników.
        Jeśli w przyszłości to się zmieni, polityka ta zostanie odpowiednio zaktualizowana.
      `,

        // Index page

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
      'tutorial.step3': 'Na <img src="/assets/images/logo/apple-logo.png" alt="apple-logo"> iPhone, plan pojawi się jako subskrypcja kalendarza.',
      'tutorial.step4': 'Po potwierdzeniu opcją <strong>Znajdź</strong>, plan grupy będzie\n                        dostępny bezpośrednio w aplikacji Kalendarz.',

      'install.title': 'Instalacja ręczna',
      'install.p1': 'Możesz zainstalować projekt WATcalendars dostępny na Githubie, który zawiera <img src="/assets/images/icons/python-icon.png" alt="python-icon"> skrypty Pythona.',
      'install.p2': 'Sklonuj repozytorium na swój komputer.',
      'install.p3': 'Następnie nadaj uprawnienia do skryptu instalacyjnego.',
      'install.p4': 'Uruchomienie poniższego skryptu automatycznie zainstaluje wymagane zależności.',
      'install.p5': 'Po tym możesz używać skryptów do scrapowania, zmieniać je, dostosowywać i poprawiać.',
      'install.p6': 'W repozytorium sprawdź plik "help.txt" po dostępne opcje i informacje lub wpisz: cat help.txt:',
      'install.p7': 'Skrypt instalacyjny instalujący wymagane zależności jest dostępny dla\n                        <img src="/assets/images/distribution/arch.png" alt=Arch> <strong>Arch</strong>.\n                        <br>Dla innych dystrybucji najpierw zainstaluj <a href="/web/Dependencies.html">zależności</a>.',

      'footer.mit': 'Wydane na licencji MIT',
      'footer.copyright': 'Copyright © 2025 Dominik Serafin',






      // license page
      'footer.license': 'Licencja',
      'license.text': `Licencja MIT<br><br>
Copyright © 2025 Dominik Serafin<br><br>
Niniejszym udziela się każdej osobie, która wejdzie w posiadanie kopii tego oprogramowania i powiązanej dokumentacji ("Oprogramowanie"), bezpłatnego zezwolenia na nieograniczone korzystanie z Oprogramowania, w tym bez ograniczeń prawa do używania, kopiowania, modyfikowania, łączenia, publikowania, rozpowszechniania, udzielania sublicencji i/lub sprzedaży kopii Oprogramowania, a także zezwalania osobom, którym Oprogramowanie zostało dostarczone, na to samo, z zastrzeżeniem następujących warunków:<br><br>
Powyższa informacja o prawach autorskich oraz niniejsza zgoda muszą być dołączone do wszystkich kopii lub istotnych części Oprogramowania.<br><br>
Oprogramowanie dostarczane jest "tak, jak jest", bez jakiejkolwiek gwarancji, wyraźnej bądź dorozumianej, w tym między innymi gwarancji przydatności handlowej, przydatności do określonego celu oraz braku naruszenia praw. W żadnym wypadku autorzy ani posiadacze praw autorskich nie ponoszą odpowiedzialności za jakiekolwiek roszczenia, szkody lub inne zobowiązania, niezależnie od tego, czy wynikają one z umowy, czynu niedozwolonego, czy też w inny sposób, a powstałe w związku z Oprogramowaniem lub korzystaniem z niego, bądź w związku z innymi działaniami dotyczącymi Oprogramowania.`,



      // about page
      'about.coming_soon': 'Wkrótce!',

    }

  };

  function applyTranslations(lang) {
    const root = document.documentElement;
    root.setAttribute('lang', lang);

    // Process both [data-i18n] and [data-i18n-html].
    // If element has data-i18n-html, treat its value as the key and render as HTML.
    document.querySelectorAll('[data-i18n], [data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n') || el.getAttribute('data-i18n-html');
      const isHtml = el.hasAttribute('data-i18n-html') 
      || key === 'license.text' 
      || key === 'dependencies.note.text'
      || key === 'contact.text'
      || key === 'contact.email.text1'
      || key === 'contact.email.text2'
      || key === 'contact.github.text'
      || key === 'contact.important.text';
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
