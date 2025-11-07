// Modern tutorial slider: autoplay, looping, dots, arrows, drag/swipe
document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.tutorial-slider');
  const track = root?.querySelector('.slider-container');
  const dotsWrap = root?.querySelector('.slider-dots');
  if (!root || !track || !dotsWrap) return;

  // Collect original slides (images)
  const originals = Array.from(track.querySelectorAll('img'));
  if (originals.length === 0) return;

  // Config
  const DURATION = 450; // ms, match CSS transition
  const AUTOPLAY_MS = 2800;
  const DRAG_THRESHOLD = 0.15; // fraction of width

  // Clone heads/tails for seamless loop
  const firstClone = originals[0].cloneNode(true);
  const lastClone = originals[originals.length - 1].cloneNode(true);
  track.insertBefore(lastClone, originals[0]);
  track.appendChild(firstClone);

  let slides = Array.from(track.children); // includes clones
  // Ensure each slide occupies 100%
  slides.forEach(el => { el.style.flex = '0 0 100%'; });

  // Build dots
  dotsWrap.innerHTML = '';
  const dots = originals.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => jumpTo(i));
    // Domyślnie pusta zawartość; numer dodamy tylko dla aktywnej kropki w updateDots()
    b.textContent = '';
    dotsWrap.appendChild(b);
    return b;
  });

  // Inject nav arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn prev';
  prevBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-btn next';
  nextBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  root.appendChild(prevBtn);
  root.appendChild(nextBtn);

  let index = 1; // start on first real slide (after lastClone)
  let width = root.clientWidth;
  let animating = false;
  let autoplayId = null;

  function setTransform(noAnim = false) {
    if (noAnim) track.style.transition = 'none';
    const x = -index * width;
    track.style.transform = `translate3d(${x}px,0,0)`;
    if (noAnim) {
      // force reflow to apply no-transition transforms without flicker
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      track.offsetHeight;
      track.style.transition = '';
    }
  }

  function updateDots() {
    const active = ((index - 1) % originals.length + originals.length) % originals.length;
    dots.forEach((d, i) => {
      const isActive = i === active;
      d.classList.toggle('active', isActive);
      // Pokazujemy numer (1-based) tylko na aktywnej kropce, reszta pusta
      d.textContent = isActive ? String(active + 1) : '';
    });
  }

  function goTo(next) {
    if (animating) return;
    animating = true;
    index = next;
    // Update dots immediately so they change faster than the slide animation
    updateDots();
    track.style.transition = `transform ${DURATION}ms cubic-bezier(0.22, 0.72, 0, 1)`;
    setTransform();
  }

  function jumpToRealIfClone() {
    // After animation, if we are on a clone, jump without animation to the real one
    if (index === 0) { // landed on lastClone -> jump to last real
      index = originals.length;
      setTransform(true);
    } else if (index === originals.length + 1) { // landed on firstClone -> jump to first real
      index = 1;
      setTransform(true);
    }
    animating = false;
    updateDots();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }
  function jumpTo(realIdx) { goTo(realIdx + 1); }

  track.addEventListener('transitionend', jumpToRealIfClone);

  // Resize handling
  const onResize = () => {
    width = root.clientWidth;
    setTransform(true);
  };
  window.addEventListener('resize', onResize);

  // Autoplay
  const startAutoplay = () => {
    stopAutoplay();
    autoplayId = window.setInterval(next, AUTOPLAY_MS);
  };
  const stopAutoplay = () => { if (autoplayId) { clearInterval(autoplayId); autoplayId = null; } };
  root.addEventListener('mouseenter', stopAutoplay);
  root.addEventListener('mouseleave', startAutoplay);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });

  // Keyboard
  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goTo(1); }
    else if (e.key === 'End') { e.preventDefault(); goTo(originals.length); }
  });

  // Pointer drag/swipe
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const onPointerDown = (e) => {
    if (animating) return;
    dragging = true;
    startX = currentX = (e.touches ? e.touches[0].clientX : e.clientX);
    track.style.transition = 'none';
    stopAutoplay();
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    currentX = x;
    const dx = x - startX;
    const base = -index * width;
    track.style.transform = `translate3d(${base + dx}px,0,0)`;
  };
  const onPointerUp = () => {
    if (!dragging) return;
    dragging = false;
    const dx = currentX - startX;
    const frac = Math.abs(dx) / width;
    track.style.transition = `transform ${DURATION}ms cubic-bezier(0.22, 0.72, 0, 1)`;
    if (frac > DRAG_THRESHOLD) {
      if (dx < 0) next(); else prev();
    } else {
      setTransform();
    }
    startAutoplay();
  };
  root.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);
  root.addEventListener('touchstart', onPointerDown, { passive: true });
  root.addEventListener('touchmove', onPointerMove, { passive: true });
  root.addEventListener('touchend', onPointerUp, { passive: true });

  // Nav buttons
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Init position and UI
  setTransform(true);
  updateDots();
  startAutoplay();
});