import React from 'react';
import styled from '@emotion/styled';

import Add from 'assets/images/add';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Flex)(({ disabled }: { disabled?: boolean }) => ({
  alignItems: 'center',
  cursor: disabled ? 'default' : 'pointer',
  margin: `${th.spacing.sm} 0`,
  opacity: disabled ? th.opacities.disabled : th.opacities.secondary,
  transition: th.transitions.default,
  ':hover': {
    opacity: disabled ? th.opacities.disabled : 1,
  },
}));

interface Props {
  disabled?: boolean;
  onClick?: () => void;
  text: string;
}

const AddItem = ({ disabled, onClick, text }: Props) => (
  <Wrapper disabled={disabled} onClick={disabled ? undefined : onClick}>
    <Add
      height={th.sizes.xs}
      fill={th.colors.status.success}
      width={th.sizes.xs}
    />
    <ty.CaptionText ml={th.spacing.sm} secondary>
      {text}
    </ty.CaptionText>
  </Wrapper>
);

export default AddItem;
