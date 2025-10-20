// Toggle tutorial sections based on selected "glass" radio buttons
document.addEventListener('DOMContentLoaded', () => {
  const iphoneRadio = document.getElementById('glass-iphone');
  const googleRadio = document.getElementById('glass-google');
  const manualRadio = document.getElementById('glass-manual');

  const iphoneSection = document.querySelector('.iphone-tutorial');
  const googleSection = document.querySelector('.google-tutorial');
  const manualSection = document.querySelector('.manual-tutorial');

  if (!iphoneRadio || !googleRadio || !manualRadio || !iphoneSection || !googleSection || !manualSection) {
    // Required elements missing — safely do nothing
    return;
  }

  const setVisible = (target) => {
    const isActuallyVisible = (node) => {
      if (!node) return false;
      const cs = window.getComputedStyle(node);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      // visible if has box (covers fixed/absolute) or has offsetParent
      return node.getClientRects().length > 0 || node.offsetParent !== null;
    };

    const map = {
      iphone: iphoneSection,
      google: googleSection,
      manual: manualSection,
    };
    Object.entries(map).forEach(([key, el]) => {
      const isActive = key === target;
      // Explicitly show the target section to override CSS `display: none` defaults
      el.style.display = isActive ? 'block' : 'none';
      // Toggle animation wrapper class
      if (isActive) {
        el.classList.add('animate-stagger');
        // Determine the currently visible responsive layout inside the section
        const candidates = [
          el.querySelector('.desktop-layout'),
          el.querySelector('.tablet-layout'),
          el.querySelector('.media-layout'),
        ].filter(Boolean);
        const layout = candidates.find(isActuallyVisible) || el; // fallback

        // Animate direct children in DOM order for a clear stagger
        const items = Array.from(layout.children)
          .filter((node) => isActuallyVisible(node));

        // Remove any previous run flags to restart animation
        items.forEach((node) => node.classList.remove('stagger-run'));

        // Assign stagger-item class and delays
        const initialDelay = 60; // ms before the whole block starts animating
        const baseDelay = 60; // small ms between items (focus on initial pause)
        items.forEach((node, idx) => {
          node.classList.add('stagger-item');
          node.style.setProperty('--stagger-delay', `${idx * baseDelay}ms`);
          node.style.setProperty('--stagger-offset', `${initialDelay}ms`);
        });

        // Force reflow, then run animation on next frame to ensure CSS sees state change
        // eslint-disable-next-line no-unused-expressions
        layout.offsetHeight;
        requestAnimationFrame(() => {
          items.forEach((node) => node.classList.add('stagger-run'));
        });
      } else {
        el.classList.remove('animate-stagger');
        el.querySelectorAll('.stagger-item').forEach((n) => {
          n.classList.remove('stagger-item');
          n.style.removeProperty('--stagger-delay');
          n.style.removeProperty('--stagger-offset');
        });
      }
    });
  };

  const updateFromSelection = () => {
    if (iphoneRadio.checked) {
      setVisible('iphone');
    } else if (googleRadio.checked) {
      setVisible('google');
    } else if (manualRadio.checked) {
      setVisible('manual');
    }
  };

  // Listen for changes on the radio buttons
  [iphoneRadio, googleRadio, manualRadio].forEach((r) => {
    r.addEventListener('change', updateFromSelection);
    r.addEventListener('click', updateFromSelection);
  });

  // Initialize on load (default checked is iPhone)
  updateFromSelection();
});
