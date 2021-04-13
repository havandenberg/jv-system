import React from 'react';
import styled from '@emotion/styled';
import {
  color,
  ColorProps,
  fontWeight,
  FontWeightProps,
  spaceSet,
  SpaceSetProps,
  textSet,
  TextSetProps,
  width,
  WidthProps,
} from 'onno';

import l from 'ui/layout';
import th from 'ui/theme';
import { hexColorWithTransparency } from 'ui/utils';

const CELL_HEIGHT = th.sizes.sm;

const Input = styled.input(
  {
    background: hexColorWithTransparency(th.colors.white, 0.2),
    border: th.borders.secondary,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm})`,
  },
  color,
  fontWeight,
  spaceSet,
  textSet,
  width,
);

interface Props {
  defaultChildren: React.ReactNode;
  editing: boolean;
  highlight?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    ColorProps &
    SpaceSetProps &
    TextSetProps &
    FontWeightProps &
    WidthProps;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
}

const EditableCell = ({
  defaultChildren,
  editing,
  highlight,
  inputProps,
  onChange,
  value,
}: Props) => (
  <l.Flex
    alignCenter
    bg={highlight ? th.colors.brand.containerBackground : undefined}
    height={CELL_HEIGHT}
  >
    {editing ? (
      <Input type="text" onChange={onChange} value={value} {...inputProps} />
    ) : (
      defaultChildren
    )}
  </l.Flex>
);

export default EditableCell;
