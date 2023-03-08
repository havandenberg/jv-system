import styled from '@emotion/styled';
import {
  backgroundSet,
  BackgroundSetProps,
  borderSet,
  BorderSetProps,
  BoxShadowProps,
  boxShadow,
  displaySet,
  DisplaySetProps,
  flexSet,
  FlexSetProps,
  gridSet,
  GridSetProps,
  height,
  HeightProps,
  layoutSet,
  LayoutSetProps,
  overflowSet,
  OverflowSetProps,
  positionSet,
  PositionSetProps,
  size,
  SizeProps,
  spaceSet,
  SpaceSetProps,
  transformSet,
  TransformSetProps,
  transition,
  TransitionProps,
  width,
  WidthProps,
} from 'onno-react';
import { Link as RouterLink } from 'react-router-dom';

import th from './theme';
import { hexColorWithTransparency } from './utils';

interface CustomDivProps {
  alignCenter?: boolean;
  alignEnd?: boolean;
  alignStart?: boolean;
  centered?: boolean;
  column?: boolean;
  columnOnMobile?: boolean;
  columnReverseOnMobile?: boolean;
  cursor?: 'default' | 'pointer' | 'text';
  inline?: boolean;
  justifyBetween?: boolean;
  justifyCenter?: boolean;
  justifyEnd?: boolean;
  justifyStart?: boolean;
  relative?: boolean;
}

const customOptions: (props: CustomDivProps) => any = ({
  alignCenter,
  alignEnd,
  alignStart,
  centered,
  column,
  columnOnMobile,
  columnReverseOnMobile,
  cursor,
  inline,
  justifyBetween,
  justifyCenter,
  justifyEnd,
  justifyStart,
  relative,
}) => ({
  alignItems: alignStart
    ? 'flex-start'
    : alignEnd
    ? 'flex-end'
    : alignCenter || centered
    ? 'center'
    : undefined,
  flexDirection: column ? 'column' : undefined,
  cursor,
  display: inline ? 'inline-block' : undefined,
  justifyContent: justifyStart
    ? 'flex-start'
    : justifyEnd
    ? 'flex-end'
    : justifyCenter || centered
    ? 'center'
    : justifyBetween
    ? 'space-between'
    : undefined,
  position: relative ? 'relative' : undefined,
  [th.breakpointQueries.small]:
    columnOnMobile || columnReverseOnMobile
      ? { flexDirection: columnReverseOnMobile ? 'column-reverse' : 'column' }
      : {},
});

export type DivProps = BackgroundSetProps &
  BorderSetProps &
  BoxShadowProps &
  DisplaySetProps &
  FlexSetProps &
  GridSetProps &
  LayoutSetProps &
  OverflowSetProps &
  PositionSetProps &
  SpaceSetProps &
  TransformSetProps &
  CustomDivProps;

export const divPropsSet = [
  backgroundSet,
  borderSet,
  boxShadow,
  displaySet,
  flexSet,
  gridSet,
  layoutSet,
  overflowSet,
  positionSet,
  spaceSet,
  transformSet,
  customOptions,
];

const Div = styled.div<DivProps>(divPropsSet);
const Span = styled.span<DivProps>(divPropsSet);

const Flex = styled(Div)({ display: 'flex' }, divPropsSet);

const Grid = styled(Div)(
  {
    display: 'grid',
  },
  divPropsSet,
);

export const Anchor = styled.a<DivProps>(
  {
    textDecoration: 'none',
    ':link': {
      color: th.colors.brand.primaryAccent,
    },
    ':visited': {
      color: th.colors.brand.primaryAccent,
    },
  },
  divPropsSet,
);
export const AreaLink = styled(RouterLink)<DivProps>(
  {
    textDecoration: 'none',
  },
  divPropsSet,
);

const HoverButton = styled(Flex)(
  ({
    active,
    disabled,
    dark,
  }: {
    active?: boolean;
    dark?: boolean;
    disabled?: boolean;
  }) => ({
    alignItems: 'center',
    cursor: !disabled ? 'pointer' : 'default',
    opacity: !disabled
      ? active
        ? 1
        : dark
        ? th.opacities.secondary
        : th.opacities.disabled
      : th.opacities.disabled,
    transition: th.transitions.default,
    ':hover': {
      opacity: !disabled
        ? active || dark
          ? 1
          : th.opacities.secondary
        : th.opacities.disabled,
    },
  }),
);

export type ImgProps = HeightProps &
  SizeProps &
  SpaceSetProps &
  TransitionProps &
  WidthProps;
const Img = styled.img<ImgProps>(height, size, spaceSet, transition, width);

const GalleryWrapper = styled(Div)(
  {
    display: 'block',
    minHeight: '1px',
    overflow: 'auto',
    width: '100%',
  },
  divPropsSet,
);

const Cell = styled(Div)(
  ({
    clickable = true,
    error,
    highlightColor = th.colors.status.error,
    hoverable,
    isHighlight,
    isHalfHighlight,
    selected,
  }: {
    clickable?: boolean;
    error?: boolean;
    highlightColor?: string;
    hoverable?: boolean;
    isHighlight?: boolean;
    isHalfHighlight?: boolean;
    selected?: boolean;
  }) => ({
    backgroundColor: isHighlight
      ? hexColorWithTransparency(highlightColor, 0.2)
      : selected
      ? th.colors.brand.containerBackgroundAccent
      : th.colors.brand.containerBackground,
    background: isHalfHighlight
      ? `repeating-linear-gradient( -45deg, ${hexColorWithTransparency(
          highlightColor,
          0.2,
        )}, ${hexColorWithTransparency(highlightColor, 0.2)} 5px, ${
          selected
            ? th.colors.brand.containerBackgroundAccent
            : th.colors.brand.containerBackground
        } 5px, ${
          selected
            ? th.colors.brand.containerBackgroundAccent
            : th.colors.brand.containerBackground
        } 15px)`
      : undefined,
    border: error
      ? th.borders.error
      : selected
      ? th.borders.secondary
      : th.borders.disabled,
    borderRadius: th.borderRadii.default,
    paddingLeft: th.spacing.sm,
    transition: th.transitions.default,
    ':hover': {
      backgroundColor: isHighlight
        ? hexColorWithTransparency(highlightColor, 0.3)
        : clickable || hoverable
        ? th.colors.brand.containerBackgroundAccent
        : undefined,
      border: error
        ? th.borders.error
        : clickable || hoverable
        ? th.borders.secondary
        : th.borders.disabled,
    },
  }),
  divPropsSet,
);

export default {
  AreaLink,
  Anchor,
  Cell,
  Div,
  Flex,
  GalleryWrapper,
  Grid,
  HoverButton,
  Img,
  Span,
};
