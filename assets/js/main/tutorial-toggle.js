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
    const map = {
      iphone: iphoneSection,
      google: googleSection,
      manual: manualSection,
    };
    Object.entries(map).forEach(([key, el]) => {
      // Explicitly show the target section to override CSS `display: none` defaults
      el.style.display = key === target ? 'block' : 'none';
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
