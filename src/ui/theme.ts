import './fonts.css';
import { DESKTOP, SMALL, TABLET, TABLET_DOWN, TABLET_UP, TINY } from './utils';

export const colors = {
  background: '#EAF5FF',
  black: '#00080F',
  white: '#FFFFFF',
  brand: {
    primary: '#03294A',
    primaryAccent: '#064C89',
    secondary: '#D2CD2E',
  },
  text: {
    default: '#03294A',
    link: '#064C89',
    inv: '#FFFFFF',
  },
  status: {
    success: '#06D6A0',
    error: '#F76C5E',
    warning: '#F4D35E',
  },
  overlay: {
    dark: 'rgba(32,32,32,0.64)',
    medium: 'rgba(32,32,32,0.32)',
    light: 'rgba(32,32,32,0.08)',
  },
};

// Layout
export const heights = {};

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
  transparent: '1px solid transparent',
};

export const borderRadii = { circle: '50%', default: 6, input: 3 };

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

export const shadows = {};

export const transitions = {
  default: 'all 0.3s ease',
};

export const scrollOptions = {
  duration: 300,
  offset: -100,
  smooth: 'true',
};

export const scrollStyles = (showScrollBar: boolean) => ({
  '::-webkit-scrollbar': {
    height: showScrollBar ? 18 : 0,
    width: showScrollBar ? 18 : 0,
  },
  '::-webkit-scrollbar-button': {
    display: 'none',
    height: 0,
    width: 0,
  },
  '::-webkit-scrollbar-corner': {
    backgroundColor: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    '-webkit-border-radius': 20,
    '-webkit-box-shadow':
      'inset -1px -1px 0px rgba(0, 0, 0, 0.05), inset 1px 1px 0px rgba(0, 0, 0, 0.05)',
    backgroundClip: 'padding-box',
    backgroundColor: colors.white,
    border: showScrollBar ? '8px solid rgba(0, 0, 0, 0)' : 0,
    height: showScrollBar ? 4 : 0,
  },
  overflow: 'auto',
});

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
  scrollStyles,
  shadows,
  sizes,
  spacing,
  textStyles,
  transitions,
  widths,
};
