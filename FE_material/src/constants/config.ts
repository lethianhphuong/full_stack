// App configuration
export const APP_CONFIG = {
  name: 'Demo MUI Dashboard',
  version: '1.0.0',
  description: 'Minimal Dashboard built with React + MUI',
} as const;

export const HEADER = {
  H_MOBILE: 64,
  H_DESKTOP: 80,
  H_DESKTOP_OFFSET: 80 - 16,
} as const;

export const NAV = {
  W_VERTICAL: 280,
  W_MINI: 88,
} as const;
