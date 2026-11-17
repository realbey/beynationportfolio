import { useWindowDimensions } from 'react-native';

export const MAX_WIDTH = 1120;

export function useBreakpoint() {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 960;
  const isMedium = width >= 640;
  const pad = isWide ? 32 : isMedium ? 28 : 18;
  const contentWidth = Math.max(240, Math.min(width, MAX_WIDTH) - pad * 2);
  const columns = isWide ? 3 : isMedium ? 2 : 1;
  return { width, height, isWide, isMedium, pad, contentWidth, columns };
}
