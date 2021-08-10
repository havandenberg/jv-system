import './fonts.css';
import { DESKTOP, SMALL, TABLET, TABLET_DOWN, TABLET_UP, TINY } from './utils';

export const colors = {
  background: '#FFFFFF',
  black: '#00080F',
  white: '#FFFFFF',
  brand: {
    containerBackground: 'rgba(3,41,74,0.05)',
    containerBackgroundAccent: 'rgba(3,41,74,0.1)',
    primary: '#03294A',
    primaryAccent: '#064C89',
    secondary: 'rgba(3,41,74,0.7)',
    disabled: 'rgba(3,41,74,0.4)',
    logo: '#D2CD2E',
  },
  text: {
    default: '#03294A',
    link: '#064C89',
    inv: '#FFFFFF',
  },
  status: {
    success: '#06D6A0',
    successAlt: '#008001',
    error: '#F76C5E',
    warning: '#F4D35E',
    warningSecondary: '#E77728',
  },
  overlay: {
    dark: 'rgba(32,32,32,0.64)',
    medium: 'rgba(32,32,32,0.32)',
    light: 'rgba(32,32,32,0.08)',
  },
  cellHighlight: '#FEFF00',
};

// Layout
export const heights = {
  input: 32,
  nav: 80,
  navButton: 45,
  pageHeader: 100,
};

export const sizes = {
  fill: '100%',
  icon: '24px',
  xs: '16px',
  sm: '32px',
  md: '48px',
  lg: '64px',
  xl: '96px',
  xxl: '128px',
  xxxl: '256px',
};

export const spacing = {
  tn: '2px',
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '32px',
  xl: '64px',
  xxl: '128px',
  xxxl: '256px',
};

export const widths = {
  input: 300,
  maxContent: '1024px',
  maxPage: '1440px',
};

// Typography
export const fontFamilies = {
  body: 'Nunito, system-ui, sans-serif',
  header: 'TrajanPro, system-ui, sans-serif',
};

export const fontSizes = {
  small: '12px',
  caption: '14px',
  body: '16px',
  large: '20px',
  title: '26px',
  display: '32px',
  huge: '48px',
};

export const fontWeights = {
  normal: 500,
  bold: 700,
};

export const lineHeights = { single: 1, heading: 1.25, main: 1.5 };

// Display
export const borders = {
  black: `1px solid ${colors.black}`,
  error: `1px solid ${colors.status.error}`,
  primary: `1px solid ${colors.brand.primary}`,
  primaryAccent: `1px solid ${colors.brand.primaryAccent}`,
  secondary: `1px solid ${colors.brand.secondary}`,
  disabled: `1px solid ${colors.brand.disabled}`,
  transparent: '1px solid transparent',
};

export const borderRadii = { circle: '50%', default: 6, input: 30 };

export const breakpoints = [320, 700, 999];

export const breakpointQueries = {
  [DESKTOP]: '@media (min-width: 1000px)',
  [SMALL]: '@media (max-width: 699px)',
  [TABLET]: '@media (min-width: 700px) and (max-width: 999px)',
  [TABLET_DOWN]: '@media (max-width: 999px)',
  [TABLET_UP]: '@media (min-width: 700px)',
  [TINY]: '@media (max-width: 320px)',
};

export const opacities = { disabled: 0.4, secondary: 0.7 };

export const shadows = {
  box: `${colors.brand.disabled} 0px 5px 15px`,
  boxLight: `${colors.brand.disabled} 0px 2px 4px`,
  contentBottom: `0 10px 6px -4px ${colors.brand.containerBackgroundAccent}`,
  contentTop: `0 -10px 6px -4px ${colors.brand.containerBackgroundAccent}`,
};

export const transitions = {
  default: 'all 0.2s ease',
};

export const scrollOptions = {
  duration: 300,
  offset: -100,
  smooth: 'true',
};

export const textStyles = {
  small: {
    fontSize: fontSizes.small,
    margin: 0,
  },
  caption: {
    fontSize: fontSizes.caption,
    margin: 0,
  },
  body: {
    fontSize: fontSizes.body,
    margin: 0,
  },
  large: {
    fontSize: fontSizes.large,
    margin: 0,
  },
  title: {
    fontSize: fontSizes.title,
    fontFamily: fontFamilies.header,
  },
  display: {
    fontSize: fontSizes.display,
    fontFamily: fontFamilies.header,
  },
  huge: {
    fontSize: fontSizes.huge,
    fontFamily: fontFamilies.header,
  },
  common: {
    color: colors.text.default,
    letterSpacing: 0.5,
    transition: transitions.default,
  },
};

// Global
export const globalStyles = {
  body: {
    background: colors.background,
    fontFamily: fontFamilies.body,
    margin: 0,
    padding: 0,
  },
  h1: {
    ...textStyles.common,
    ...textStyles.title,
    fontFamily: fontFamilies.header,
  },
  p: {
    ...textStyles.common,
    ...textStyles.body,
  },
  'button, select, input': {
    fontFamily: fontFamilies.body,
  },
};

export default {
  borderRadii,
  borders,
  breakpoints,
  breakpointQueries,
  colors,
  fontFamilies,
  fontSizes,
  fontWeights,
  globalStyles,
  heights,
  lineHeights,
  opacities,
  scrollOptions,
  shadows,
  sizes,
  spacing,
  textStyles,
  transitions,
  widths,
};
