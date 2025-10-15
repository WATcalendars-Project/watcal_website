document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.star-button');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Opens the repo's stargazer UI; users can star after logging in
    window.open('https://github.com/dominikx2002/WATcalendars', '_blank', 'noopener');
  });
});
