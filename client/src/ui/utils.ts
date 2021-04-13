import Scroll from 'react-scroll';

import th from './theme';

const TABLET_BREAKPOINT = 768;
const SMALL_BREAKPOINT = 699;
const TINY_BREAKPOINT = 321;

export const DESKTOP = 'desktop';
export const SMALL = 'small';
export const TABLET = 'tablet';
export const TABLET_DOWN = 'tabletDown';
export const TABLET_UP = 'tabletUp';
export const TINY = 'tiny';

export const isDesktop = () =>
  typeof window !== 'undefined' && window.innerWidth > TABLET_BREAKPOINT;

export const isMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= TABLET_BREAKPOINT;

export const isSmall = () =>
  typeof window !== 'undefined' && window.innerWidth <= SMALL_BREAKPOINT;

export const isTabletOnly = () =>
  typeof window !== 'undefined' &&
  window.innerWidth <= TABLET_BREAKPOINT &&
  window.innerWidth > SMALL_BREAKPOINT;

export const isTabletUp = () =>
  typeof window !== 'undefined' && window.innerWidth >= SMALL_BREAKPOINT;

export const isTiny = () =>
  typeof window !== 'undefined' && window.innerWidth < TINY_BREAKPOINT;

export const scrollToId = (id: string = 'top', customOptions?: object) =>
  Scroll.scroller.scrollTo(id, {
    ...th.scrollOptions,
    ...customOptions,
  });

export const hexColorWithTransparency = (
  hexColor: string,
  transparency: number,
) => {
  const alphaHexValue =
    transparency < 1
      ? (transparency * 255).toString(16)
      : transparency.toString(16);
  return `${hexColor}${alphaHexValue.slice(0, 2)}`;
};

interface RGB {
  b: number;
  g: number;
  r: number;
}
const rgbToYIQ = ({ r, g, b }: RGB): number => {
  return (r * 299 + g * 587 + b * 114) / 1000;
};
const hexToRgb = (hex: string): RGB | undefined => {
  if (!hex || hex === undefined || hex === '') {
    return undefined;
  }

  const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex,
  );

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : undefined;
};

export const contrastColor = (
  colorHex: string | undefined,
  threshold: number = 128,
): string => {
  if (colorHex === undefined) {
    return th.colors.text.default;
  }

  const rgb: RGB | undefined = hexToRgb(colorHex);

  if (rgb === undefined) {
    return th.colors.text.default;
  }

  return rgbToYIQ(rgb) >= threshold
    ? th.colors.text.default
    : th.colors.text.inv;
};

export const defaultColorSet = [
  '#F34236',
  '#E81E63',
  '#9D27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#607D8B',
];

export const getRandomColor = (colorSet: string[] = defaultColorSet) =>
  colorSet[Math.floor(Math.random() * colorSet.length)];
