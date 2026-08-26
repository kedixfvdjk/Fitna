export const Colors = {
  background: '#09090B',
  surface: '#18181B',
  surfaceLight: '#27272A',
  primary: '#8B5CF6',
  green: '#22C55E',
  gold: '#F59E0B',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA',
  danger: '#EF4444',
  border: '#27272A',
} as const;

export type ColorName = keyof typeof Colors;
