import React from 'react';
import styled from '@emotion/styled';
import Tooltip from 'react-tooltip';

import Chevron from 'assets/images/chevron';
import { BaseDataItemSelector, baseDataTransforms } from 'components/base-data';
import { LabelInfo } from 'components/column-label';
import EditableCell, { EditableCellProps } from 'components/editable-cell';
import Expandable from 'components/expandable';
import { BasicModal } from 'components/modal';
import { LineItemCheckbox } from 'ui/checkbox';
import l, { DivProps } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

const Wrapper = styled(l.Flex)({
  '& .show': {
    border: th.borders.disabled,
    opacity: '1 !important',
  },
});

export interface ListItemProps<T> {
  changes?: T;
  confirmRemove?: boolean;
  confirmRemoveText?: string;
  confirmRemoveTitle?: string;
  content?: React.ReactNode;
  customStyles?: {
    noCellBackground?: boolean;
    cellWrapper?: DivProps;
    wrapper?: DivProps;
  };
  data: T;
  defaultOpen?: boolean;
  editing?: boolean;
  error?: boolean;
  gridTemplateColumns: string;
  highlightColor?: string;
  hoverable?: boolean;
  index?: number;
  isHighlight?: boolean;
  isHalfHighlight?: boolean;
  isOpen?: boolean;
  listLabels: LabelInfo<T>[];
  handleChange?: (field: keyof T, value: any) => void;
  handleRemove?: () => void;
  handleToggleOpen?: () => void;
  offsetTop?: number;
  onClick?: () => void;
  onSelectItem?: () => void;
  rowKey?: string | number;
  selected?: boolean;
  showValidation?: boolean;
  to?: string;
}

const ListItem = <T extends {}>({
  changes,
  confirmRemove,
  confirmRemoveText,
  confirmRemoveTitle,
  content,
  customStyles,
  data,
  defaultOpen,
  editing,
  error,
  gridTemplateColumns,
  handleChange,
  handleRemove,
  highlightColor,
  hoverable,
  index,
  isHighlight,
  isHalfHighlight,
  isOpen: isOpenProp,
  listLabels,
  handleToggleOpen,
  offsetTop,
  onClick,
  onSelectItem,
  rowKey,
  selected,
  showValidation,
  to,
}: ListItemProps<T>) => {
  const clickable = !!onClick || !!to;

  const [isLocalOpen, setIsLocalOpen] = React.useState(!!defaultOpen);

  const isOpen = isOpenProp !== undefined ? isOpenProp : isLocalOpen;
  const setIsOpen = handleToggleOpen || setIsLocalOpen;

  const toggleIsOpen = () => setIsOpen(!isOpen);

  const header = (
    <l.Grid gridTemplateColumns={gridTemplateColumns}>
      {onSelectItem && (
        <l.Flex justifyStart centered height={th.sizes.fill}>
          <LineItemCheckbox
            checked={selected}
            onChange={onSelectItem}
            status="warning"
          />
        </l.Flex>
      )}
      {listLabels.map(
        (
          {
            allowClick,
            allowOverflow,
            dropdownOptions,
            editablCellProps,
            getValue,
            isBoolean,
            isColor,
            isDate,
            isNumber,
            isCurrency,
            itemSelectorQueryProps,
            key,
            readOnly,
            rowKey: itemRowKey,
            title,
            transformKey,
            transformValue,
            validate,
          },
          idx,
        ) => {
          const value = transformKey
            ? baseDataTransforms[transformKey](data[key])
            : transformValue
            ? transformValue(data[key])
            : getValue
            ? getValue(data)
            : data[key];
          const localRowKey = itemRowKey ? itemRowKey(data) : rowKey;
          const keyIndex = `${String(key)}-${idx}-${localRowKey}`;

          const content = changes
            ? {
                dirty: changes[key] !== data[key],
                value: `${
                  changes[key] === undefined
                    ? data[key] || ''
                    : changes[key] || ''
                }`,
              }
            : { dirty: false, value: `${data[key]}` };
          const isValid = !validate || validate(changes || data);
          const isEditing = !!editing && !readOnly;

          const cellInputProps = {
            borderRadius: th.borderRadii.default,
            height: th.sizes.icon,
            fontSize: th.fontSizes.body,
            padding: th.spacing.xs,
            width: th.sizes.fill,
          };

          const selectInputProps = {
            borderRadius: th.borderRadii.default,
            fontSize: th.fontSizes.body,
            padding: th.spacing.xs,
            width: th.sizes.fill,
          };

          const editableCellProps: EditableCellProps = {
            bypassLocalValue: !!itemSelectorQueryProps,
            content,
            defaultChildren: getValue ? (
              getValue(data)
            ) : (
              <ty.BodyText>{value}</ty.BodyText>
            ),
            dropdownOptions,
            editing: isEditing,
            error: showValidation && !isValid,
            height: 'auto',
            inputProps: cellInputProps,
            selectProps: selectInputProps,
            isBoolean,
            isColor,
            isDate,
            isNumber,
            isCurrency,
            onChange: (e) => {
              handleChange &&
                handleChange(
                  key,
                  isBoolean ? e.target.checked : e.target.value,
                );
            },
            title: data && title ? title(data) : undefined,
            ...editablCellProps,
          };

          return (
            <Wrapper
              alignCenter
              key={keyIndex}
              overflow={allowOverflow ? 'visible' : 'hidden'}
              px={th.spacing.sm}
              py={th.spacing.xs}
              title={data && title ? title(data) : undefined}
            >
              {editing ? (
                itemSelectorQueryProps ? (
                  <BaseDataItemSelector<T>
                    {...itemSelectorQueryProps}
                    editableCellProps={editableCellProps}
                    editing={isEditing}
                    handleChange={handleChange}
                    labelKey={key}
                    value={content.value}
                  />
                ) : (
                  <EditableCell {...editableCellProps} />
                )
              ) : (
                <l.Div data-tip data-for={keyIndex} width={th.sizes.fill}>
                  <ty.BodyText
                    nowrap
                    onClick={(e: React.MouseEvent) => {
                      !content &&
                        (!onClick || !allowClick) &&
                        e.stopPropagation();
                    }}
                    width={th.sizes.fill}
                  >
                    {value || '-'}
                  </ty.BodyText>
                </l.Div>
              )}
              {localRowKey && (
                <Tooltip
                  id={keyIndex}
                  backgroundColor={th.colors.background}
                  effect="solid"
                  offset={{ top: offsetTop ? -offsetTop : 0 }}
                  place={index === 0 ? 'bottom' : 'top'}
                  type="light"
                >
                  <l.Div
                    pb={index === 0 ? undefined : th.spacing.xs}
                    pt={index === 0 ? th.spacing.xs : undefined}
                  >
                    {value || '-'}
                  </l.Div>
                </Tooltip>
              )}
            </Wrapper>
          );
        },
      )}
      {clickable && (
        <l.Flex centered height={th.sizes.fill}>
          <Chevron height={th.spacing.md} />
        </l.Flex>
      )}
    </l.Grid>
  );

  const components = (
    <l.Cell
      clickable={clickable || !!content}
      error={error}
      hoverable={hoverable}
      highlightColor={highlightColor}
      isHighlight={isHighlight}
      isHalfHighlight={isHalfHighlight}
      selected={selected}
      noCellBackground={customStyles?.noCellBackground}
      {...(customStyles?.cellWrapper || {})}
    >
      {content && !editing ? (
        <Expandable
          header={header}
          content={content}
          hideToggle={isOpenProp !== undefined && !handleToggleOpen}
          isOpen={isOpen}
          toggleIsOpen={toggleIsOpen}
        />
      ) : (
        header
      )}
    </l.Cell>
  );

  return (
    <l.Flex
      mb={th.spacing.sm}
      width={th.sizes.fill}
      {...(customStyles?.wrapper || {})}
    >
      {editing && handleRemove && (
        <BasicModal
          title={confirmRemoveTitle || 'Confirm Remove'}
          content={
            <ty.BodyText>
              {confirmRemoveText ||
                'Are you sure you want to remove this item?'}
            </ty.BodyText>
          }
          confirmText="Remove"
          shouldConfirm={confirmRemove}
          handleConfirm={handleRemove}
          triggerType="remove-icon"
          triggerProps={{ mr: th.spacing.sm }}
        />
      )}
      {onClick || !to ? (
        <l.Div onClick={onClick} width={th.sizes.fill}>
          {components}
        </l.Div>
      ) : (
        <l.AreaLink to={to ? to : '#'} width={th.sizes.fill}>
          {components}
        </l.AreaLink>
      )}
    </l.Flex>
  );
};

export default ListItem;
