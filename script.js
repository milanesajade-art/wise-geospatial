const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
menuBtn?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('quoteForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = `Wise Geospatial Project Request — ${data.get('type')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `Company: ${data.get('company') || '—'}`,
    `Email: ${data.get('email')}`,
    `Project Type: ${data.get('type')}`,
    '',
    'Project Details:',
    data.get('details')
  ].join('\n');
  window.location.href = `mailto:kwise@wisegeospatial.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});