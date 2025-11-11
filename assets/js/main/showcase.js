(function(){
  // Cross-device behavior for #Showcase:
  // - Auto-activate ONLY when the image is near the vertical center of the viewport.
  // - Clicking anywhere except the button closes it (remove 'is-active').
  // - Clicking the image toggles it back on.
  var showcase = document.getElementById('Showcase');
  if (!showcase) return;
  var img = showcase.querySelector('img');
  var overlay = showcase.querySelector('.showcase-button-container');
  if (!img || !overlay) return;

  var ACTIVE_CLASS = 'is-active';
  var manualOpen = false; // user forced open via image click
  var suppressAutoOpenWhileCentered = false; // prevent instant reopen when manually closed while centered

  // Prevent image drag/long-press default where possible
  img.setAttribute('draggable', 'false');

  function openOverlay(){ showcase.classList.add(ACTIVE_CLASS); }
  function closeOverlay(){ showcase.classList.remove(ACTIVE_CLASS); }
  function toggleOverlay(){ showcase.classList.toggle(ACTIVE_CLASS); }

  function isNearViewportCenterY(){
    // Use the whole #Showcase section for centering, not only the image
    var r = showcase.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var vw = window.innerWidth || document.documentElement.clientWidth;
    // Must be on-screen at least partially
    var verticallyVisible = r.top < vh && r.bottom > 0;
    var horizontallyVisible = r.left < vw && r.right > 0;
    if (!verticallyVisible || !horizontallyVisible) return false;
    var elCenterY = r.top + r.height / 2;
    var viewportCenterY = vh / 2;
    // Tolerance: wider on mobile (align with CSS breakpoint ~800px)
    var isSmall = (window.matchMedia && window.matchMedia('(max-width: 800px)').matches) || (vw <= 800);
    var tolPct = isSmall ? 0.22 : 0.12;   // 22% on mobile, 12% on desktop
    var minTol = isSmall ? 64 : 40;       // px
    var maxTol = isSmall ? 240 : 160;     // px
    var tolerance = Math.min(maxTol, Math.max(minTol, vh * tolPct));
    return Math.abs(elCenterY - viewportCenterY) <= tolerance;
  }

  function reevaluateAuto(){
    var centered = isNearViewportCenterY();
    if (manualOpen) {
      // Keep open until user closes; don't auto-close on scroll
      return;
    }
    if (centered) {
      if (!suppressAutoOpenWhileCentered) openOverlay();
    } else {
      closeOverlay();
      // Once we leave the center zone, allow auto-open next time we re-enter
      suppressAutoOpenWhileCentered = false;
    }
  }

  // Auto-open when the image is near viewport center; close when it leaves.
  (function setupViewportObserver(){
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        // Any geometry change is enough; we compute center ourselves
        reevaluateAuto();
      }, { root: null, threshold: [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1] });
      io.observe(showcase);
      // Also listen to scroll/resize to update continuously on mobile while intersecting
      var onScroll = function(){ reevaluateAuto(); };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      window.addEventListener('orientationchange', onScroll);
    } else {
      // Fallback for older browsers
      function onScrollCheck(){
        reevaluateAuto();
      }
      window.addEventListener('scroll', onScrollCheck, { passive: true });
      window.addEventListener('resize', onScrollCheck);
      window.addEventListener('orientationchange', onScrollCheck);
      // Initial check
      reevaluateAuto();
    }
    // Also run once immediately (IO callback may not fire if already intersecting)
    reevaluateAuto();
  })();

  // Clicking the image toggles overlay; stop propagation so the document handler doesn't immediately close it.
  img.addEventListener('click', function(e){
    e.stopPropagation();
    var willOpen = !showcase.classList.contains(ACTIVE_CLASS);
    toggleOverlay();
    if (willOpen) {
      manualOpen = true;
      suppressAutoOpenWhileCentered = false;
    } else {
      // Manually closed; if currently centered, suppress instant auto-open
      manualOpen = false;
  suppressAutoOpenWhileCentered = isNearViewportCenterY();
    }
  });

  // Any click except on the actual button/link closes the overlay
  document.addEventListener('click', function(e){
    if (!showcase.classList.contains(ACTIVE_CLASS)) return;
    var onButton = e.target.closest('.showcase-button-container a, .showcase-button-container button');
    if (onButton) return; // allow default (e.g., navigation)
    closeOverlay();
    manualOpen = false;
    suppressAutoOpenWhileCentered = isNearViewportCenterY();
  });

  // Mobile-first: prevent the initial tap from bubbling up (so outside pointerdown can close without immediate re-open)
  img.addEventListener('pointerdown', function(e){
    e.stopPropagation();
  }, { passive: true });

  // On touch/pointer, close as soon as the pointer goes down outside the button
  document.addEventListener('pointerdown', function(e){
    if (!showcase.classList.contains(ACTIVE_CLASS)) return;
    var onButton = e.target.closest('.showcase-button-container a, .showcase-button-container button');
    if (onButton) return;
    closeOverlay();
    manualOpen = false;
    suppressAutoOpenWhileCentered = isNearViewportCenterY();
  });
})();
