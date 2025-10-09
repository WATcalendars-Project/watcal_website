function copyToClipboard(text, trigger) {
  navigator.clipboard.writeText(text).then(() => {
    let copiedMsg = trigger.parentElement.querySelector('.copied-msg');
    if (!copiedMsg) {
      copiedMsg = document.createElement('span');
      copiedMsg.className = 'copied-msg';
      trigger.parentElement.insertBefore(copiedMsg, trigger);
    }
    copiedMsg.textContent = 'Copied';
    copiedMsg.style.display = 'inline';
    setTimeout(() => {
      copiedMsg.style.display = 'none';
    }, 1500);
  });
}