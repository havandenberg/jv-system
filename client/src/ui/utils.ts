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

export const scrollToId = (id: string = 'main', customOptions?: object) =>
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

  const result: RegExpExecArray | null =
    /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

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
  '#F44E3B',
  '#D33115',
  '#9F0500',
  '#FE9200',
  '#E27300',
  '#C45100',
  '#FCDC00',
  '#FCC400',
  '#FB9E00',
  '#DBDF00',
  '#B0BC00',
  '#808900',
  '#A4DD00',
  '#68BC00',
  '#194D33',
  '#68CCCA',
  '#16A5A5',
  '#0C797D',
  '#73D8FF',
  '#009CE0',
  '#0062B1',
  '#AEA1FF',
  '#7B64FF',
  '#653294',
  '#FDA1FF',
  '#FA28FF',
  '#AB149E',
  '#4D4D4D',
  '#333333',
  '#000000',
  '#999999',
  '#808080',
  '#666666',
  '#FFFFFF',
  '#CCCCCC',
  '#B3B3B3',
];

export const getRandomColor = (colorSet: string[] = defaultColorSet) =>
  colorSet[Math.floor(Math.random() * colorSet.length)];
