// Rehman Dental Clinic — landing page interactions
(() => {
  const WHATSAPP = '923113114436';

  // Header shrink on scroll
  const header = document.querySelector('.header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobileMenu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Reveal on scroll, with a small stagger for siblings
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const siblings = [...e.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
        e.target.style.transitionDelay = `${Math.min(siblings.indexOf(e.target), 5) * 70}ms`;
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Only one step open at a time in "how it works"
  const steps = document.querySelectorAll('.step');
  steps.forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) steps.forEach((o) => { if (o !== d) o.open = false; });
  }));

  // Before / after slider
  const ba = document.querySelector('.ba');
  if (ba) {
    const range = ba.querySelector('input');
    range.addEventListener('input', () => ba.style.setProperty('--pos', `${range.value}%`));
  }

  // Booking form → WhatsApp
  const form = document.getElementById('bookForm');
  const date = document.getElementById('f-date');
  date.min = new Date().toISOString().split('T')[0];
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let ok = true;
    ['name', 'phone'].forEach((n) => {
      const input = form.elements[n];
      const bad = !input.value.trim();
      input.parentElement.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      form.querySelector('.invalid input').focus();
      return;
    }
    const f = form.elements;
    const lines = [
      'Assalam o Alaikum, I would like to book an appointment at Rehman Dental Clinic.',
      `Name: ${f.name.value.trim()}`,
      `Phone: ${f.phone.value.trim()}`,
      `Treatment: ${f.service.value}`,
      f.date.value ? `Preferred date: ${f.date.value}` : '',
      f.message.value.trim() ? `Message: ${f.message.value.trim()}` : '',
    ].filter(Boolean);
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
