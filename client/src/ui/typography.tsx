import React from 'react';
import styled from '@emotion/styled';
import {
  layoutSet,
  LayoutSetProps,
  opacity,
  OpacityProps,
  spaceSet,
  SpaceSetProps,
  textSet,
  TextSetProps,
  transformSet,
  TransformSetProps,
  transition,
  TransitionProps,
} from 'onno-react';

import { divPropsSet } from './layout';
import th from './theme';

interface CustomTextProps {
  bold?: boolean;
  center?: boolean;
  disabled?: boolean;
  inverted?: boolean;
  italic?: boolean;
  nowrap?: boolean;
  secondary?: boolean;
}

export type TextProps = SpaceSetProps &
  OpacityProps &
  LayoutSetProps &
  TextSetProps &
  TransformSetProps &
  TransitionProps &
  CustomTextProps;

const customProps = ({
  bold,
  center,
  disabled,
  inverted,
  italic,
  nowrap,
  secondary,
}: CustomTextProps): any => ({
  color: inverted ? th.colors.text.inv : undefined,
  fontStyle: italic ? 'italic' : undefined,
  fontWeight: bold ? 700 : undefined,
  opacity: disabled
    ? th.opacities.disabled
    : secondary
    ? th.opacities.secondary
    : 1,
  textAlign: center ? 'center' : undefined,
  whiteSpace: nowrap ? 'nowrap' : undefined,
});

export const textPropsSet = [
  divPropsSet,
  layoutSet,
  opacity,
  spaceSet,
  textSet,
  transformSet,
  transition,
  customProps,
];

const StyledText = styled.p<TextProps & any>(textPropsSet);
const textComponent = (type: keyof typeof th.textStyles = 'body') => ({
  children,
  ...rest
}: {
  children: React.ReactNode;
} & TextProps &
  React.HTMLAttributes<HTMLParagraphElement>) => (
  <StyledText {...th.textStyles.common} {...th.textStyles[type]} {...rest}>
    {children}
  </StyledText>
);
const SmallText = textComponent('small');
const CaptionText = textComponent('caption');
const BodyText = textComponent('body');
const LargeText = textComponent('large');
const DisplayText = textComponent('display');
const HugeText = textComponent('huge');

const TitleText = styled.h1<TextProps & any>(th.textStyles.title, textPropsSet);

export default {
  BodyText,
  CaptionText,
  DisplayText,
  HugeText,
  LargeText,
  SmallText,
  TitleText,
  Text,
};
