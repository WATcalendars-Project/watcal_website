(function(){
  // Mobile tap support: toggle an active state on the #Showcase section when tapping the image.
  var showcase = document.getElementById('Showcase');
  if (!showcase) return;
  var img = showcase.querySelector('img');
  var overlay = showcase.querySelector('.showcase-button-container');
  if (!img || !overlay) return;

  var isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouch) return; // desktop hover works via CSS

  // Prevent image drag/long-press default where possible
  img.setAttribute('draggable', 'false');

  // Tap toggles the overlay
  function toggleOverlay() {
    showcase.classList.toggle('is-active');
  }

  img.addEventListener('click', function(ev){
    // If user taps the image, toggle overlay visibility
    toggleOverlay();
  }, { passive: true });

  // Tapping outside the button closes overlay
  document.addEventListener('click', function(ev){
    if (!showcase.classList.contains('is-active')) return;
    if (showcase.contains(ev.target)) {
      // If the click is on the showcase area but not the button link, ignore
      var btn = overlay.querySelector('a, button');
      if (btn && (ev.target === btn || btn.contains(ev.target))) return;
      // Clicking on image again will toggle via handler above
      return;
    }
    showcase.classList.remove('is-active');
  });
})();
