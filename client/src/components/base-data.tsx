import React from 'react';
import { OperationVariables, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { pathOr } from 'ramda';

import { getSearchArray } from 'api/utils';
import { LabelInfo } from 'components/column-label';
import { Query } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatPhoneNumber } from 'utils/format';

import EditableCell, { EditableCellProps } from './editable-cell';
import useItemSelector from './item-selector';

export const baseDataTransforms = {
  link: (val: any) =>
    val ? (
      <l.Anchor href={val} target="_blank">
        {val}
      </l.Anchor>
    ) : null,
  phone: (val: any) =>
    val && formatPhoneNumber(val) ? (
      <l.Anchor href={`tel:${val}`}>{formatPhoneNumber(val)}</l.Anchor>
    ) : null,
  email: (val: any) =>
    val ? <l.Anchor href={`mailto:${val}`}>{val}</l.Anchor> : null,
};

export interface BaseDataItemSelectorProps {
  errorLabel: string;
  getItemContent?: (item: any) => React.ReactNode;
  height?: number;
  nameKey?: string;
  offset?: string | number;
  query: any;
  queryName: string;
  queryVariables?: OperationVariables;
  width?: number;
}

const BaseDataItemSelector = <T extends {}>({
  editableCellProps,
  editing,
  errorLabel,
  getItemContent,
  handleChange,
  height = 150,
  labelKey,
  nameKey = '',
  offset,
  query,
  queryName,
  queryVariables,
  value,
  width = 250,
}: BaseDataItemSelectorProps & {
  editableCellProps: EditableCellProps;
  editing: boolean;
  handleChange?: (field: keyof T, value: any) => void;
  labelKey: keyof T;
  value: string;
}) => {
  const { data: itemSelectorData, loading } = useQuery<Query>(query, {
    variables: {
      search: getSearchArray(value) || '',
      ...queryVariables,
    },
  });
  const allItems = () => pathOr([], [queryName, 'nodes'], itemSelectorData);

  const { ItemSelector } = useItemSelector({
    allItems,
    closeOnSelect: true,
    disabled: !editing,
    editableCellProps,
    errorLabel,
    getItemContent,
    height,
    loading,
    nameKey,
    offset,
    panelGap: 2,
    selectItem: (item: any) => {
      handleChange && handleChange(labelKey, item[nameKey || 'id']);
    },
    width,
  });

  return ItemSelector;
};

interface BaseDataProps<T> {
  data: T;
  changes?: T;
  editing?: boolean;
  handleChange?: (field: keyof T, value: any) => void;
  labels: LabelInfo<T>[];
  showValidation?: boolean;
}

const BaseDataItem = <T extends {}>({
  data,
  changes,
  editing,
  handleChange,
  label: {
    dropdownOptions,
    key,
    getValue,
    label,
    isBoolean,
    isColor,
    isDate,
    itemSelectorQueryProps,
    readOnly,
    transformKey,
    transformValue,
    validate,
  },
  showValidation,
}: Omit<BaseDataProps<T>, 'labels'> & {
  label: LabelInfo<T>;
}) => {
  const content = changes
    ? {
        dirty: changes[key] !== data[key],
        value: `${
          changes[key] === undefined ? data[key] || '' : changes[key] || ''
        }`,
      }
    : { dirty: false, value: `${data[key]}` };
  const isValid = !validate || validate(changes || data);
  const value =
    (transformKey
      ? baseDataTransforms[transformKey](data[key])
      : transformValue
      ? transformValue(data[key])
      : data[key]) || '-';
  const isEditing = !!editing && !readOnly;

  const cellInputProps = {
    borderRadius: th.borderRadii.default,
    height: th.sizes.icon,
    fontSize: th.fontSizes.body,
    padding: th.spacing.xs,
    width: 175,
  };

  const selectInputProps = {
    borderRadius: th.borderRadii.default,
    fontSize: th.fontSizes.body,
    padding: th.spacing.xs,
    width: 175,
  };

  const editableCellProps: EditableCellProps = {
    bypassLocalValue: true,
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
    onChange: (e) => {
      handleChange &&
        handleChange(key, isBoolean ? e.target.checked : e.target.value);
    },
  };

  return (
    <l.Div
      height={th.sizes.fill}
      pb={th.spacing.md}
      pr={th.spacing.sm}
      pt={th.spacing.sm}
    >
      <ty.CaptionText mb={th.spacing.sm} secondary>
        {label}
      </ty.CaptionText>
      {itemSelectorQueryProps ? (
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
      )}
    </l.Div>
  );
};

const BaseDataContainer = styled(l.Grid)({
  background: th.colors.brand.containerBackground,
  border: th.borders.secondary,
  borderRadius: th.borderRadii.default,
  gridTemplateColumns: 'repeat(5, 1fr)',
  paddingBottom: th.spacing.sm,
  paddingLeft: th.spacing.md,
  paddingRight: th.spacing.sm,
  paddingTop: th.spacing.sm,
});

const BaseData = <T extends {}>({ labels, ...rest }: BaseDataProps<T>) => (
  <BaseDataContainer>
    {labels.map((label, idx) => (
      <BaseDataItem<T> key={idx} {...rest} label={label} />
    ))}
  </BaseDataContainer>
);

export default BaseData;
