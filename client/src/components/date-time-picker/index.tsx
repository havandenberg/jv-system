import React from 'react';
import styled from '@emotion/styled';
import ReactDateTimePicker from 'react-datetime-picker';

import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';

import './styles.css';

interface Props {
  dirty?: boolean;
  error?: boolean;
  warning?: boolean;
}

const Wrapper = styled(l.Div)<Props & DivProps>(
  ({ dirty, error, warning }) => ({
    border: error
      ? th.borders.error
      : warning
      ? th.borders.warning
      : th.borders.secondary,
    borderRadius: th.borderRadii.default,
    color: th.colors.text.default,
    fontSize: th.fontSizes.body,
    fontWeight: dirty ? 'bold' : undefined,
    input: {
      fontSize: th.fontSizes.body,
      color: th.colors.text.default,
    },
  }),
  divPropsSet,
);

const DateTimePicker = (props: Props & any) => (
  <Wrapper {...props}>
    <ReactDateTimePicker {...props} />
  </Wrapper>
);

export default DateTimePicker;
