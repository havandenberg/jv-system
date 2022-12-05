import React from 'react';
import styled from '@emotion/styled';
import { positionSet } from 'onno-react';

import CheckImg from 'assets/images/check';
import CrossImg from 'assets/images/cross';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { hexColorWithTransparency } from './utils';

const Input = styled.input(
  {
    cursor: 'pointer',
  },
  positionSet,
);

const Label = styled.label({
  cursor: 'pointer',
});

interface Props {
  checked?: boolean;
  crossed?: boolean;
  disabled?: boolean;
  label?: React.ReactNode;
  onChange: () => void;
  status?: keyof typeof th.colors.status;
}

export const FilterCheckbox = ({ checked, label, onChange }: Props) => (
  <l.Flex cursor="pointer" key={`${label}`}>
    <Input
      checked={!!checked}
      id={`${label}`}
      onChange={onChange}
      type="checkbox"
    />
    {label && (
      <ty.CaptionText ml={th.spacing.xs}>
        <Label htmlFor={`${label}`}>{label}</Label>
      </ty.CaptionText>
    )}
  </l.Flex>
);

const Wrapper = styled(l.Flex)(
  ({
    checked,
    crossed,
    disabled,
    status = 'success',
  }: {
    checked?: boolean;
    crossed?: boolean;
    disabled?: boolean;
    status?: keyof typeof th.colors.status;
  }) => ({
    alignItems: 'center',
    background: checked
      ? hexColorWithTransparency(
          th.colors.status[status],
          th.opacities.disabled,
        )
      : crossed
      ? hexColorWithTransparency(th.colors.status.error, th.opacities.disabled)
      : th.colors.background,
    border: th.borders.primary,
    borderRadius: th.borderRadii.default,
    height: th.sizes.xs,
    justifyContent: 'center',
    position: 'relative',
    transition: th.transitions.default,
    width: th.sizes.xs,
    ':hover': {
      background: disabled
        ? undefined
        : checked
        ? hexColorWithTransparency(th.colors.status[status], 0.3)
        : crossed
        ? hexColorWithTransparency(th.colors.status.error, 0.3)
        : th.colors.background,
    },
  }),
);

export const LineItemCheckbox = ({
  checked,
  crossed,
  disabled,
  label,
  onChange,
  status,
}: Props) => (
  <l.Flex
    alignCenter
    cursor={disabled ? 'default' : 'pointer'}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      !disabled && onChange();
    }}
  >
    <Wrapper
      checked={checked}
      crossed={crossed}
      disabled={disabled}
      status={status}
    >
      {checked ? (
        <CheckImg height={10} width={10} />
      ) : (
        crossed && <CrossImg height={10} width={10} />
      )}
    </Wrapper>
    {label}
  </l.Flex>
);
