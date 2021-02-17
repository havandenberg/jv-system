import React, { InputHTMLAttributes, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { spaceSet, width } from 'onno-react';

import CloseImg from 'assets/images/close';
import l from 'ui/layout';
import th from 'ui/theme';

const INPUT_WIDTH = th.widths.input;
const ICON_WIDTH = 48;
const DEFAULT_PADDING = 16;
const CLEAR_WIDTH = 40;

const Wrapper = styled(l.Div)(
  ({ hasValue, focused }: { hasValue?: boolean; focused?: boolean }) => ({
    background: th.colors.brand.containerBackground,
    border: hasValue || focused ? th.borders.secondary : th.borders.disabled,
    borderRadius: th.borderRadii.input,
    cursor: 'text',
    height: th.heights.input,
    position: 'relative',
    transition: th.transitions.default,
    width: INPUT_WIDTH,
    ':hover': {
      border: th.borders.secondary,
    },
  }),
);

export const IconWrapper = styled(l.Flex)({
  alignItems: 'center',
  height: th.sizes.fill,
  justifyContent: 'center',
  position: 'absolute',
  top: 0,
  width: ICON_WIDTH,
});

export const ClearWrapper = styled(IconWrapper)({
  cursor: 'pointer',
  opacity: 0.8,
  right: 0,
  transition: th.transitions.default,
  width: CLEAR_WIDTH,
  ':hover': {
    opacity: 1,
  },
});

const StyledTextInput = styled.input(
  {
    background: 'transparent',
    border: 0,
    borderRadius: th.borderRadii.input,
    color: th.colors.text.default,
    fontFamily: th.fontFamilies.body,
    fontSize: th.fontSizes.body,
    height: th.sizes.fill,
    left: 0,
    outline: 'none',
    position: 'absolute',
    top: 0,
    transition: th.transitions.default,
    ':hover': {
      '::placeholder': {
        color: th.colors.brand.secondary,
      },
    },
    '::placeholder': {
      color: th.colors.brand.disabled,
      transition: th.transitions.default,
    },
    ':focus': {
      '::placeholder': {
        color: th.colors.brand.secondary,
      },
    },
  },
  spaceSet,
  width,
);

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  Icon?: React.ReactNode;
  onClear: () => void;
}

const TextInput = ({
  Icon,
  onBlur,
  onClear,
  onFocus,
  value,
  ...rest
}: TextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  const getInputWidth = () => {
    if (Icon && value) {
      return INPUT_WIDTH - ICON_WIDTH - CLEAR_WIDTH;
    } else if (Icon) {
      return INPUT_WIDTH - ICON_WIDTH - DEFAULT_PADDING;
    } else if (value) {
      return INPUT_WIDTH - CLEAR_WIDTH - DEFAULT_PADDING;
    } else {
      return INPUT_WIDTH - 2 * DEFAULT_PADDING;
    }
  };

  const handleClear = () => {
    onClear();
    inputRef.current && inputRef.current.focus();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus && onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur && onBlur(e);
  };

  return (
    <Wrapper hasValue={!!value} focused={focused}>
      <IconWrapper left={0}>{Icon}</IconWrapper>
      <StyledTextInput
        pl={Icon ? ICON_WIDTH : DEFAULT_PADDING}
        pr={value ? CLEAR_WIDTH : DEFAULT_PADDING}
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        type="text"
        value={value}
        width={getInputWidth()}
        {...rest}
      />
      {value && (
        <ClearWrapper onClick={handleClear}>
          <CloseImg height={12} />
        </ClearWrapper>
      )}
    </Wrapper>
  );
};

export default TextInput;
