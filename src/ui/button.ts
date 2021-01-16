import styled from '@emotion/styled';

import { divPropsSet, DivProps } from './layout';
import { textPropsSet, TextProps } from './typography';
import th from './theme';

const defaultStyles = {
  background: 'transparent',
  border: 0,
  borderRadius: th.borderRadii.input,
  cursor: 'pointer',
  margin: 0,
  padding: 0,
};

export const Default = styled.button<DivProps & TextProps>(
  defaultStyles,
  divPropsSet,
  textPropsSet,
);

const primaryStyles = {
  ...defaultStyles,
  background: th.colors.brand.primary,
  border: th.borders.primary,
  color: th.colors.white,
  fontSize: th.fontSizes.body,
  letterSpacing: '0.53px',
  padding: th.spacing.md,
};

const Primary = styled.button<DivProps & TextProps>(
  primaryStyles,
  divPropsSet,
  textPropsSet,
);

export default {
  Default,
  Primary,
};
