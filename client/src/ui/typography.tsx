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
  textShadow,
  TextShadowProps,
  transformSet,
  TransformSetProps,
  transition,
  TransitionProps,
} from 'onno-react';
import { Link as RouterLink } from 'react-router-dom';

import { divPropsSet } from './layout';
import th from './theme';

interface CustomTextProps {
  bold?: boolean;
  center?: boolean;
  disabled?: boolean;
  inverted?: boolean;
  italic?: boolean;
  link?: boolean;
  nowrap?: boolean;
  secondary?: boolean;
}

export type TextProps = SpaceSetProps &
  OpacityProps &
  LayoutSetProps &
  TextSetProps &
  TextShadowProps &
  TransformSetProps &
  TransitionProps &
  CustomTextProps &
  any;

const customProps = ({
  bold,
  center,
  disabled,
  inverted,
  italic,
  link,
  nowrap,
  secondary,
}: CustomTextProps): any => ({
  color: inverted ? th.colors.text.inv : undefined,
  cursor: link ? 'pointer' : undefined,
  fontStyle: italic ? 'italic' : undefined,
  fontWeight: bold ? 700 : undefined,
  opacity: disabled
    ? th.opacities.disabled
    : secondary || link
    ? th.opacities.secondary
    : 1,
  textAlign: center ? 'center' : undefined,
  whiteSpace: nowrap ? 'nowrap' : undefined,
  ':hover': {
    opacity: link ? 1 : undefined,
  },
});

export const textPropsSet = [
  divPropsSet,
  layoutSet,
  opacity,
  spaceSet,
  textSet,
  textShadow,
  transformSet,
  transition,
  customProps,
];

const StyledText = styled.p<TextProps>(textPropsSet);
const textComponent =
  (type: keyof typeof th.textStyles = 'body') =>
  ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
  } & TextProps &
    React.HTMLAttributes<HTMLParagraphElement>) =>
    (
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

const TitleText = styled.h1<TextProps>(th.textStyles.title, textPropsSet);

const Span = styled.span<TextProps>(textPropsSet);

const LinkText = styled(RouterLink)<TextProps>(
  ({ hover = 'true' }: { hover?: string }) => ({
    cursor: 'pointer',
    textDecoration: hover === 'true' ? 'none' : 'underline',
    ':hover': {
      color: th.colors.brand.primaryAccent,
      textDecoration: 'underline',
      ':visited': {
        color: th.colors.brand.primaryAccent,
      },
      ':link': {
        color: th.colors.brand.primaryAccent,
      },
    },
    ':link': {
      color:
        hover === 'true'
          ? th.colors.brand.primary
          : th.colors.brand.primaryAccent,
    },
    ':visited': {
      color:
        hover === 'true'
          ? th.colors.brand.primary
          : th.colors.brand.primaryAccent,
    },
  }),
  textPropsSet,
);

const TriggerText = styled(BodyText)({
  cursor: 'pointer',
  ':hover': {
    color: th.colors.brand.primaryAccent,
    textDecoration: 'underline',
  },
});

export default {
  BodyText,
  CaptionText,
  DisplayText,
  HugeText,
  LargeText,
  LinkText,
  SmallText,
  Span,
  TitleText,
  Text,
  TriggerText,
};
