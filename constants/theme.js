import { Platform } from 'react-native';

// BEYNATION / DIGITAL REALITY design tokens
export const colors = {
  bg: '#050B14',
  bgSoft: '#08111F',
  surfaceSolid: '#0B1628',
  surface: 'rgba(12, 24, 44, 0.62)',
  surfaceStrong: 'rgba(16, 32, 58, 0.86)',
  border: 'rgba(0, 240, 255, 0.16)',
  borderStrong: 'rgba(0, 240, 255, 0.42)',
  borderSoft: 'rgba(148, 190, 230, 0.12)',
  cyan: '#00F0FF',
  blue: '#38BDF8',
  royal: '#0B5FFF',
  text: '#E8F4FF',
  textMuted: '#93A9C4',
  textDim: '#5F7692',
  success: '#34D399',
  danger: '#FB7185',
  warning: '#FBBF24',
  onAccent: '#031018',
};

export const gradients = {
  accent: ['#00F0FF', '#38BDF8'],
  accentDeep: ['#38BDF8', '#0B5FFF'],
  page: ['#050B14', '#07142A', '#050B14'],
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, huge: 48 };
export const radii = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 };

export const fonts = {
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  }),
};

export const type = {
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.cyan,
  },
  h1: { fontSize: 36, lineHeight: 42, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 19, lineHeight: 25, fontWeight: '700', color: colors.text },
  body: { fontSize: 15.5, lineHeight: 24, color: colors.textMuted },
  small: { fontSize: 13, lineHeight: 19, color: colors.textMuted },
};

// Soft cyan glow that works on web and native.
export function glowShadow(color = colors.cyan, radius = 16, opacity = 0.45) {
  if (Platform.OS === 'web') {
    return { boxShadow: `0px 0px ${radius}px rgba(0, 240, 255, ${opacity})` };
  }
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 0 },
  };
}

export function textGlow(color = colors.cyan, radius = 12) {
  return {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: radius,
  };
}
