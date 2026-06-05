function checkForAds() {
  // 1. Fast forward the ad if it's currently playing
  const adOverlay = document.querySelector('.ad-showing, .ad-interrupting, .ytp-ad-player-overlay, .ytp-ad-preview-container');
  const video = document.querySelector('video');

  if (adOverlay && video) {
    // Jump to the end of the ad to trigger the skip button immediately
    if (!isNaN(video.duration)) {
      video.currentTime = video.duration;
      video.playbackRate = 30.0;
    }
  }

  // 2. Wait for the skip button to arrive, then press it automatically
  const skipSelectors = [
    '.ytp-ad-skip-button',
    '.ytp-ad-skip-button-modern',
    '.videoAdUiSkipButton',
    '.ytp-skip-ad-button',
    '.ytp-ad-skip-button-container',
    'button.ytp-ad-skip-button-modern',
    'button[aria-label^="Skip"]',
    '.ytp-ad-text.ytp-ad-skip-button-text',
    '.ytp-ad-skip-button-slot',
    // Template page / Overlay / Survey skip selectors
    '.ytp-ad-overlay-close-button',
    '.ytp-ad-overlay-close-container',
    '.ytp-ad-survey-skip-button',
    '.ytp-ad-survey-submit-button',
    '.ytp-ad-survey-skip-button-container',
    'ytd-action-companion-ad-renderer button'
  ];

  for (const selector of skipSelectors) {
    const buttons = document.querySelectorAll(selector);
    for (const btn of buttons) {
      if (btn && btn.offsetParent !== null) { // Make sure the button is actually visible on screen
        // YouTube sometimes ignores simple btn.click(). We simulate a real mouse sequence.
        // We omit 'mouseover' so we don't wake up the YouTube player controls and disturb the screen.
        const events = ['mousedown', 'mouseup', 'click'];
        events.forEach(eventType => {
          const event = new MouseEvent(eventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1
          });
          btn.dispatchEvent(event);
        });
        
        // As a fallback, call click() anyway
        try { btn.click(); } catch (e) {}
      }
    }
  }
}

// Run the check every 250 milliseconds to ensure we catch the button exactly when it arrives
setInterval(checkForAds, 250);
