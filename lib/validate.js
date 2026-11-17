const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  subject: { min: 3, max: 120 },
  message: { min: 10, max: 2000 },
};

export function validateContact(values) {
  const errors = {};
  const name = (values.name || '').trim();
  const email = (values.email || '').trim();
  const subject = (values.subject || '').trim();
  const message = (values.message || '').trim();

  if (name.length < LIMITS.name.min) errors.name = 'Please enter your name (at least 2 characters).';
  else if (name.length > LIMITS.name.max) errors.name = 'Name is too long (80 characters max).';

  if (!email) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(email) || email.length > LIMITS.email.max) errors.email = 'That email address does not look right.';

  if (subject.length < LIMITS.subject.min) errors.subject = 'Please add a short subject (at least 3 characters).';
  else if (subject.length > LIMITS.subject.max) errors.subject = 'Subject is too long (120 characters max).';

  if (message.length < LIMITS.message.min) errors.message = 'Tell me a bit more (at least 10 characters).';
  else if (message.length > LIMITS.message.max) errors.message = 'Message is too long (2000 characters max).';

  return errors;
}

export function isValidUrl(value) {
  if (!value) return true;
  return /^https?:\/\/[^\s]+$/i.test(value.trim());
}

export function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');
}

export function slugify(value) {
  return (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
