import { Linking, Platform } from 'react-native';

// Opens http(s) links in a new tab on web and with the system handler on native.
export function openLink(url) {
  if (!url) return;
  if (Platform.OS === 'web' && typeof window !== 'undefined' && /^https?:/i.test(url)) {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  Linking.openURL(url).catch(() => {});
}

// Builds the list of social links from the site settings. Empty values are skipped.
export function buildSocialLinks(settings) {
  const s = settings || {};
  const out = [];
  const add = (key, label, lib, icon, url) => {
    if (url) out.push({ key, label, lib, icon, url });
  };

  const wa = String(s.social_whatsapp || '').replace(/[^0-9]/g, '');
  add('whatsapp', 'WhatsApp', 'fa5', 'whatsapp', wa ? `https://wa.me/${wa}` : '');
  add('github', 'GitHub', 'fa5', 'github', httpOnly(s.social_github));
  add('linkedin', 'LinkedIn', 'fa5', 'linkedin-in', httpOnly(s.social_linkedin));
  add('twitter', 'Twitter / X', 'fa5', 'twitter', httpOnly(s.social_twitter));
  add('instagram', 'Instagram', 'fa5', 'instagram', httpOnly(s.social_instagram));
  const email = String(s.social_email || '').trim();
  add('email', 'Email', 'ion', 'mail', email ? `mailto:${email}` : '');
  return out;
}

function httpOnly(value) {
  const v = String(value || '').trim();
  return /^https?:\/\//i.test(v) ? v : '';
}
