import React from 'react';
import { omit, pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import StatusIndicator from 'components/status-indicator';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  Pallet,
  ProductSpecies,
  Shipper,
  Vendor,
  Vessel,
  WireRequest,
  WireRequestAccountOfSaleItem,
  WireRequestMiscItem,
  WireRequestOceanFreightItem,
  WireRequestShipperAdvanceItem,
} from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';
import { formatCurrency } from 'utils/format';

export type WireRequestLabelInfo = LabelInfo<WireRequest>;

export const listLabels: (vendorOptions: string[]) => WireRequestLabelInfo[] = (
  vendorOptions,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'wireNumber',
    label: 'Wire Number',
    sortable: true,
  },
  {
    key: 'wireDate',
    label: 'Wire Date',
    getValue: ({ wireDate }) => (
      <ty.BodyText>
        {wireDate
          ? formatShortDate(new Date(wireDate.replace(/-/g, '/')))
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
    key: 'wireType',
    label: 'Wire Type',
    sortable: true,
    getValue: ({ wireType }) => {
      const { color, text } = getWireTypeStatusInfo(wireType || '-');
      return (
        <l.Flex alignCenter justifyStart width={th.sizes.fill}>
          <StatusIndicator
            color={color}
            customStyles={{ wrapper: { py: th.spacing.tn } }}
            text={text}
          />
        </l.Flex>
      );
    },
  },
  {
    key: 'approvalDate',
    label: 'Approved',
    sortable: true,
    getValue: ({ approvalDate }) => (
      <ty.BodyText>
        {approvalDate
          ? formatShortDate(new Date(approvalDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'isVerified',
    label: 'Verified',
    getValue: ({ isVerified }) => (
      <LineItemCheckbox checked={!!isVerified} disabled onChange={() => ({})} />
    ),
  },
];

export const baseLabels: (
  vendors: Vendor[],
  isCreate: boolean,
  isApprove: boolean,
  hasNonMiscItems?: boolean,
) => WireRequestLabelInfo[] = (
  vendors,
  isCreate,
  isApprove,
  hasNonMiscItems,
) => [
  {
    key: 'wireNumber',
    label: 'Wire Number',
    readOnly: isCreate || isApprove,
  },
  {
    key: 'wireDate',
    label: 'Wire Date',
    readOnly: isApprove,
    getValue: ({ wireDate }) => (
      <ty.BodyText>
        {wireDate
          ? formatShortDate(new Date(wireDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    validate: ({ wireDate }) => !!wireDate,
    isDate: true,
  },
  {
    key: 'vendorId',
    label: 'Vendor',
    readOnly: isApprove || !!hasNonMiscItems,
    itemSelectorQueryProps: {
      customOptions: vendors,
      customSearchKeys: ['id', 'vendorName'],
      errorLabel: 'vendors',
      getItemContent: ({ id, vendorName }: Vendor) => (
        <ty.BodyText pl={th.spacing.sm}>
          {id} - {vendorName}
        </ty.BodyText>
      ),
      width: 380,
    },
    editablCellProps: {
      getEditingValue: (localValue) => {
        const vendor = vendors.find((v) => v.id === localValue);
        return vendor ? `${vendor.vendorName} (${vendor.id})` : localValue;
      },
    },
    getValue: ({ vendor, vendorId }) => {
      const v = vendor || vendors.find((v) => v.id === vendorId);
      return v ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${v.id}`}>
          {v.vendorName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      );
    },
    validate: ({ vendorId }) =>
      !!vendorId && !!vendors.find((v) => v.id === vendorId),
  },
  {
    key: 'wireType',
    label: 'Wire Type',
    sortable: true,
    dropdownOptions: [
      { content: 'Ocean Freight', value: 'ocean-freight' },
      { content: 'Shipper Advance', value: 'shipper-advance' },
      { content: 'Account Of Sale', value: 'account-of-sale' },
      { content: 'Misc', value: 'misc' },
    ],
    readOnly: !isCreate || !!hasNonMiscItems,
    getValue: ({ wireType }) => {
      const { color, text } = getWireTypeStatusInfo(wireType || '-');
      return (
        <l.Flex
          alignCenter
          justifyStart
          ml={th.spacing.sm}
          pl={th.spacing.xl}
          pt={th.spacing.xs}
          width={th.sizes.fill}
        >
          <StatusIndicator color={color} text={text} />
        </l.Flex>
      );
    },
    validate: ({ wireType }) => !!wireType,
  },
  {
    key: 'bankId',
    label: 'Bank',
    readOnly: isApprove,
    getValue: ({ bankId }) => <ty.BodyText>{bankId || '-'}</ty.BodyText>,
    validate: ({ bankId }) => !!bankId,
  },
  {
    key: 'requestDate',
    label: 'Request Date',
    getValue: ({ requestDate }) => (
      <ty.BodyText>
        {requestDate
          ? formatShortDate(new Date(requestDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    isDate: true,
    readOnly: true,
  },
  {
    key: 'requestUserCode',
    label: 'Entered By',
    getValue: ({ requestUser, requestUserCode }) =>
      requestUser?.personContact ? (
        <ty.LinkText
          hover={false}
          to={`/directory/internal/${requestUser.personContact.id}`}
        >
          {`${requestUser.personContact.firstName}`}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{requestUserCode || ''}</ty.BodyText>
      ),
    readOnly: true,
  },
  {
    key: 'approvalDate',
    label: 'Approval Date',
    getValue: ({ approvalDate }) => (
      <ty.BodyText>
        {approvalDate
          ? formatShortDate(new Date(approvalDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    isDate: true,
    readOnly: !isApprove,
  },
  {
    key: 'approvalUserCode',
    label: 'Approved By',
    getValue: ({ approvalUser, approvalUserCode }) =>
      approvalUser?.personContact ? (
        <ty.LinkText
          hover={false}
          to={`/directory/internal/${approvalUser.personContact.id}`}
        >
          {`${approvalUser.personContact.firstName}`}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{approvalUserCode || '-'}</ty.BodyText>
      ),
    readOnly: !isApprove,
  },
  {
    key: 'sentDate',
    label: 'Sent Date',
    getValue: ({ sentDate }) => (
      <ty.BodyText>
        {sentDate
          ? formatShortDate(new Date(sentDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    isDate: true,
    readOnly: isCreate,
  },
  {
    key: 'isVerified',
    label: 'Verified',
    getValue: ({ isVerified }) => (
      <LineItemCheckbox checked={!!isVerified} disabled onChange={() => ({})} />
    ),
    isBoolean: true,
    readOnly: isCreate,
  },
];

export type WireRequestOceanFreightItemLabelInfo =
  LabelInfo<WireRequestOceanFreightItem>;

export const oceanFreightItemLabels: (
  vessels: Vessel[],
  shippers: Shipper[],
  isEditing: boolean,
  loading: boolean,
) => WireRequestOceanFreightItemLabelInfo[] = (
  vessels,
  shippers,
  isEditing,
  loading,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vesselCode',
    label: 'Vessel',
    sortable: true,
    allowOverflow: isEditing,
    itemSelectorQueryProps: {
      customOptions: vessels,
      customSearchKeys: ['vesselCode', 'vesselName'],
      errorLabel: 'vessels',
      nameKey: 'vesselCode',
      loading,
      getItemContent: ({ vesselCode, vesselName }: Vessel) => (
        <ty.BodyText pl={th.spacing.sm}>
          {vesselCode} - {vesselName}
        </ty.BodyText>
      ),
      width: 300,
    },
    editablCellProps: {
      getEditingValue: (localValue) => {
        const vessel = vessels.find((v) => v.vesselCode === localValue);
        return vessel
          ? `${vessel.vesselCode} - ${vessel.vesselName})`
          : localValue;
      },
    },
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover={false}
          nowrap
          to={`/inventory/vessels/${vessel.vesselCode}`}
        >
          {`${vessel.vesselCode} - ${vessel.vesselName}`}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    validate: ({ vesselCode }) =>
      !!vesselCode && !!vessels.find((v) => v.vesselCode === vesselCode),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'shipperId',
    label: 'Shipper',
    sortable: true,
    allowOverflow: isEditing,
    itemSelectorQueryProps: {
      customOptions: shippers,
      customSearchKeys: ['id', 'shipperName'],
      errorLabel: 'shippers',
      loading,
      getItemContent: ({ id, shipperName }: Shipper) => (
        <ty.BodyText pl={th.spacing.sm}>
          {shipperName} ({id})
        </ty.BodyText>
      ),
      width: 300,
    },
    editablCellProps: {
      getEditingValue: (localValue) => {
        const shipper = shippers.find((s) => s.id === localValue);
        return shipper ? `${shipper.shipperName} (${shipper.id})` : localValue;
      },
    },
    getValue: ({ shipper }) =>
      shipper ? (
        <ty.LinkText
          hover={false}
          nowrap
          to={`/directory/shippers/${shipper.id}`}
        >
          {`${shipper.shipperName} (${shipper.id})`}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    validate: ({ shipperId }) =>
      !!shipperId && !!shippers.find((s) => s.id === shipperId),
  },
  {
    key: 'billOfLading',
    label: 'BOL',
    sortable: true,
    validate: ({ billOfLading }) => !!billOfLading,
  },
  {
    key: 'palletCount',
    label: 'Pallet Count',
    validate: ({ palletCount }) => palletCount > 0,
    inputProps: {
      min: 0,
    },
    isNumber: true,
  },
  {
    key: 'freightAmount',
    label: 'Freight Amt',
    getValue: ({ freightAmount }) => (
      <ty.BodyText mr={th.spacing.md} textAlign="right">
        {formatCurrency(parseFloat(freightAmount))}
      </ty.BodyText>
    ),
    validate: ({ freightAmount }) =>
      !!freightAmount && parseFloat(freightAmount) > 0,
    isCurrency: true,
  },
  {
    key: 'receivedDate',
    label: 'Rcvd Date',
    getValue: ({ receivedDate }) => (
      <ty.BodyText>
        {receivedDate
          ? formatShortDate(new Date(receivedDate.replace(/-/g, '/')))
          : '-'}
      </ty.BodyText>
    ),
    validate: ({ receivedDate }) => !!receivedDate,
    allowOverflow: true,
    isDate: true,
  },
];

export type WireRequestShipperAdvanceItemLabelInfo =
  LabelInfo<WireRequestShipperAdvanceItem>;

export const shipperAdvanceItemLabels: (
  vessels: Vessel[],
  speciesList: ProductSpecies[],
  billsOfLading: { id: string }[],
  isEditing: boolean,
  loading?: boolean,
  boxCount?: number,
  total?: number,
) => WireRequestShipperAdvanceItemLabelInfo[] = (
  vessels,
  speciesList,
  billsOfLading,
  isEditing,
  loading,
  boxCount,
  total,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'vesselCode',
    label: 'Vessel',
    sortable: true,
    allowOverflow: isEditing,
    itemSelectorQueryProps: {
      customOptions: vessels,
      customSearchKeys: ['vesselCode', 'vesselName'],
      errorLabel: 'vessels',
      loading,
      nameKey: 'vesselCode',
      getItemContent: ({ vesselCode, vesselName }: Vessel) => (
        <ty.BodyText pl={th.spacing.sm}>
          {vesselCode} - {vesselName}
        </ty.BodyText>
      ),
      width: 300,
    },
    editablCellProps: {
      getEditingValue: (localValue) => {
        const vessel = vessels.find((v) => v.vesselCode === localValue);
        return vessel
          ? `${vessel.vesselCode} - ${vessel.vesselName})`
          : localValue;
      },
    },
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover={false}
          nowrap
          to={`/inventory/vessels/${vessel.vesselCode}`}
        >
          {`${vessel.vesselCode} - ${vessel.vesselName}`}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    validate: ({ vesselCode }) =>
      !!vesselCode && !!vessels.find((v) => v.vesselCode === vesselCode),
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'billOfLading',
    label: 'BOL',
    sortable: true,
    allowOverflow: isEditing,
    itemSelectorQueryProps: {
      customOptions: billsOfLading,
      errorLabel: 'bills of lading',
      loading,
      getItemContent: ({ id }: { id: string }) => (
        <ty.BodyText pl={th.spacing.sm}>{id} </ty.BodyText>
      ),
      width: 200,
    },
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'speciesId',
    label: 'Species',
    sortable: true,
    allowOverflow: isEditing,
    itemSelectorQueryProps: {
      customOptions: speciesList,
      customSearchKeys: ['id', 'speciesDescription'],
      errorLabel: 'species',
      loading,
      getItemContent: ({ id, speciesDescription }: ProductSpecies) => (
        <ty.BodyText pl={th.spacing.sm}>
          {speciesDescription} ({id})
        </ty.BodyText>
      ),
      width: 300,
    },
    editablCellProps: {
      getEditingValue: (localValue) => {
        const species = speciesList.find((s) => s.id === localValue);
        return species
          ? `${species.speciesDescription} (${species.id})`
          : localValue;
      },
    },
    getValue: ({ species }) =>
      species ? (
        <ty.BodyText nowrap>
          {`${species.speciesDescription} (${species.id})`}
        </ty.BodyText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    validate: ({ speciesId }) =>
      !!speciesId && !!speciesList.find((s) => s.id === speciesId),
  },
  {
    key: 'boxAmount',
    label: 'Box Qty',
    readOnly: true,
    getValue: () => <ty.BodyText>{boxCount || '-'}</ty.BodyText>,
  },
  {
    key: 'boxAmount',
    label: 'Advance Amt',
    getValue: ({ boxAmount }) => (
      <ty.BodyText mr={th.spacing.lg} textAlign="right">
        {formatCurrency(parseFloat(boxAmount))}
      </ty.BodyText>
    ),
    validate: ({ boxAmount }) => !isNaN(boxAmount) && boxAmount > 0,
    isCurrency: true,
  },
  {
    key: 'boxAmount',
    label: 'Item Total',
    readOnly: true,
    getValue: () => (
      <ty.BodyText>{total ? formatCurrency(total) : '-'}</ty.BodyText>
    ),
  },
];

export type WireRequestAccountOfSaleItemLabelInfo =
  LabelInfo<WireRequestAccountOfSaleItem>;

export const accountOfSaleItemLabels: (
  vessels: Vessel[],
  isEdting: boolean,
) => WireRequestAccountOfSaleItemLabelInfo[] = (vessels, isEditing) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'billOfLading',
    label: 'BOL',
    sortable: true,
    validate: ({ billOfLading }) => !!billOfLading,
  },
  {
    key: 'vesselCode',
    label: 'Vessel',
    allowOverflow: isEditing,
    itemSelectorQueryProps: {
      customOptions: vessels,
      customSearchKeys: ['vesselCode', 'vesselName'],
      errorLabel: 'vessels',
      getItemContent: ({ vesselCode, vesselName }: Vessel) => (
        <ty.BodyText pl={th.spacing.sm}>
          {vesselCode} - {vesselName}
        </ty.BodyText>
      ),
      width: 300,
    },
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover={false}
          nowrap
          to={`/inventory/vessels/${vessel.vesselCode}`}
        >
          {`${vessel.vesselCode} - ${vessel.vesselName}`}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
    validate: ({ vessel }) =>
      !!vessel && !!vessels.find((v) => v.vesselCode === vessel.vesselCode),
  },
];

export type WireRequestMiscItemLabelInfo = LabelInfo<WireRequestMiscItem>;

export const miscItemLabels: WireRequestMiscItemLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'itemDescription',
    label: 'Description',
    sortable: true,
    validate: ({ itemDescription }) => !!itemDescription,
  },
  {
    key: 'itemAmount',
    label: 'Amount',
    getValue: ({ itemAmount }) => (
      <ty.BodyText mr={th.spacing.lg} textAlign="right">
        {formatCurrency(parseFloat(itemAmount))}
      </ty.BodyText>
    ),
    validate: ({ itemAmount }) => itemAmount > 0,
    isCurrency: true,
  },
];

const getWireTypeStatusInfo = (wireType: string) => {
  switch (wireType) {
    case 'ocean-freight':
      return {
        text: 'OCN',
        color: th.colors.brand.primaryAccent,
      };
    case 'shipper-advance':
      return {
        text: 'ADV',
        color: th.colors.status.warningAlt,
      };
    case 'account-of-sale':
      return {
        text: 'AOS',
        color: th.colors.status.successAlt,
      };
    case 'misc':
      return {
        text: 'MSC',
        color: th.colors.brand.primary,
      };
    default:
      return {
        color: th.colors.brand.secondary,
        text: 'UNK',
      };
  }
};

export const transformChangesOnUpdate = (
  changes: WireRequest,
  oceanFreightItems: WireRequestOceanFreightItem[],
  shipperAdvanceItems: WireRequestShipperAdvanceItem[],
  accountOfSaleItems: WireRequestAccountOfSaleItem[],
  miscItems: WireRequestMiscItem[],
) => ({
  ...omit(
    [
      'vendor',
      'approvalUser',
      'requestUser',
      'checkHeader',
      'wireRequestOceanFreightItems',
      'wireRequestShipperAdvanceItems',
      'wireRequestAccountOfSaleItems',
      'wireRequestMiscItems',
      '__typename',
    ],
    changes,
  ),
  wireRequestOceanFreightItemsUsingId: {
    create: (
      (changes.wireRequestOceanFreightItems?.nodes ||
        []) as WireRequestOceanFreightItem[]
    )
      .filter(({ id }) => id < 0)
      .map(({ id, ...rest }) => rest),
    updateById: (
      (changes.wireRequestOceanFreightItems?.nodes ||
        []) as WireRequestOceanFreightItem[]
    )
      .filter(({ id }) => id > 0)
      .map(({ id, __typename, vessel, shipper, ...rest }) => ({
        patch: rest,
        id,
      })),
    deleteById: oceanFreightItems
      .filter(
        ({ id }) =>
          !pluck(
            'id',
            (changes.wireRequestOceanFreightItems?.nodes ||
              []) as WireRequestOceanFreightItem[],
          ).includes(id),
      )
      .map(({ id }) => ({ id: `${id}` })),
  },
  wireRequestShipperAdvanceItemsUsingId: {
    create: (
      (changes.wireRequestShipperAdvanceItems?.nodes ||
        []) as WireRequestShipperAdvanceItem[]
    )
      .filter(({ id }) => id < 0)
      .map(({ id, ...rest }) => rest),
    updateById: (
      (changes.wireRequestShipperAdvanceItems?.nodes ||
        []) as WireRequestShipperAdvanceItem[]
    )
      .filter(({ id }) => id > 0)
      .map(({ id, __typename, vessel, ...rest }) => ({
        patch: rest,
        id,
      })),
    deleteById: shipperAdvanceItems
      .filter(
        ({ id }) =>
          !pluck(
            'id',
            (changes.wireRequestShipperAdvanceItems?.nodes ||
              []) as WireRequestShipperAdvanceItem[],
          ).includes(id),
      )
      .map(({ id }) => ({ id: `${id}` })),
  },
  wireRequestAccountOfSaleItemsUsingId: {
    create: (
      (changes.wireRequestAccountOfSaleItems?.nodes ||
        []) as WireRequestAccountOfSaleItem[]
    )
      .filter(({ id }) => id < 0)
      .map(({ id, ...rest }) => rest),
    updateById: (
      (changes.wireRequestAccountOfSaleItems?.nodes ||
        []) as WireRequestAccountOfSaleItem[]
    )
      .filter(({ id }) => id > 0)
      .map(({ id, __typename, vessel, ...rest }) => ({ patch: rest, id })),
    deleteById: accountOfSaleItems
      .filter(
        ({ id }) =>
          !pluck(
            'id',
            (changes.wireRequestAccountOfSaleItems?.nodes ||
              []) as WireRequestAccountOfSaleItem[],
          ).includes(id),
      )
      .map(({ id }) => ({ id: `${id}` })),
  },
  wireRequestMiscItemsUsingId: {
    create: (
      (changes.wireRequestMiscItems?.nodes || []) as WireRequestMiscItem[]
    )
      .filter(({ id }) => id < 0)
      .map(({ id, ...rest }) => rest),
    updateById: (
      (changes.wireRequestMiscItems?.nodes || []) as WireRequestMiscItem[]
    )
      .filter(({ id }) => id > 0)
      .map(({ id, __typename, ...rest }) => ({ patch: rest, id })),
    deleteById: miscItems
      .filter(
        ({ id }) =>
          !pluck(
            'id',
            (changes.wireRequestMiscItems?.nodes ||
              []) as WireRequestMiscItem[],
          ).includes(id),
      )
      .map(({ id }) => ({ id: `${id}` })),
  },
});

export const validationLabels = (
  baseLabels: WireRequestLabelInfo[],
  vessels: Vessel[],
  shippers: Shipper[],
  speciesList: ProductSpecies[],
) =>
  baseLabels.concat({
    key: 'wireRequestOceanFreightItems',
    label: 'Ocean Freight',
    validate: ({ wireRequestOceanFreightItems }) =>
      (
        (wireRequestOceanFreightItems?.nodes ||
          []) as WireRequestOceanFreightItem[]
      ).every(
        ({
          billOfLading,
          freightAmount,
          palletCount,
          receivedDate,
          shipperId,
          vesselCode,
        }) =>
          !!billOfLading &&
          !!shipperId &&
          !!shippers.find((s) => s.id === shipperId) &&
          !!vesselCode &&
          !!vessels.find((v) => v.vesselCode === vesselCode) &&
          palletCount > 0 &&
          !!freightAmount &&
          !!receivedDate,
      ),
  });

const getOceanFreightRequestTotals = (
  oceanFreightItems: WireRequestOceanFreightItem[],
  miscItems: WireRequestMiscItem[],
) => {
  const totalPallets = oceanFreightItems.reduce(
    (acc, { palletCount }) => acc + parseInt(palletCount, 10),
    0,
  );
  const totalFreightAmount = oceanFreightItems.reduce(
    (acc, { freightAmount }) => acc + parseFloat(freightAmount),
    0,
  );
  const palletAvg = totalFreightAmount / totalPallets;
  const totalMiscAmount = miscItems.reduce(
    (acc, { itemAmount }) => acc + parseFloat(itemAmount),
    0,
  );
  return {
    totalPallets,
    totalFreightAmount,
    palletAvg,
    total: totalFreightAmount + totalMiscAmount,
  };
};

const getShipperAdvanceRequestTotals = (
  shipperAdvanceItems: WireRequestShipperAdvanceItem[],
  miscItems: WireRequestMiscItem[],
  vesselDetails?: Vessel,
) => {
  const pallets = (vesselDetails?.pallets.nodes || []) as Pallet[];
  return {};
};

export const getTotalComponents = (
  changes: WireRequest,
  isOceanFreight: boolean,
  isShipperAdvance: boolean,
) => {
  if (isOceanFreight) {
    const totals = getOceanFreightRequestTotals(
      (changes?.wireRequestOceanFreightItems.nodes ||
        []) as WireRequestOceanFreightItem[],
      (changes?.wireRequestMiscItems?.nodes || []) as WireRequestMiscItem[],
    );
    return (
      <l.Flex alignCenter justifyBetween>
        <ty.BodyText secondary textAlign="right">
          Pallets:
        </ty.BodyText>
        <ty.BodyText
          color={th.colors.brand.primaryAccent}
          ml={th.spacing.md}
          textAlign="right"
          width={20}
        >
          {totals.totalPallets || '-'}
        </ty.BodyText>
        <ty.BodyText secondary ml={th.spacing.lg} textAlign="right">
          Freight Amt:{' '}
        </ty.BodyText>
        <ty.BodyText
          color={th.colors.brand.primaryAccent}
          ml={th.spacing.md}
          textAlign="right"
          width={80}
        >
          {totals.totalFreightAmount
            ? formatCurrency(totals.totalFreightAmount)
            : '-'}
        </ty.BodyText>
        <ty.BodyText secondary ml={th.spacing.lg} textAlign="right">
          Pallet Avg:{' '}
        </ty.BodyText>
        <ty.BodyText
          color={th.colors.brand.primaryAccent}
          ml={th.spacing.md}
          textAlign="right"
          width={80}
        >
          {totals.palletAvg ? formatCurrency(totals.palletAvg) : '-'}
        </ty.BodyText>
        <ty.BodyText secondary ml={th.spacing.lg} textAlign="right">
          Total:{' '}
        </ty.BodyText>
        <ty.BodyText
          bold
          color={th.colors.brand.primaryAccent}
          ml={th.spacing.md}
          textAlign="right"
          width={80}
        >
          {totals.total ? formatCurrency(totals.total) : '-'}
        </ty.BodyText>
      </l.Flex>
    );
  } else if (isShipperAdvance) {
  }
};
