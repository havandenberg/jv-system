import React from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Input = styled.input({
  cursor: 'pointer',
});

const Label = styled.label({
  cursor: 'pointer',
});

interface Props {
  checked: boolean;
  label: string;
  onChange: () => void;
}

const Checkbox = ({ checked, label, onChange }: Props) => (
  <l.Flex cursor="pointer" key={label} mb={th.spacing.sm}>
    <Input checked={checked} id={label} onChange={onChange} type="checkbox" />
    <ty.CaptionText ml={th.spacing.xs}>
      <Label htmlFor={label}>{label}</Label>
    </ty.CaptionText>
  </l.Flex>
);

export default Checkbox;
