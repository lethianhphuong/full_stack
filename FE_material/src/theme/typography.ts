import type { ThemeFontFamily } from '@/types/settings';

// ----------------------------------------------------------------------

export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }: { sm: number; md: number; lg: number }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    fontSecondaryFamily: string;
    fontWeightSemiBold: number;
  }
  interface TypographyVariantsOptions {
    fontSecondaryFamily?: string;
    fontWeightSemiBold?: number;
  }
}

// ----------------------------------------------------------------------

// Font family mapping
const FONT_FAMILIES: Record<ThemeFontFamily, string> = {
  'Public Sans': '"Public Sans", sans-serif',
  'Inter': '"Inter", sans-serif',
  'DM Sans': '"DM Sans", sans-serif',
  'Nunito Sans': '"Nunito Sans", sans-serif',
};

// ----------------------------------------------------------------------

export function createTypography(fontFamily: ThemeFontFamily = 'Public Sans', baseFontSize: number = 16) {
  const primaryFont = FONT_FAMILIES[fontFamily];
  const secondaryFont = 'Barlow, sans-serif';
  
  // Scale factor based on base font size (16 is default)
  const scale = baseFontSize / 16;

  const scaledPxToRem = (value: number) => pxToRem(value * scale);

  return {
    fontFamily: primaryFont,
    fontSecondaryFamily: secondaryFont,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      lineHeight: 80 / 64,
      fontSize: scaledPxToRem(40),
      ...responsiveFontSizes({ sm: 52 * scale, md: 58 * scale, lg: 64 * scale }),
    },
    h2: {
      fontWeight: 800,
      lineHeight: 64 / 48,
      fontSize: scaledPxToRem(32),
      ...responsiveFontSizes({ sm: 40 * scale, md: 44 * scale, lg: 48 * scale }),
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: scaledPxToRem(24),
      ...responsiveFontSizes({ sm: 26 * scale, md: 30 * scale, lg: 32 * scale }),
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: scaledPxToRem(20),
      ...responsiveFontSizes({ sm: 20 * scale, md: 24 * scale, lg: 24 * scale }),
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: scaledPxToRem(18),
      ...responsiveFontSizes({ sm: 19 * scale, md: 20 * scale, lg: 20 * scale }),
    },
    h6: {
      fontWeight: 700,
      lineHeight: 28 / 18,
      fontSize: scaledPxToRem(17),
      ...responsiveFontSizes({ sm: 18 * scale, md: 18 * scale, lg: 18 * scale }),
    },
    subtitle1: {
      fontWeight: 600,
      lineHeight: 1.5,
      fontSize: scaledPxToRem(16),
    },
    subtitle2: {
      fontWeight: 600,
      lineHeight: 22 / 14,
      fontSize: scaledPxToRem(14),
    },
    body1: {
      lineHeight: 1.5,
      fontSize: scaledPxToRem(16),
    },
    body2: {
      lineHeight: 22 / 14,
      fontSize: scaledPxToRem(14),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: scaledPxToRem(12),
    },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: scaledPxToRem(12),
      textTransform: 'uppercase' as const,
    },
    button: {
      fontWeight: 700,
      lineHeight: 24 / 14,
      fontSize: scaledPxToRem(14),
      textTransform: 'unset' as const,
    },
  };
}

// Default typography (for backward compatibility)
export const typography = createTypography();
