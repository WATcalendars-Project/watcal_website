document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.showcase');
  const track = document.querySelector('.showcase-slider');
  if (!container || !track) return;

  // Runtime hints for smoothness
  track.style.willChange = 'transform';
  container.style.touchAction = 'pan-y'; // allow natural vertical scroll, we handle horizontal

  const originals = Array.from(track.querySelectorAll('img'));
  const originalCount = originals.length;
  if (originalCount === 0) return;

  // Clone once to both sides for endless loop
  const prependFrag = document.createDocumentFragment();
  const appendFrag = document.createDocumentFragment();
  originals.forEach((img) => appendFrag.appendChild(img.cloneNode(true)));
  originals.forEach((img) => prependFrag.appendChild(img.cloneNode(true)));
  track.insertBefore(prependFrag, track.firstChild);
  track.appendChild(appendFrag);

  // Measurements
  let chunkWidth = 0; // width of the original slides block
  let currentX = 0;   // translateX in px
  let autoplayPxPerSec = 60; // speed of autoplay in px/s (tune as needed)

  // Interaction state
  let pointerActive = false;
  let dragging = false;
  let startPointerX = 0;
  let startTranslateX = 0;
  let lastMoveX = 0;
  let lastMoveTs = 0;
  let velocity = 0; // px/ms
  const friction = 0.0022; // momentum deceleration (higher -> stops quicker)
  let inertiaActive = false;
  let resumeAutoplayTimeout = null;

  const setTransform = (x) => {
    track.style.transform = `translate3d(${x}px,0,0)`;
  };

  const measureChunkWidth = () => {
    // width between first and last original image edges
    const first = originals[0];
    const last = originals[originals.length - 1];
    if (!first || !last) return 0;
    const firstLeft = first.offsetLeft;
    const lastRight = last.offsetLeft + last.offsetWidth;
    return Math.max(0, lastRight - firstLeft);
  };

  const whenImagesReady = (imgs) => {
    const promises = imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      if ('decode' in img) {
        try { return img.decode(); } catch { /* fallthrough */ }
      }
      return new Promise((res) => img.addEventListener('load', res, { once: true }));
    });
    return Promise.allSettled(promises);
  };

  const normalizeWithinWindow = (x) => {
    // Keep x within [-2*chunkWidth, 0)
    if (chunkWidth === 0) return x;
    const min = -2 * chunkWidth;
    const max = 0;
    while (x < min) x += chunkWidth;
    while (x >= max) x -= chunkWidth;
    return x;
  };

  const stopInertia = () => { inertiaActive = false; };
  const pauseAutoplay = () => { autoplayPxPerSec = 0; };
  const resumeAutoplay = () => { autoplayPxPerSec = 60; };

  const startPointer = (clientX, ts) => {
    pointerActive = true;
    dragging = false;
    startPointerX = clientX;
    startTranslateX = currentX;
    lastMoveX = clientX;
    lastMoveTs = ts;
    velocity = 0;
    stopInertia();
    pauseAutoplay();
    container.classList.add('active');
  };

  const movePointer = (clientX, ts) => {
    if (!pointerActive) return;
    const dx = clientX - startPointerX;
    currentX = startTranslateX + dx;
    dragging = true;
    // velocity in px/ms with simple low-pass
    const dt = Math.max(1, ts - lastMoveTs);
    const instV = (clientX - lastMoveX) / dt; // px/ms
    velocity = velocity * 0.6 + instV * 0.4;
    lastMoveX = clientX;
    lastMoveTs = ts;
  };

  const endPointer = () => {
    if (!pointerActive) return;
    pointerActive = false;
    container.classList.remove('active');
    // start inertia if there is meaningful velocity
    if (Math.abs(velocity) > 0.02) {
      inertiaActive = true;
    } else {
      inertiaActive = false;
      clearTimeout(resumeAutoplayTimeout);
      resumeAutoplayTimeout = setTimeout(resumeAutoplay, 1200);
    }
  };

  // RAF loop
  let rafId = 0;
  let prevTs = 0;
  const tick = (ts) => {
    if (!prevTs) prevTs = ts;
    const dtMs = ts - prevTs;
    const dtSec = dtMs / 1000;
    prevTs = ts;

    // autoplay movement
    if (autoplayPxPerSec !== 0 && !pointerActive && !inertiaActive) {
      currentX -= autoplayPxPerSec * dtSec;
    }

    // inertia momentum
    if (inertiaActive) {
      currentX += velocity * dtMs; // velocity is px/ms
      const sign = Math.sign(velocity);
      const decel = friction * dtMs;
      const newSpeed = Math.max(0, Math.abs(velocity) - decel);
      velocity = newSpeed * sign;
      if (newSpeed <= 0.001) {
        inertiaActive = false;
        clearTimeout(resumeAutoplayTimeout);
        resumeAutoplayTimeout = setTimeout(resumeAutoplay, 900);
      }
    }

    // wrap within the middle chunk window
    currentX = normalizeWithinWindow(currentX);

    setTransform(currentX);
    rafId = requestAnimationFrame(tick);
  };

  // Pointer Events (cover mouse + touch)
  container.addEventListener('pointerdown', (e) => {
    // Only left mouse or touch/pen
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    container.setPointerCapture?.(e.pointerId);
    startPointer(e.clientX, performance.now());
    e.preventDefault();
  });

  container.addEventListener('pointermove', (e) => {
    movePointer(e.clientX, performance.now());
  }, { passive: true });

  const endHandler = () => endPointer();
  container.addEventListener('pointerup', endHandler);
  container.addEventListener('pointercancel', endHandler);
  container.addEventListener('pointerleave', (e) => {
    // If pointer left but still captured, keep tracking; otherwise end
    if (!container.hasPointerCapture?.(e.pointerId)) endPointer();
  });

  // Initialize after images are ready so widths are correct
  whenImagesReady(originals).then(() => {
    chunkWidth = measureChunkWidth();
    // Position so that originals block is visible initially
    currentX = -chunkWidth;
    setTransform(currentX);
    // Start RAF
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(tick);
  });

  // Handle resize: recompute chunk width and keep relative progress
  const handleResize = () => {
    const prevChunk = chunkWidth || 1;
    // compute progress in [0,1) inside the chunk
    const progress = ((currentX + 2 * prevChunk) % prevChunk) / prevChunk; // normalized
    chunkWidth = measureChunkWidth();
    const W = chunkWidth || 1;
    currentX = -W - progress * W;
    currentX = normalizeWithinWindow(currentX);
    setTransform(currentX);
  };
  window.addEventListener('resize', () => {
    // Debounce measurement a bit
    window.clearTimeout(window.__carouselResizeTimer);
    window.__carouselResizeTimer = window.setTimeout(handleResize, 100);
  });
});
