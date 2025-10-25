document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.tutorial-slider .slider-container');
  const images = document.querySelectorAll('.tutorial-slider .slider-container img');
  const dotsContainer = document.querySelector('.tutorial-slider .slider-dots');

  if (!container || !images.length || !dotsContainer) return; // bezpieczeństwo

  // Tworzenie kropek
  images.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.addEventListener('click', () => showSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('button');

  // Ustaw na -1, aby pierwsze showSlide(0) dodało klasy 'active'
  let current = -1;
  const clamp = (n) => Math.max(0, Math.min(n, images.length - 1));
  const transitionMs = 600; // zgodne z CSS (opacity 0.6s)
  let lastSwitch = 0;
  const canSwitch = () => Date.now() - lastSwitch > transitionMs * 0.8;
  const markSwitch = () => { lastSwitch = Date.now(); };
  // Wykrywanie urządzenia dotykowego (telefon) – coarse pointer oznacza ekran dotykowy
  const isTouchDevice = (typeof window !== 'undefined' && (
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
    ('ontouchstart' in window)
  ));

  // Feature flags: wyłączamy przewijanie/gesty dla slajdów (zostają tylko kropki/klawiatura)
  const ENABLE_MOUSE_DRAG = false;
  const ENABLE_WHEEL_SCROLL = false;
  const ENABLE_TOUCH_SWIPE = false; // i tak domyślnie wyłączone na telefonach poniżej

  function showSlide(index) {
    const next = clamp(index);
    if (images.length === 0) return;
    if (next === current) return;
    images.forEach(img => img.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    images[next].classList.add('active');
    dots[next].classList.add('active');
    current = next;
    // glider removed — opacity state managed via CSS ::before
  }

  function nextSlide() { if (current < images.length - 1) { showSlide(current + 1); } }
  function prevSlide() { if (current > 0) { showSlide(current - 1); } }

  // Drag myszką – zmiana slajdów po przeciągnięciu (wyłączone)
  if (ENABLE_MOUSE_DRAG) {
    let isMouseDown = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragging = false;
    const dragThreshold = 40; // minimalna odległość, by uznać gest

    container.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      dragging = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      // Fokus do klawiatury
      const tutorialRoot = document.querySelector('.tutorial-slider');
      if (tutorialRoot) tutorialRoot.focus();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isMouseDown || !canSwitch()) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (!dragging && (absX > dragThreshold || absY > dragThreshold)) {
        dragging = true;
        // Wybierz dominującą oś na podstawie większego odchylenia
        if (absX >= absY) {
          if (dx < 0) nextSlide(); else prevSlide();
        } else {
          if (dy < 0) nextSlide(); else prevSlide();
        }
        markSwitch();
        // Po przełączeniu zresetuj punkt startowy, by ewentualnie wykrywać kolejne przeciągnięcia
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    });

    document.addEventListener('mouseup', () => {
      isMouseDown = false;
      dragging = false;
    });
  }

  // Wheel scroll na sliderze – wyłączone
  if (ENABLE_WHEEL_SCROLL) {
    // Jeśli kiedyś włączysz, przenieś tu poprzednie listenery 'wheel'
  }

  // Swipe na dotyku – wyłączony
  if (!isTouchDevice && ENABLE_TOUCH_SWIPE) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchHandled = false; // żeby nie wywoływać podwójnie w touchend
    const touchThreshold = 40;

    container.addEventListener('touchstart', (e) => {
      if (!e.touches || !e.touches.length) return;
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchHandled = false;
    }, { passive: true });

    // Reaguj już w trakcie ruchu, by zablokować scroll strony przy poziomym geście
    container.addEventListener('touchmove', (e) => {
      const t = e.touches && e.touches[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Zawsze blokuj scroll strony nad sliderem; sterujemy tylko slajdem
      e.preventDefault();

      // Przy przekroczeniu progu i dominacji osi poziomej przeskakuj slajdy
      if (!touchHandled && absX >= absY && absX > touchThreshold && canSwitch()) {
        if (dx < 0) nextSlide(); else prevSlide();
        markSwitch();
        touchHandled = true;
        // Resetuj punkt odniesienia, by umożliwić kolejne przełączenia w ramach jednego długiego przeciągnięcia
        touchStartX = t.clientX;
        touchStartY = t.clientY;
      }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
      // Jeżeli już obsłużyliśmy w touchmove, nic nie rób
      if (touchHandled) return;
      if (!canSwitch()) return;
      const t = e.changedTouches && e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (absX < touchThreshold && absY < touchThreshold) return;
      // Kierunek – wybierz dominującą oś
      if (absY >= absX) {
        // Gest w pionie
        if (dy < 0) nextSlide(); else prevSlide();
      } else {
        // Gest w poziomie
        if (dx < 0) nextSlide(); else prevSlide();
      }
      markSwitch();
    }, { passive: true });
  }

  // Dostępność – strzałki na klawiaturze
  // Umożliw fokus, by przechwycić klawisze
  const tutorialRoot = document.querySelector('.tutorial-slider');
  if (tutorialRoot) {
    tutorialRoot.setAttribute('tabindex', '0');
    tutorialRoot.addEventListener('keydown', (e) => {
      if (!canSwitch()) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextSlide(); markSwitch(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); markSwitch(); }
      else if (e.key === 'Home') { e.preventDefault(); showSlide(0); markSwitch(); }
      else if (e.key === 'End') { e.preventDefault(); showSlide(images.length - 1); markSwitch(); }
    });
  }

  // Start – pierwszy slajd
  // Ustaw aktywne elementy zanim użytkownik zacznie przewijać
  showSlide(0);

  // Oznacz, że slider został zainicjowany (wyłącza CSS fallback)
  document.body.classList.add('slider-init');
  // glider removed — no positioning required
});