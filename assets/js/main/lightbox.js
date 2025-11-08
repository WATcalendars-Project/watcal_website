document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.images-showcase');
  if (!gallery) return;

  // Create overlay once and reuse
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image preview');

  const content = document.createElement('div');
  content.className = 'lightbox-content';

  const img = document.createElement('img');
  img.alt = '';

  content.appendChild(img);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  let lastFocused = null;

  function openLightbox(src, alt) {
    lastFocused = document.activeElement;
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('open');
    document.body.classList.add('lightbox-open');
    // Focus trapping: move focus to overlay
    overlay.tabIndex = -1;
    overlay.focus();
    // Prevent page scroll on iOS
    document.documentElement.style.overscrollBehavior = 'contain';
  }

  function closeLightbox() {
    overlay.classList.remove('open');
    document.body.classList.remove('lightbox-open');
    img.src = '';
    document.documentElement.style.overscrollBehavior = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // Click on image -> open
  gallery.addEventListener('click', (e) => {
    const t = e.target;
    if (t && t.tagName === 'IMG') {
      openLightbox(t.src, t.alt);
    }
  });

  // Close on click outside image
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLightbox();
  });
});
