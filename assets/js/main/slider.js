document.addEventListener('DOMContentLoaded', () => {
  // Find all sliders on the page
  const sliders = Array.from(document.querySelectorAll('.slider'));
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const track = slider.querySelector('.slide-track');
    if (!track) return;

    // Read desired speed from data attribute (seconds for one full loop)
    const speedAttr = slider.getAttribute('data-speed');
    const duration = (speedAttr ? Number(speedAttr) : 15) || 15; // seconds

    const slides = Array.from(track.children);
    if (!slides.length) return;

    // Duplicate slides to both ends for seamless loop
    const prependFrag = document.createDocumentFragment();
    const appendFrag = document.createDocumentFragment();
    slides.forEach((s) => appendFrag.appendChild(s.cloneNode(true)));
    slides.forEach((s) => prependFrag.appendChild(s.cloneNode(true)));
    track.insertBefore(prependFrag, track.firstChild);
    track.appendChild(appendFrag);

    // Helper to (re)compute widths and set animation
    let animStyleEl = null;
    function setupAnimation() {
      // compute width of original slides block
      const originals = Array.from(track.querySelectorAll('.slide')).slice(slides.length, slides.length * 2);
      if (!originals.length) return;
      const first = originals[0];
      const last = originals[originals.length - 1];
      const chunkWidth = Math.max(0, (last.offsetLeft + last.offsetWidth) - first.offsetLeft);

      // ensure track has the right width (flex, so content defines it)

      // generate unique animation name per slider
      const animName = `slide-scroll-${Math.random().toString(36).slice(2,8)}`;
      const keyframes = `@keyframes ${animName} { from { transform: translateX(0); } to { transform: translateX(-${chunkWidth}px); } }`;

      // remove existing style if present
      if (animStyleEl) animStyleEl.remove();
      animStyleEl = document.createElement('style');
      animStyleEl.textContent = keyframes + ` .slide-track { animation: ${animName} ${duration}s linear infinite; } `;
      document.head.appendChild(animStyleEl);
    }

    // Wait for images to load then setup
    const imgs = Array.from(track.querySelectorAll('img'));
    const loadPromises = imgs.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((res) => img.addEventListener('load', res, { once: true }));
    });
    Promise.all(loadPromises).then(() => {
      setupAnimation();
    });

    // recompute on resize with debounce
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupAnimation, 150);
    });
  });
});
