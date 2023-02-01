import React, { InputHTMLAttributes, useRef, useState } from 'react';
import styled from '@emotion/styled';
import {
  borderSet,
  BorderSetProps,
  fontSize,
  FontSizeProps,
  fontWeight,
  FontWeightProps,
  maxWidth,
  MaxWidthProps,
  spaceSet,
  SpaceSetProps,
  width,
  WidthProps,
} from 'onno';

import CloseImg from 'assets/images/close';
import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';

import { hexColorWithTransparency } from './utils';

const INPUT_WIDTH = th.widths.input;
const ICON_WIDTH = 48;
const DEFAULT_PADDING = 16;
const CLEAR_WIDTH = 40;

const Wrapper = styled(l.Div)(
  ({
    hasError,
    hasValue,
    hasWarning,
    focused,
  }: {
    hasError?: boolean;
    hasValue?: boolean;
    hasWarning?: boolean;
    focused?: boolean;
  }) => ({
    background: th.colors.brand.containerBackground,
    border: hasError
      ? th.borders.error
      : hasWarning
      ? th.borders.warning
      : hasValue || focused
      ? th.borders.secondary
      : th.borders.disabled,
    borderRadius: th.borderRadii.input,
    boxShadow: th.shadows.boxLight,
    cursor: 'text',
    height: th.heights.input,
    position: 'relative',
    transition: th.transitions.default,
    width: INPUT_WIDTH,
    ':hover': {
      border: hasError
        ? th.borders.error
        : hasWarning
        ? th.borders.warning
        : th.borders.secondary,
    },
  }),
  width,
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

export const TextArea = styled.textarea<
  InputHTMLAttributes<HTMLTextAreaElement> &
    FontSizeProps &
    MaxWidthProps &
    SpaceSetProps &
    WidthProps & {
      isDirty?: boolean;
    }
>(
  ({ isDirty }) => ({
    background: th.colors.brand.containerBackground,
    border: th.borders.secondary,
    borderRadius: th.borderRadii.default,
    boxShadow: th.shadows.boxLight,
    color: th.colors.brand.primary,
    cursor: 'text',
    fontFamily: th.fontFamilies.body,
    fontSize: th.fontSizes.body,
    fontWeight: isDirty ? th.fontWeights.bold : undefined,
    outline: 'none',
    padding: th.spacing.sm,
    transition: th.transitions.default,
  }),
  fontSize,
  maxWidth,
  spaceSet,
  width,
);

const StyledTextInput = styled.input<
  InputHTMLAttributes<HTMLInputElement> &
    BorderSetProps &
    FontWeightProps &
    SpaceSetProps &
    WidthProps
>(
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
  borderSet,
  fontWeight,
  spaceSet,
  width,
);

export const SmallSelect = styled.select<
  InputHTMLAttributes<HTMLSelectElement> &
    FontSizeProps &
    DivProps & {
      dirty?: boolean;
      error?: boolean;
      warning?: boolean;
    }
>(
  ({ dirty, error, warning }) => ({
    background: hexColorWithTransparency(th.colors.white, 0.8),
    border: error
      ? th.borders.error
      : warning
      ? th.borders.warning
      : th.borders.secondary,
    borderRadius: th.borderRadii.input,
    color: th.colors.text.default,
    fontWeight: dirty ? 'bold' : undefined,
    height: th.heights.input,
    fontSize: th.fontSizes.body,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm})`,
  }),
  fontSize,
  divPropsSet,
);

export const Select = styled.select<
  InputHTMLAttributes<HTMLSelectElement> &
    SpaceSetProps &
    WidthProps & {
      hasValue?: boolean;
      focused?: boolean;
      hasError?: boolean;
      isDirty?: boolean;
    }
>(
  ({ hasError, hasValue, isDirty, focused }) => ({
    background: th.colors.brand.containerBackground,
    border: hasError
      ? th.borders.error
      : hasValue || focused
      ? th.borders.secondary
      : th.borders.disabled,
    borderRadius: th.borderRadii.input,
    boxShadow: th.shadows.boxLight,
    color: th.colors.text.default,
    cursor: 'pointer',
    fontSize: th.fontSizes.caption,
    fontWeight: isDirty ? 'bold' : undefined,
    height: 34,
    position: 'relative',
    outline: 'none',
    paddingLeft: th.spacing.sm,
    transition: th.transitions.default,
    width: 200,
    ':hover': {
      border: hasError ? th.borders.error : th.borders.secondary,
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
  }),
  spaceSet,
  width,
);

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  closeOnClear?: boolean;
  hasError?: boolean;
  hasWarning?: boolean;
  Icon?: React.ReactNode;
  isDirty?: boolean;
  onClear?: () => void;
}

const TextInput = ({
  closeOnClear,
  hasError,
  hasWarning,
  Icon,
  isDirty,
  onBlur,
  onClear,
  onFocus,
  value,
  width,
  ...rest
}: TextInputProps & BorderSetProps & SpaceSetProps & WidthProps) => {
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

  const handleClear = (e: React.MouseEvent<HTMLInputElement>) => {
    onClear && onClear();
    if (closeOnClear) {
      e.stopPropagation();
    } else {
      inputRef.current && inputRef.current.focus();
    }
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
    <Wrapper
      hasError={hasError}
      hasWarning={hasWarning}
      hasValue={!!value}
      focused={focused}
      width={width}
    >
      <IconWrapper left={0}>{Icon}</IconWrapper>
      <StyledTextInput
        fontWeight={isDirty ? 'bold' : undefined}
        pl={Icon ? ICON_WIDTH : DEFAULT_PADDING}
        pr={value && onClear ? CLEAR_WIDTH : DEFAULT_PADDING}
        ref={inputRef}
        onBlur={handleBlur}
        onFocus={handleFocus}
        type="text"
        value={value}
        width={
          width
            ? parseInt(`${width}`, 10) - (onClear ? 56 : CLEAR_WIDTH)
            : getInputWidth()
        }
        {...rest}
      />
      {onClear && value && (
        <ClearWrapper onClick={handleClear}>
          <CloseImg height={12} />
        </ClearWrapper>
      )}
    </Wrapper>
  );
};

export default TextInput;
