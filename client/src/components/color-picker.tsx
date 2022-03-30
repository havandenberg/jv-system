import React, { useState } from 'react';
import styled from '@emotion/styled';

import useOutsideClickRef from 'hooks/use-outside-click-ref';
import l from 'ui/layout';
import th from 'ui/theme';
import { defaultColorSet } from 'ui/utils';

const Content = styled(l.Grid)({
  background: th.colors.background,
  borderRadius: th.borderRadii.default,
  boxShadow: th.shadows.box,
  columnGap: th.spacing.xs,
  gridTemplateRows: 'repeat(3, 1fr)',
  gridAutoFlow: 'column',
  padding: th.spacing.sm,
  position: 'absolute',
  rowGap: th.spacing.xs,
  left: th.sizes.fill,
  zIndex: 10,
});

const ColorSwatch = styled(l.Div)(
  ({ color, isActive }: { color: string; isActive: boolean }) => ({
    background: color,
    borderRadius: th.borderRadii.default,
    border: isActive ? th.borders.primaryAccent : th.borders.transparent,
    cursor: 'pointer',
    height: th.sizes.xs,
    width: th.sizes.xs,
  }),
);

interface Props {
  activeColor: string;
  color?: string;
  onChange: (color: string) => void;
  readOnly?: boolean;
}

const ColorPicker = ({
  activeColor,
  color = th.colors.brand.secondary,
  onChange,
  readOnly,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useOutsideClickRef(() => {
    setIsOpen(false);
  });
  return (
    <l.Div relative ref={ref}>
      <l.Div
        bg={activeColor}
        border={th.borders.secondary}
        borderColor={color}
        borderRadius={th.borderRadii.circle}
        cursor={readOnly ? undefined : 'pointer'}
        height={th.sizes.xs}
        onClick={() => !readOnly && setIsOpen(!isOpen)}
        width={th.sizes.xs}
      />
      {isOpen && (
        <Content>
          {defaultColorSet.map((c, idx) => (
            <ColorSwatch
              color={c}
              isActive={activeColor === c}
              key={idx}
              onClick={() => {
                onChange(c);
                setIsOpen(false);
              }}
            />
          ))}
        </Content>
      )}
    </l.Div>
  );
};

export default ColorPicker;
