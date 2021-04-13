import React, { useState } from 'react';
import styled from '@emotion/styled';
import { HexColorPicker } from 'react-colorful';

import useOutsideClickRef from 'hooks/use-outside-click-ref';
import l from 'ui/layout';
import th from 'ui/theme';

const Content = styled(l.Div)({
  background: th.colors.background,
  borderRadius: th.borderRadii.default,
  boxShadow: th.shadows.box,
  padding: th.spacing.sm,
  position: 'absolute',
  left: th.sizes.fill,
  zIndex: 10,
});

interface Props {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker = ({ color, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClickRef(() => {
    setIsOpen(false);
  });
  return (
    <l.Div relative ref={ref}>
      <l.Div
        bg={color}
        border={th.borders.secondary}
        borderRadius={th.borderRadii.circle}
        cursor="pointer"
        height={th.sizes.xs}
        onClick={() => setIsOpen(!isOpen)}
        width={th.sizes.xs}
      />
      {isOpen && (
        <Content>
          <HexColorPicker color={color} onChange={onChange} />
        </Content>
      )}
    </l.Div>
  );
};

export default ColorPicker;
