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
      // title
      'hero.title.desktop': 'The WATcalendars for<br>.ICS Schedules',
      'hero.desktop.text': `Created to simplify access to academic<br>
        schedules and ensure continuous development<br>
        through openness and collaboration.`,

      'hero.buttons.get-started': 'Get Started',
      'hero.buttons.tutorial': 'Tutorial',
      'hero.buttons.github': 'GitHub',

      'hero.title.media': 'The WATcalendars for .ICS Schedules',

      'hero.media.mobile': `Created to simplify access to academic schedules and ensure
        continuous development through openness and
        collaboration.`,

      // three-items-description
      'three.detailed.title': 'Detailed View',
      'three.detailed.text': `Full course information: the lecturer’s name,
        classroom and building, complete subject title,
        order of classes, and type of activity.`,
      'three.oss.title': 'Open-Source',
      'three.oss.text': `Users can review and modify as needed.
        Active feedback and contributions keep the project reliable.`,
      'three.auto.title': 'Automated Up-to-Date',
      'three.auto.text': `Scripts for scraping, parsing, fetching, and saving
        are run every day so schedules always stay current.`,

      // tutorial
      'tutorial.title': 'Get Your Calendar',
      'tutorial.footer': '<<Instruction>>',
      'hero.buttons.schedules': 'Schedules',
      'tutorial.iphone.step1': `Navigate to 
        <a href="/schedules/" class="get-started" data-i18n="hero.buttons.schedules">Schedules</a>
        selecting one of available buttons or links on website.`,
      'tutorial.iphone.step2': 'Select your faculty from available options.',
      'tutorial.iphone.step3': 'Once redirected to your faculty, select your group from the list.',
      'tutorial.iphone.step4': 'After selecting your group, add the schedule by clicking apple "Subscribe Calendar" button.',
      'tutorial.iphone.step5': `(Optional) If nothing happens, you can add it manually by copying the link under the subscribe button and
        paste it in:<br>Calendar > Calendars > Add calendar > Add subscription calendar.<br><br><strong>Confirm the subscription in the pop-up window by clicking "Find".`,
      'tutorial.iphone.step6': `Customize your calendar settings as needed and click confirm button at the right-top.`,
      'tutorial.iphone.done': `You're all set! Your WATcalendar will now appear in the Apple Calendar app with all the latest schedule information. Enjoy!`,

      'hero.buttons.schedules': 'Schedules',
      'tutorial.google.step1': `Navigate to 
        <a href="/schedules/" class="get-started" data-i18n="hero.buttons.schedules">Schedules</a>
        selecting one of available buttons or links on website.`,
      'tutorial.google.step2': 'Select your faculty from available options.',
      'tutorial.google.step3': 'Once redirected to your faculty, select your group from the list.',
      'tutorial.google.step4': `After selecting your group, copy the link above the Google button starting with https://<br>and redirect to Google Calendar Settings by hitting the button.`,
      'tutorial.google.step5': `Log in to your Google account.`,
      'tutorial.google.step6': `On Desktop you need to go for "+" in "Other calendars" section and select "From URL" like on the screenshot.`,
      'tutorial.google.step7': `You will be redirected to Google Calendar subscription Settings.`,
      'tutorial.google.step8': `!IMPORTANT<br>Paste the link into the "URL" field and <strong>select "Set calendar as public"</strong>`,
      'tutorial.google.step9': `Once you subscribe the calendar, leave the Settings section and after few seconds you will see your schedule.`,
      'tutorial.google.done': `You're all set! Your WATcalendar will now appear in the Google Calendar with all the latest schedule information. Enjoy!`,

      'hero.buttons.schedules': 'Schedules',
      'tutorial.manual.step1': `Navigate to 
        <a href="/schedules/" class="get-started" data-i18n="hero.buttons.schedules">Schedules</a>
        selecting one of available buttons or links on website.`,
      'tutorial.manual.step2': 'Select your faculty from available options.',
      'tutorial.manual.step3': 'Once redirected to your faculty, select your group from the list.',
      'tutorial.manual.step4': `After selecting your group, download the .ics file by clicking "Download .ics" button.`,
      'tutorial.manual.done': `Click the downloaded file and choose your preferred application. Enjoy!`,

      // manual installation
      'install.title': 'Manual Installation',
      'install.p1': 'You can install the WATcalendars project available on Github that include <img src="/assets/images/icons/python-icon.png" alt="python-icon"> Python Scripts.',
      'install.p2': 'Clone the repository to your local machine.',
      'install.p3': 'Next add rights to the setup script.',
      'install.p4': 'Running following script will automaticaly install required dependencies.',
      'install.p5': 'After that, you can Use the scraping scripts, Change them, Customize them, Fix as needed.',
      'install.p6': 'In the repository check "help.txt" file for available options and useful informations or simply type cat help.txt:',
      'install.p7': `Setup script to install the required dependencies are included for
        <img src="/assets/images/distribution/debian.png" alt=Debian> <strong>Debian</strong>,
        <img src="/assets/images/distribution/ubuntu.png" alt=Ubuntu> <strong>Ubuntu</strong>, or
        <img src="/assets/images/distribution/arch.png" alt=Arch> <strong>Arch</strong>.
        <br>For other distros, please install <a href="/dependencies/">the dependencies</a> first.`,

      //  support
      'support.title': 'Support My Project',
      
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
      // title
      'hero.title.desktop': 'WATcalendars dla<br>kalendarzy .ICS',
      'hero.desktop.text': `Stworzony, aby uprościć dostęp do akademickich<br>
        harmonogramów zajęć, oraz zapewnić ciągły rozwój<br>
        poprzez otwartość i współpracę.`,

      'hero.buttons.get-started': 'Rozpocznij',
      'hero.buttons.tutorial': 'Instrukcje',
      'hero.buttons.github': 'GitHub',

      'hero.title.media': 'WATcalendars dla kalendarzy .ICS',

      'hero.media.mobile': `Stworzony, aby uprościć dostęp do akademickich
        harmonogramów zajęć, oraz zapewnić ciągły rozwój
        poprzez otwartość i współpracę.`,

      // three-items-description
      'three.detailed.title': 'Szczegółowy Widok',
      'three.detailed.text': `Pełne informacje o kursie: nazwa prowadzącego,
        sala i budynek, pełny tytuł przedmiotu,
        porządek zajęć i rodzaj aktywności.`,
      'three.oss.title': 'Open-Source',
      'three.oss.text': `Użytkownicy mogą przeglądać i modyfikować według potrzeb.
        Aktywne opinie i wkład utrzymują projekt.`,
      'three.auto.title': 'Aktualne',
      'three.auto.text': `Skrypty do skanowania, analizowania, pobierania i zapisywania
        są uruchamiane codziennie, dzięki czemu harmonogramy zawsze pozostają aktualne.`,

      // tutorial
      'tutorial.title': 'Ustaw swój plan zajęć w kalendarzu',
      'tutorial.footer': '<<Instrukcja>>',
      'hero.buttons.schedules': 'Plany zajęć',
      'tutorial.iphone.step1': `Przejdź do
        <a href="/schedules/" class="get-started" data-i18n="hero.buttons.schedules">Plany zajęć</a>
        wybierając jeden z dostępnych przycisków lub linków na stronie.`,
      'tutorial.iphone.step2': 'Wybierz swoją jednostkę z dostępnych opcji.',
      'tutorial.iphone.step3': 'Po przekierowaniu do swojego wydziału wybierz swoją grupę z listy.',
      'tutorial.iphone.step4': 'Po wybraniu grupy dodaj plan zajęć, klikając przycisk "Subskrybuj kalendarz".',
      'tutorial.iphone.step5': `(Opcjonalnie) Jeśli nic się nie stanie, możesz dodać go ręcznie, kopiując link pod przyciskiem subskrypcji i
        wklejając go w:<br>Kalendarz > Kalendarze > Dodaj kalendarz > Dodaj kalendarz subskrypcyjny.<br><br><strong>Potwierdź subskrypcję w wyskakującym oknie, klikając "Znajdź".`,
      'tutorial.iphone.step6': `Dostosuj ustawienia kalendarza według potrzeb i kliknij przycisk potwierdzenia w prawym górnym rogu.`,
      'tutorial.iphone.done': `Gotowe! Twój WATcalendar teraz pojawi się w aplikacji Kalendarz Apple z najnowszymi informacjami o planie zajęć. Miłej zabawy!`,

      'hero.buttons.schedules': 'Plany zajęć',
      'tutorial.google.step1': `Przejdź do
        <a href="/schedules/" class="get-started" data-i18n="hero.buttons.schedules">Plany zajęć</a>
        wybierając jeden z dostępnych przycisków lub linków na stronie.`,
      'tutorial.google.step2': 'Wybierz swoją jednostkę z dostępnych opcji.',
      'tutorial.google.step3': 'Po przekierowaniu do swojego wydziału wybierz swoją grupę z listy.',
      'tutorial.google.step4': `Po wybraniu grupy skopiuj link nad przyciskiem Google, zaczynający się od https://<br>i przejdź do ustawień Kalendarza Google, klikając przycisk.`,
      'tutorial.google.step5': `Zaloguj się na swoje konto Google.`,
      'tutorial.google.step6': `Na komputerze musisz kliknąć "+" w sekcji "Inne kalendarze" i wybrać "Z adresu URL" jak na zrzucie ekranu.`,
      'tutorial.google.step7': `Zostaniesz przekierowany do ustawień subskrypcji Kalendarza Google.`,
      'tutorial.google.step8': `!WAŻNE<br>Wklej wcześniej skopiowany link w pole "URL" i <strong>wybierz "Ustaw kalendarz jako dostępny publicznie"</strong>`,
      'tutorial.google.step9': `Po zasubskrybowaniu kalendarza opuść sekcję Ustawienia, a po kilku sekundach zobaczysz swój plan zajęć.`,
      'tutorial.google.done': `Wszystko gotowe! Twój Plan Zajęć teraz pojawi się w Kalendarzu Google z najnowszymi informacjami o planie zajęć. Miłej zabawy!`,

      'hero.buttons.schedules': 'Plany zajęć',
      'tutorial.manual.step1': `Przejdź do
        <a href="/schedules/" class="get-started" data-i18n="hero.buttons.schedules">Plany zajęć</a>
        wybierając jeden z dostępnych przycisków lub linków na stronie.`,
      'tutorial.manual.step2': 'Wybierz swoją jednostkę z dostępnych opcji.',
      'tutorial.manual.step3': 'Po przekierowaniu do swojego wydziału wybierz swoją grupę z listy.',
      'tutorial.manual.step4': `Po wybraniu grupy pobierz plik .ics, klikając przycisk "Pobierz .ics".`,
      'tutorial.manual.done': `Kliknij pobrany plik i wybierz preferowaną aplikację. Miłej zabawy!`,

      // manual installation
      'install.title': 'Instalacja ręczna projektu',
      'install.p1': 'Możesz zainstalować projekt WATcalendars dostępny na Githubie, który zawiera <img src="/assets/images/icons/python-icon.png" alt="python-icon"> skrypty Pythona.',
      'install.p2': 'Sklonuj repozytorium na swoją lokalną maszynę.',
      'install.p3': 'Następnie dodaj uprawnienia do skryptu instalacyjnego.',
      'install.p4': 'Uruchomienie poniższego skryptu automatycznie zainstaluje wymagane zależności.',
      'install.p5': 'Po tym możesz używać skryptów do scrapowania, zmieniać je, dostosowywać, naprawiać w razie potrzeby.',
      'install.p6': 'W repozytorium sprawdź plik "help.txt" w poszukiwaniu dostępnych opcji i przydatnych informacji lub po prostu wpisz cat help.txt:',
      'install.p7': `Skrypt instalacyjny do zainstalowania wymaganych zależności jest dołączony dla
        <img src="/assets/images/distribution/debian.png" alt=Debian> <strong>Debian</strong>,
        <img src="/assets/images/distribution/ubuntu.png" alt=Ubuntu> <strong>Ubuntu</strong>, lub
        <img src="/assets/images/distribution/arch.png" alt=Arch> <strong>Arch</strong>.
        <br>Dla innych dystrybucji, proszę najpierw zainstalować <a href="/dependencies/">zależności</a>.`,

      //  support
      'support.title': 'Wesprzyj mój projekt',






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
