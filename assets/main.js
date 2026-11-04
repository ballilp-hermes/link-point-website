// Link Point site — mobile nav, footer year, and an enquiry form that needs no backend.
// Content must never depend on JS to be visible: the reveal effect only ever adds
// emphasis to something already rendered.

document.getElementById('year').textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.addEventListener('click', e => {
  if (e.target.tagName === 'A' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

// No scroll-reveal animation by design: content must be visible even if a script,
// an observer or a slow device never fires. Simplicity beats a fading hero.

// Enquiry form: composes a mailto: so the enquiry is never swallowed by a dead endpoint.
const form = document.getElementById('rfq');
const note = document.getElementById('form-note');
const EMAIL = 'sales@link-point.org';

form.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const get = k => (data.get(k) || '').toString().trim();

  const missing = ['company', 'name', 'email', 'country', 'message'].filter(k => !get(k));
  if (missing.length) {
    note.textContent = 'Please complete: ' + missing.join(', ') + '.';
    note.classList.remove('ok');
    const first = form.querySelector(`[name="${missing[0]}"]`);
    if (first) first.focus();
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('email'))) {
    note.textContent = 'That email address does not look complete.';
    note.classList.remove('ok');
    return;
  }

  const subject = `Quotation enquiry — ${get('company')} (${get('country')})`;
  const body = [
    `Company: ${get('company')}`,
    `Name: ${get('name')}`,
    `Email: ${get('email')}`,
    `Country: ${get('country')}`,
    `Product line: ${get('line')}`,
    `Quantity: ${get('qty') || '—'}`,
    '',
    'Requirement:',
    get('message'),
  ].join('\n');

  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = 'Opening your email client — send the message and we will reply within one business day.';
  note.classList.add('ok');
});
