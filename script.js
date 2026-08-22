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


function trackEvent(name, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, params);
}

const servicePage = document.body.dataset.servicePage || (document.body.classList.contains('property-guide-page')
  ? 'san_antonio_drone_property_guide'
  : document.body.classList.contains('property-page')
    ? 'property_documentation'
    : document.body.classList.contains('energy-page')
      ? 'energy'
      : 'home');

trackEvent('service_page_view', {
  service_page: servicePage,
  page_path: window.location.pathname
});

document.querySelectorAll('.btn, .nav-cta, .industry-link, .text-link').forEach((link) => {
  link.addEventListener('click', () => {
    trackEvent('cta_click', {
      link_text: link.textContent.trim().slice(0, 100),
      link_url: link.getAttribute('href') || '',
      service_page: servicePage
    });
  });
});

const projectGallery = document.getElementById('projectGallery');
const galleryTitle = document.getElementById('gallery-title');
const galleryIntro = document.getElementById('gallery-intro');
const galleryDetails = {
  estate: { title: 'Luxury estate listing shot set', intro: 'A 28–36 still premium-listing target: context first, then architecture, the key room sequence and a roof plan-view reference. Every sample names its capture angle so the set can be scoped—not guessed.' },
  residential: { title: 'Residential property documentation set', intro: 'A 22–30 still target that separates buyer-facing listing photography from visible-condition documentation. The result explains the home, setting, key rooms and roof/site context without calling it an inspection.' },
  commercial: { title: 'Commercial property documentation set', intro: 'A repeatable site, façade, roof and interior sequence for brokers, owners and project teams. The roof baseline adds plan-view and 45-degree obliques; model-ready capture is only used when the stated overlap threshold is met.' },
  ranch: { title: 'Ranch + acreage documentation set', intro: 'A 24–36 still, property-scoped plan: tract context, access, improvements, the residence and the primary interior—not a random collection of scenic aerials.' },
  tour: { title: 'Cinematic + interactive tour shot set', intro: 'A consistent exterior-to-interior visual route with level, repeatable key-room frames. It can support a hosted 3D tour or a short walkthrough edit when those deliverables are scoped.' }
};

function closeProjectGallery() {
  if (projectGallery?.open) projectGallery.close();
}

document.querySelectorAll('[data-gallery]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const key = trigger.dataset.gallery;
    const details = galleryDetails[key];
    const activePanel = projectGallery?.querySelector(`[data-gallery-panel="${key}"]`);
    if (!details || !activePanel || !projectGallery) return;
    projectGallery.querySelectorAll('[data-gallery-panel]').forEach((panel) => { panel.hidden = panel !== activePanel; });
    galleryTitle.textContent = details.title;
    galleryIntro.textContent = details.intro;
    projectGallery.showModal();
    projectGallery.querySelector('.gallery-close')?.focus();
    trackEvent('project_example_gallery_open', { gallery_type: key, service_page: servicePage });
  });
});

projectGallery?.querySelector('.gallery-close')?.addEventListener('click', closeProjectGallery);
projectGallery?.addEventListener('click', (event) => {
  if (event.target === projectGallery) closeProjectGallery();
});

document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach((link) => {
  link.addEventListener('click', () => {
    trackEvent('contact_click', {
      contact_method: link.href.startsWith('mailto:') ? 'email' : 'phone',
      link_location: link.closest('footer') ? 'footer' : 'page_content'
    });
  });
});

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
  const bodyLines = [
    `Name: ${data.get('name')}`,
    `Company: ${data.get('company') || '—'}`,
    `Email: ${data.get('email')}`,
    `Project Type: ${data.get('type')}`
  ];

  if (data.has('propertyType')) bodyLines.push(`Property Type: ${data.get('propertyType')}`);
  if (data.has('timeline')) bodyLines.push(`Launch Timing: ${data.get('timeline')}`);

  const body = bodyLines.concat([
    '',
    'Project Details:',
    data.get('details')
  ]).join('\n');

  trackEvent('project_request_prepare', { project_type: String(data.get('type') || 'not_specified') });

  const status = quoteForm.querySelector('.form-status');
  if (status) status.textContent = 'Opening your email app with the project details…';

  window.location.href = `mailto:kwise@wisegeospatial.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll('.booking-link').forEach((link) => {
  link.addEventListener('click', () => {
    trackEvent('appointment_booking_click', {
      link_location: link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'page_content',
      service_page: servicePage
    });
  });
});
