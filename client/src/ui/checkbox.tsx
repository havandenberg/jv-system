import React from 'react';
import styled from '@emotion/styled';
import { positionSet } from 'onno-react';

import CheckImg from 'assets/images/check';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

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
  disabled?: boolean;
  label?: React.ReactNode;
  onChange: () => void;
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

const Wrapper = styled(l.Flex)(({ disabled }: { disabled?: boolean }) => ({
  alignItems: 'center',
  border: th.borders.primary,
  borderRadius: th.borderRadii.default,
  height: th.sizes.xs,
  justifyContent: 'center',
  position: 'relative',
  transition: th.transitions.default,
  width: th.sizes.xs,
  ':hover': {
    background: disabled ? undefined : th.colors.background,
  },
}));

export const LineItemCheckbox = ({
  checked,
  disabled,
  label,
  onChange,
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
    <Wrapper disabled={disabled}>
      {checked && <CheckImg height={10} width={10} />}
    </Wrapper>
    {label}
  </l.Flex>
);
