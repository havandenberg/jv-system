import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { TextSetProps } from 'onno';

import HighlightImg from 'assets/images/highlight';
import usePrevious from 'hooks/use-previous';
import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import { TextProps, textPropsSet } from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

export const EDITABLE_CELL_HEIGHT = 28;

export const Input = styled.input<
  { dirty: boolean; editing: boolean; error?: boolean } & DivProps &
    TextSetProps
>(
  ({ dirty, editing, error }) => ({
    background: hexColorWithTransparency(th.colors.white, 0.8),
    border: error ? th.borders.error : th.borders.secondary,
    cursor: editing ? 'text' : 'default',
    fontWeight: dirty ? 'bold' : undefined,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm})`,
  }),
  divPropsSet,
  textPropsSet,
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
    height: EDITABLE_CELL_HEIGHT,
    lineHeight: 1,
    position: 'relative',
    ':first-of-type': {
      borderLeft: 0,
    },
  }),
);

export interface CellContent {
  dirty: boolean;
  value: string | boolean;
}

export interface EditableCellProps {
  content: CellContent;
  defaultChildren: React.ReactNode;
  editing: boolean;
  error?: boolean;
  handleHighlight?: () => void;
  highlight?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    DivProps &
    TextProps;
  isBoolean?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  showBorder?: boolean;
  secondaryHighlight?: boolean;
}

const EditableCell = ({
  content,
  defaultChildren,
  editing,
  error,
  handleHighlight,
  highlight,
  inputProps,
  isBoolean,
  onChange,
  showBorder = true,
  secondaryHighlight,
}: EditableCellProps) => {
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
          checked={Boolean(localValue)}
          editing
          error={error}
          type={isBoolean ? 'checkbox' : 'text'}
          onBlur={(e) => {
            if (localValue !== value) {
              onChange(e);
            }
          }}
          onChange={(e) => {
            setLocalValue(isBoolean ? e.target.checked : e.target.value);
          }}
          value={`${localValue}`}
          textAlign="left"
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
