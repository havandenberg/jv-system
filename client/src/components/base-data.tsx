import React from 'react';
import { OperationVariables, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { loader } from 'graphql.macro';
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

const defaultQuery = loader('../api/base-data.gql');

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
  customOptions?: any[];
  customSearchKeys?: string[];
  errorLabel: string;
  getItemContent?: (item: any) => React.ReactNode;
  height?: number;
  loading?: boolean;
  nameKey?: string;
  offset?: string | number;
  query?: any;
  queryName?: string;
  queryVariables?: OperationVariables;
  width?: number;
}

export const BaseDataItemSelector = <T extends {}>({
  customOptions,
  customSearchKeys,
  editableCellProps,
  editing,
  errorLabel,
  getItemContent,
  handleChange,
  height = 150,
  labelKey,
  loading,
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
  const { data: itemSelectorData, loading: queryLoading } = useQuery<Query>(
    query || defaultQuery,
    {
      variables: {
        search: getSearchArray(value) || '',
        ...queryVariables,
      },
      skip: !query,
    },
  );

  const allItems = () =>
    customOptions?.filter(
      (option) =>
        !customSearchKeys ||
        Object.keys(option)
          .filter((key) => customSearchKeys.includes(key))
          .map((optKey) => option[optKey] || '')
          .join(',')
          .toLowerCase()
          .includes(value.toLowerCase()),
    ) || (queryName ? pathOr([], [queryName, 'nodes'], itemSelectorData) : []);

  const { ItemSelector } = useItemSelector({
    allItems,
    closeOnSelect: true,
    disabled: !editing,
    editableCellProps,
    errorLabel,
    getItemContent,
    height,
    loading: !!(queryLoading || loading),
    nameKey,
    offset,
    panelGap: 2,
    selectItem: (item: any) => {
      handleChange && handleChange(labelKey, item[nameKey || 'id']);
    },
    selectedItem: value,
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
    editablCellProps,
    key,
    getValue,
    label,
    isBoolean,
    isColor,
    isDate,
    isNumber,
    isCurrency,
    itemSelectorQueryProps,
    readOnly,
    title,
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
        value: isBoolean
          ? changes[key] === undefined
            ? Boolean(data[key])
            : Boolean(changes[key])
          : `${
              changes[key] === undefined ? data[key] || '' : changes[key] || ''
            }`,
      }
    : { dirty: false, value: isBoolean ? Boolean(data[key]) : `${data[key]}` };
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
        handleChange(key, isBoolean ? e.target.checked : e.target.value);
    },
    title: data && title ? title(data) : undefined,
    ...editablCellProps,
  };

  return (
    <l.Div
      height={th.sizes.fill}
      pb={th.spacing.md}
      pr={th.spacing.sm}
      pt={th.spacing.sm}
      title={data && title ? title(data) : undefined}
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
          value={`${content.value}`}
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
