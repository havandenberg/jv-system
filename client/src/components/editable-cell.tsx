import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { TextSetProps } from 'onno';

import HighlightImg from 'assets/images/highlight';
import DateTimePicker from 'components/date-time-picker';
import useDebounce from 'hooks/use-debounce';
import usePrevious from 'hooks/use-previous';
import { SmallSelect } from 'ui/input';
import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import { TextProps, textPropsSet } from 'ui/typography';
import { hexColorWithTransparency } from 'ui/utils';

import ColorPicker from './color-picker';
import { formatDate } from './date-range-picker';

export const EDITABLE_CELL_HEIGHT = 28;

export const Input = styled.input<
  {
    dirty: boolean;
    editing: boolean;
    error?: boolean;
    warning?: boolean;
  } & DivProps &
    TextSetProps
>(
  ({ dirty, editing, error, warning }) => ({
    background: hexColorWithTransparency(th.colors.white, 0.8),
    border: error
      ? th.borders.error
      : warning
      ? th.borders.warning
      : th.borders.secondary,
    color: th.colors.text.default,
    cursor: editing ? undefined : 'default',
    fontWeight: dirty ? 'bold' : undefined,
    width: `calc(${th.sizes.fill} - ${th.spacing.sm})`,
  }),
  divPropsSet,
  textPropsSet,
);

const Wrapper = styled(l.Flex)(
  ({
    highlight,
    highlightColor,
    showBorder,
    secondaryHighlight,
  }: {
    highlight?: boolean;
    highlightColor?: string;
    showBorder?: boolean;
    secondaryHighlight?: boolean;
  }) => ({
    alignItems: 'center',
    background: highlight
      ? highlightColor || th.colors.cellHighlight
      : secondaryHighlight
      ? th.colors.brand.containerBackground
      : undefined,
    borderLeft: showBorder ? th.borders.disabled : undefined,
    lineHeight: 1,
    width: th.sizes.fill,
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
  bypassLocalValue?: boolean;
  content: CellContent;
  defaultChildren: React.ReactNode;
  debounce?: number;
  dropdownOptions?: {
    content?: React.ReactNode;
    value: string;
  }[];
  editing: boolean;
  error?: boolean;
  handleHighlight?: () => void;
  highlight?: boolean;
  highlightColor?: string;
  height?: string | number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement> &
    DivProps &
    TextProps;
  selectProps?: React.InputHTMLAttributes<HTMLSelectElement> &
    DivProps &
    TextProps;
  isBoolean?: boolean;
  isColor?: boolean;
  isDate?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  showBorder?: boolean;
  secondaryHighlight?: boolean;
  warning?: boolean;
}

const EditableCell = ({
  bypassLocalValue,
  content,
  debounce,
  defaultChildren,
  dropdownOptions,
  editing,
  error,
  handleHighlight,
  height = EDITABLE_CELL_HEIGHT,
  highlight,
  highlightColor,
  inputProps,
  selectProps,
  isBoolean,
  isColor,
  isDate,
  onChange,
  showBorder = true,
  secondaryHighlight,
  warning,
}: EditableCellProps) => {
  const { dirty, value } = content;
  const previousValue = usePrevious(value);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const [localState, setLocalState] = useState({
    cursor: 0,
    value: value === 'null' ? '' : value,
  });
  const localValue = localState.value;
  const cursorLocation = localState.cursor;

  const [showToggleHighlight, setShowToggleHighlight] = useState(false);

  const showHighlight =
    (localValue || highlight) &&
    editing &&
    handleHighlight &&
    showToggleHighlight;

  const debouncedLocalValue = useDebounce(localValue, debounce || 500);
  const previousDebouncedLocalValue = usePrevious(debouncedLocalValue);

  const dateTimePickerProps = {
    calendarIcon: null,
    clearIcon: null,
    disableClock: true,
    locale: 'en-US',
    format: 'y-MM-dd',
    dirty,
    error,
    warning,
  };

  useEffect(() => {
    if (previousValue !== value) {
      setLocalState({ ...localState, value });
    }
  }, [localState, previousValue, value]);

  useEffect(() => {
    const input = inputRef.current;
    if (input && input.type === 'text') {
      input.setSelectionRange(cursorLocation, cursorLocation);
    }
  }, [inputRef, cursorLocation, localValue]);

  useEffect(() => {
    if (
      debounce &&
      previousDebouncedLocalValue &&
      previousDebouncedLocalValue !== debouncedLocalValue
    ) {
      onChange({
        target: { value: debouncedLocalValue },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [debounce, debouncedLocalValue, onChange, previousDebouncedLocalValue]);

  return (
    <Wrapper
      height={height}
      highlight={highlight}
      highlightColor={highlightColor}
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
        isColor ? (
          <ColorPicker
            activeColor={`${localValue}`}
            color={`${localValue}`}
            onChange={(newColor) => {
              onChange({
                target: {
                  value: newColor,
                },
              } as any);
            }}
          />
        ) : isDate ? (
          <DateTimePicker
            onChange={(date: Date) =>
              onChange({
                target: {
                  value: formatDate(date),
                },
              } as any)
            }
            value={
              localValue ? new Date(`${localValue}`.replace(/-/g, '/')) : null
            }
            {...dateTimePickerProps}
          />
        ) : dropdownOptions ? (
          <SmallSelect
            error={error}
            onChange={(e) => {
              onChange({ target: { value: e.target.value } } as any);
            }}
            value={`${localValue}`}
            {...selectProps}
          >
            {dropdownOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.content || option.value}
              </option>
            ))}
          </SmallSelect>
        ) : (
          <Input
            dirty={dirty || localValue !== value}
            checked={Boolean(localValue)}
            editing
            error={error}
            ref={inputRef}
            title={`${localValue}`}
            type={isBoolean ? 'checkbox' : 'text'}
            onBlur={(e) => {
              if (localValue !== value) {
                onChange(e);
              }
            }}
            onChange={(e) => {
              if (bypassLocalValue) {
                onChange(e);
              }
              setLocalState({
                cursor: e.target.selectionStart || 0,
                value: isBoolean ? e.target.checked : e.target.value,
              });
            }}
            value={localValue || ''}
            textAlign="left"
            warning={warning}
            {...inputProps}
          />
        )
      ) : (
        defaultChildren
      )}
      {showHighlight && (
        <l.HoverButton
          bg={th.colors.background}
          borderRadius={th.borderRadii.circle}
          onClick={(e) => {
            e.stopPropagation();
            handleHighlight && handleHighlight();
          }}
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
