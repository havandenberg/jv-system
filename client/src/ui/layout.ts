import styled from '@emotion/styled';
import {
  backgroundSet,
  BackgroundSetProps,
  borderSet,
  BorderSetProps,
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

interface CustomDivProps {
  alignCenter?: boolean;
  alignEnd?: boolean;
  alignStart?: boolean;
  column?: boolean;
  columnOnMobile?: boolean;
  columnReverseOnMobile?: boolean;
  cursor?: 'default' | 'pointer';
  inline?: boolean;
  justifyBetween?: boolean;
  justifyCenter?: boolean;
  justifyEnd?: boolean;
  justifyStart?: boolean;
  relative?: boolean;
  wrap?: boolean;
}

const customOptions: (props: CustomDivProps) => any = ({
  alignCenter,
  alignEnd,
  alignStart,
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
  wrap,
}) => ({
  alignItems: alignStart
    ? 'flex-start'
    : alignEnd
    ? 'flex-end'
    : alignCenter
    ? 'center'
    : undefined,
  flexDirection: column ? 'column' : undefined,
  cursor,
  display: inline ? 'inline-block' : undefined,
  flexWrap: wrap ? 'wrap' : undefined,
  justifyContent: justifyStart
    ? 'flex-start'
    : justifyEnd
    ? 'flex-end'
    : justifyCenter
    ? 'center'
    : justifyBetween
    ? 'flex-between'
    : undefined,
  position: relative ? 'relative' : undefined,
  [th.breakpointQueries.small]:
    columnOnMobile || columnReverseOnMobile
      ? { flexDirection: columnReverseOnMobile ? 'column-reverse' : 'column' }
      : {},
});

export type DivProps = BackgroundSetProps &
  BorderSetProps &
  DisplaySetProps &
  FlexSetProps &
  GridSetProps &
  LayoutSetProps &
  PositionSetProps &
  SpaceSetProps &
  TransformSetProps &
  CustomDivProps;

export const divPropsSet = [
  backgroundSet,
  borderSet,
  displaySet,
  flexSet,
  gridSet,
  layoutSet,
  spaceSet,
  transformSet,
  positionSet,
  customOptions,
];

const Div = styled.div<DivProps>(divPropsSet);
const Span = styled.span<DivProps>(divPropsSet);

const Flex = styled(Div)<DivProps>({ display: 'flex' }, divPropsSet);

const Grid = styled(Div)<DivProps>(
  {
    display: 'grid',
  },
  divPropsSet,
);

export const Anchor = styled.a<DivProps>(
  {
    textDecoration: 'none',
  },
  divPropsSet,
);
export const AreaLink = styled(RouterLink)<DivProps>(
  {
    textDecoration: 'none',
  },
  divPropsSet,
);

export interface ScrollProps {
  showScrollBar?: boolean;
}
const Scroll = styled(Div)<DivProps & ScrollProps & any>(
  ({ showScrollBar = true }: { showScrollBar: boolean }) => ({
    ...th.scrollStyles(showScrollBar),
  }),
  divPropsSet,
);

export type ImgProps = HeightProps &
  SizeProps &
  SpaceSetProps &
  TransitionProps &
  WidthProps;
const Img = styled.img<ImgProps>(height, size, spaceSet, transition, width);

const Primary = styled(Span)<DivProps>(
  {
    color: th.colors.brand.primary,
  },
  divPropsSet,
);

export default {
  AreaLink,
  Anchor,
  Div,
  Flex,
  Grid,
  Primary,
  Img,
  Scroll,
  Span,
};
