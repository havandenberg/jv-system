import React from 'react';

import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import { CheckHeader } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';
import { formatCurrency } from 'utils/format';

export type CheckHeaderLabelInfo = LabelInfo<CheckHeader>;

export const listLabels: (
  vendorOptions: string[],
  statusOptions: string[],
) => CheckHeaderLabelInfo[] = (vendorOptions, statusOptions) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'checkNumber',
    label: 'ID',
    sortable: true,
  },
  {
    key: 'checkDate',
    label: 'Check Date',
    getValue: ({ checkDate }) => (
      <ty.BodyText>
        {checkDate
          ? formatShortDate(new Date(checkDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    sortable: true,
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    sortable: true,
    customSortBy: ({ vendor }) => vendor?.vendorName,
    filterable: true,
    filterPanelProps: {
      customStyles: { width: 500 },
      customOptions: vendorOptions || [],
      showSearch: true,
    },
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'checkAmount',
    label: 'Check Amount',
    sortable: true,
    customSortBy: ({ checkAmount }) => parseFloat(checkAmount),
    getValue: ({ checkAmount }) => (
      <ty.BodyText mr={th.spacing.xl} textAlign="right">
        {formatCurrency(parseFloat(checkAmount))}
      </ty.BodyText>
    ),
  },
  {
    key: 'checkStatus',
    label: 'Status',
    filterable: true,
    filterPanelProps: {
      customStyles: { width: 120 },
      customOptions: statusOptions || [],
    },
    getValue: ({ checkStatus }) => (
      <l.Flex alignCenter justifyStart width={th.sizes.fill}>
        <StatusIndicator
          color={
            checkStatus === 'V'
              ? th.colors.status.error
              : checkStatus === 'P'
              ? th.colors.status.warning
              : th.colors.status.success
          }
          customStyles={{ wrapper: { py: th.spacing.tn } }}
          text={
            checkStatus === 'V' ? 'VOID' : checkStatus === 'P' ? 'PEND' : 'PAID'
          }
        />
      </l.Flex>
    ),
  },
  {
    key: 'isReconciled',
    label: 'Rec',
    getValue: ({ isReconciled }) => (
      <LineItemCheckbox
        checked={!!isReconciled}
        disabled
        onChange={() => ({})}
      />
    ),
  },
];

export const baseLabels: CheckHeaderLabelInfo[] = [
  {
    key: 'checkNumber',
    label: 'Check Number',
  },
  {
    key: 'checkDate',
    label: 'Check Date',
    getValue: ({ checkDate }) => (
      <ty.BodyText>
        {checkDate
          ? formatShortDate(new Date(checkDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.vendorName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'checkAmount',
    label: 'Amount',
    getValue: ({ checkAmount }) => (
      <ty.BodyText>{formatCurrency(checkAmount)}</ty.BodyText>
    ),
  },
  {
    key: 'checkStatus',
    label: 'Status',
    getValue: ({ checkStatus }) => (
      <StatusIndicator
        color={
          checkStatus === 'V'
            ? th.colors.status.error
            : checkStatus === 'P'
            ? th.colors.status.warning
            : th.colors.status.success
        }
        text={
          checkStatus === 'V' ? 'VOID' : checkStatus === 'P' ? 'PEND' : 'PAID'
        }
      />
    ),
  },
  {
    key: 'bankId',
    label: 'Bank',
    getValue: ({ bankId }) => <ty.BodyText>{bankId || '-'}</ty.BodyText>,
  },
  {
    key: 'entryDate',
    label: 'Entry Date',
    getValue: ({ entryDate }) => (
      <ty.BodyText>
        {entryDate
          ? formatShortDate(new Date(entryDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'invoiceId',
    label: 'Inv ID',
    getValue: ({ invoiceId }) => <ty.BodyText>{invoiceId || '-'}</ty.BodyText>,
  },
  {
    key: 'invoiceAmount',
    label: 'Inv Amount',
    getValue: ({ invoiceAmount }) => (
      <ty.BodyText>{formatCurrency(invoiceAmount)}</ty.BodyText>
    ),
  },
  {
    key: 'discountAmount',
    label: 'Disc Amount',
    getValue: ({ discountAmount }) => (
      <ty.BodyText>{formatCurrency(discountAmount)}</ty.BodyText>
    ),
  },
  {
    key: 'remitToCode',
    label: 'Remit To',
    getValue: ({ remitToCode }) => (
      <ty.BodyText>{remitToCode || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'isReconciled',
    label: 'Rec',
    getValue: ({ isReconciled }) => (
      <LineItemCheckbox
        checked={!!isReconciled}
        disabled
        onChange={() => ({})}
      />
    ),
  },
];
