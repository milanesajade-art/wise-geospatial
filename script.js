const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

const contactDock = document.createElement('aside');
contactDock.className = 'contact-dock';
contactDock.setAttribute('aria-label', 'Contact Wise Geospatial');
contactDock.innerHTML = `
  <a class="contact-dock__item" href="tel:+12109020888" aria-label="Call Wise Geospatial at (210) 902-0888">
    <span>CALL</span><strong>(210) 902-0888</strong>
  </a>
  <a class="contact-dock__item" href="mailto:kwise@wisegeospatial.com" aria-label="Email Wise Geospatial at kwise@wisegeospatial.com">
    <span>EMAIL</span><strong>kwise@wisegeospatial.com</strong>
  </a>
  <a class="contact-dock__book booking-link" href="https://calendar.app.google/kaoqQgkgv8akGxPDA" target="_blank" rel="noopener noreferrer">BOOK A CALL</a>
`;
document.body.append(contactDock);

const contactDockStyles = document.createElement('style');
contactDockStyles.textContent = `
  .contact-dock {
    position: fixed; right: 20px; bottom: 20px; z-index: 50;
    display: flex; align-items: center; gap: 18px;
    width: max-content; max-width: calc(100vw - 32px);
    padding: 12px 14px; border: 1px solid rgba(64,230,196,.32);
    border-radius: 12px; background: rgba(8,19,27,.96);
    box-shadow: 0 12px 36px rgba(0,0,0,.32); color: #edf3f5;
    font: 500 12px/1.3 Manrope, system-ui, sans-serif;
    -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);
  }
  .contact-dock__item { display: grid; gap: 2px; min-width: 0; }
  .contact-dock__item span { color: #91a5af; font-size: 9px; font-weight: 800; letter-spacing: .12em; }
  .contact-dock__item strong { color: #edf3f5; font-size: 11px; font-weight: 700; white-space: nowrap; }
  .contact-dock__item:hover strong { color: #40e6c4; }
  .contact-dock__book {
    display: inline-flex; align-items: center; justify-content: center;
    min-height: 40px; padding: 0 14px; border-radius: 7px;
    background: #40e6c4; color: #08131b; font-size: 10px;
    font-weight: 800; letter-spacing: .06em; white-space: nowrap;
  }
  .contact-dock__book:hover { background: #74f1d8; }
  .contact-dock a:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
  @media (max-width: 760px) {
    body { padding-bottom: 82px; }
    .contact-dock {
      right: 8px; bottom: max(8px, env(safe-area-inset-bottom)); left: 8px;
      width: auto; max-width: none; justify-content: space-between; gap: 8px;
      padding: 9px 10px;
    }
    .contact-dock__item { flex: 1 1 auto; }
    .contact-dock__item span { font-size: 8px; }
    .contact-dock__item strong { font-size: clamp(9px, 2.8vw, 11px); }
    .contact-dock__book { min-height: 38px; padding: 0 10px; font-size: 9px; }
  }
  @media (max-width: 365px) {
    .contact-dock { gap: 5px; padding-inline: 7px; }
    .contact-dock__item strong { font-size: 9px; }
    .contact-dock__book { padding-inline: 7px; font-size: 8px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .contact-dock, .contact-dock * { scroll-behavior: auto; transition: none !important; }
  }
`;
document.head.append(contactDockStyles);


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

// Keep this breakpoint aligned with the shared navigation styles.
const compactNavigation = window.matchMedia('(max-width: 72rem)');
compactNavigation.addEventListener('change', (event) => {
  if (!event.matches) setMenu(false);
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
      link_location: link.closest('footer') ? 'footer' : 'page_content',
      service_page: servicePage
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
  const projectTypeValue = String(data.get('type') || 'not_specified');
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

  trackEvent('project_request_prepare', {
    project_type: projectTypeValue,
    service_page: servicePage
  });
  trackEvent('generate_lead', {
    lead_source: 'website_project_request',
    project_type: projectTypeValue,
    service_page: servicePage
  });

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
