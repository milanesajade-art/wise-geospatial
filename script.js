const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

function setMenu(open) {
  if (!menuBtn || !nav) return;
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  menuBtn.querySelector('span').textContent = open ? '×' : '☰';
  document.body.classList.toggle('menu-open', open);
}

menuBtn?.addEventListener('click', () => {
  setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

document.addEventListener('click', (event) => {
  if (nav?.classList.contains('open') && !nav.contains(event.target) && !menuBtn?.contains(event.target)) {
    setMenu(false);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenu(false);
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const quoteForm = document.getElementById('quoteForm');
const projectType = quoteForm?.querySelector('select[name="type"]');

document.querySelectorAll('[data-project-type]').forEach((link) => {
  link.addEventListener('click', () => {
    const requestedType = link.dataset.projectType;
    const matchingOption = [...(projectType?.options || [])].find((option) => option.value === requestedType);
    if (matchingOption) projectType.value = requestedType;
  });
});

quoteForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!quoteForm.reportValidity()) return;

  const data = new FormData(quoteForm);
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

  const status = quoteForm.querySelector('.form-status');
  if (status) status.textContent = 'Opening your email app with the project details…';

  window.location.href = `mailto:kwise@wisegeospatial.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
