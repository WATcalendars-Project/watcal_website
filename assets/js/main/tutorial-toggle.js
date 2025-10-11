// Toggle tutorial sections based on selected "glass" radio buttons
document.addEventListener('DOMContentLoaded', () => {
  const iphoneRadio = document.getElementById('glass-iphone');
  const androidRadio = document.getElementById('glass-android');
  const desktopRadio = document.getElementById('glass-desktop');

  const iphoneSection = document.querySelector('.iphone-tutorial');
  const androidSection = document.querySelector('.android-tutorial');
  const desktopSection = document.querySelector('.desktop-tutorial');

  if (!iphoneRadio || !androidRadio || !desktopRadio || !iphoneSection || !androidSection || !desktopSection) {
    // Required elements missing — safely do nothing
    return;
  }

  const setVisible = (target) => {
    const map = {
      iphone: iphoneSection,
      android: androidSection,
      desktop: desktopSection,
    };
    Object.entries(map).forEach(([key, el]) => {
      el.style.display = key === target ? '' : 'none';
    });
  };

  const updateFromSelection = () => {
    if (iphoneRadio.checked) {
      setVisible('iphone');
    } else if (androidRadio.checked) {
      setVisible('android');
    } else if (desktopRadio.checked) {
      setVisible('desktop');
    }
  };

  // Listen for changes on the radio buttons
  [iphoneRadio, androidRadio, desktopRadio].forEach((r) => {
    r.addEventListener('change', updateFromSelection);
    r.addEventListener('click', updateFromSelection);
  });

  // Initialize on load (default checked is iPhone)
  updateFromSelection();
});
