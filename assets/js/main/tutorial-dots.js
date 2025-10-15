document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.iphone-tutorial .slider-container');
  const images = document.querySelectorAll('.iphone-tutorial .slider-container img');
  const dotsContainer = document.querySelector('.iphone-tutorial .slider-dots');

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

  // Drag myszką – zmiana slajdów po przeciągnięciu
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
    const tutorialRoot = document.querySelector('.iphone-tutorial');
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

  // Wheel scroll na sliderze – przepuszczaj scroll strony na krawędziach (1. i ostatni slajd)
  container.addEventListener('wheel', (e) => {
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    let allowPageScroll = false;

    // Jeśli intencja jest pionowa i jesteśmy na krawędzi w kierunku scrolla – przepuść stronę
    if (absY >= absX && absY > 0) {
      if (e.deltaY < 0 && current === 0) allowPageScroll = true; // scroll w górę na pierwszym slajdzie
      if (e.deltaY > 0 && current === images.length - 1) allowPageScroll = true; // w dół na ostatnim slajdzie
    }

    if (!allowPageScroll) {
      // W innych przypadkach zablokuj scroll strony, by sterować sliderem
      e.preventDefault();
    }
  }, { passive: false });

  container.addEventListener('wheel', (e) => {
    if (!canSwitch()) return;
    const absX = Math.abs(e.deltaX);
    const absY = Math.abs(e.deltaY);
    if (absX < 10 && absY < 10) return; // ignoruj mikroruchy

    // Jeśli na krawędzi i próba przewinięcia dalej w pionie – przepuść stronę (nic nie rób tutaj)
    if (absY >= absX) {
      if ((e.deltaY < 0 && current === 0) || (e.deltaY > 0 && current === images.length - 1)) {
        return;
      }
    }

    // preventDefault jest warunkowo wywołane w poprzednim handlerze
    if (absY >= absX) {
      // Scroll pionowy
      if (e.deltaY > 0) nextSlide(); else prevSlide();
    } else {
      // Scroll poziomy
      if (e.deltaX > 0) nextSlide(); else prevSlide();
    }
    markSwitch();
  }, { passive: false });

  // Swipe na dotyku – wyłączony na telefonach (pozwól tylko na klikanie w kropki i scroll strony)
  if (!isTouchDevice) {
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
  const tutorialRoot = document.querySelector('.iphone-tutorial');
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