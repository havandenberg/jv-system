import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  borderSet,
  BorderSetProps,
  color,
  ColorProps,
  fontSize,
  FontSizeProps,
  fontWeight,
  FontWeightProps,
  height,
  HeightProps,
  spaceSet,
  SpaceSetProps,
  textSet,
  TextSetProps,
  width,
  WidthProps,
} from 'onno';

import HighlightImg from 'assets/images/highlight';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import { hexColorWithTransparency } from 'ui/utils';
import usePrevious from 'hooks/use-previous';

const CELL_HEIGHT = 28;

const Input = styled.input<{ dirty: boolean } & DivProps>(
  ({ dirty }: { dirty: boolean }) => ({
    background: hexColorWithTransparency(th.colors.white, 0.2),
    border: th.borders.secondary,
    fontWeight: dirty ? 'bold' : undefined,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm})`,
  }),
  borderSet,
  color,
  fontSize,
  fontWeight,
  height,
  spaceSet,
  textSet,
  width,
);

const Wrapper = styled(l.Flex)(
  ({
    highlight,
    showBorder,
    secondaryHighlight,
  }: {
    highlight?: boolean;
    showBorder?: boolean;
    secondaryHighlight?: boolean;
  }) => ({
    alignItems: 'center',
    background: highlight
      ? th.colors.cellHighlight
      : secondaryHighlight
      ? th.colors.brand.containerBackground
      : undefined,
    borderLeft: showBorder ? th.borders.disabled : undefined,
    height: CELL_HEIGHT,
    lineHeight: 1,
    position: 'relative',
    ':first-of-type': {
      borderLeft: 0,
    },
  }),
);

export interface CellContent {
  dirty: boolean;
  value: string;
}

interface Props {
  content: CellContent;
  defaultChildren: React.ReactNode;
  editing: boolean;
  handleHighlight?: () => void;
  highlight?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    BorderSetProps &
    ColorProps &
    SpaceSetProps &
    TextSetProps &
    FontSizeProps &
    FontWeightProps &
    HeightProps &
    WidthProps;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  showBorder?: boolean;
  secondaryHighlight?: boolean;
}

const EditableCell = ({
  content,
  defaultChildren,
  editing,
  handleHighlight,
  highlight,
  inputProps,
  onChange,
  showBorder = true,
  secondaryHighlight,
}: Props) => {
  const { dirty, value } = content;
  const previousValue = usePrevious(value);
  const [localValue, setLocalValue] = useState(value);

  const [showToggleHighlight, setShowToggleHighlight] = useState(false);

  const showHighlight =
    (localValue || highlight) &&
    editing &&
    handleHighlight &&
    showToggleHighlight;

  useEffect(() => {
    if (previousValue !== value) {
      setLocalValue(value);
    }
  }, [previousValue, value]);

  return (
    <Wrapper
      highlight={highlight}
      onMouseEnter={() => {
        setShowToggleHighlight(true);
      }}
      onMouseLeave={() => {
        setShowToggleHighlight(false);
      }}
      showBorder={!editing && showBorder}
      secondaryHighlight={secondaryHighlight}
    >
      {editing ? (
        <Input
          dirty={dirty || localValue !== value}
          type="text"
          onBlur={(e) => {
            if (localValue !== value) {
              onChange(e);
            }
          }}
          onChange={(e) => {
            setLocalValue(e.target.value);
          }}
          value={localValue}
          {...inputProps}
        />
      ) : (
        defaultChildren
      )}
      {showHighlight && (
        <l.HoverButton
          bg={th.colors.background}
          borderRadius={th.borderRadii.circle}
          onClick={handleHighlight}
          position="absolute"
          left={th.spacing.xs}
        >
          <HighlightImg
            fill={th.colors.brand.secondary}
            height={th.sizes.xs}
            width={th.sizes.xs}
          />
        </l.HoverButton>
      )}
    </Wrapper>
  );
};

export default EditableCell;
