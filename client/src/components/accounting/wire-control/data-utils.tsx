import { add } from 'date-fns';
import { DecodedValueMap, QueryParamConfigMap } from 'use-query-params';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { UpdateType } from 'hooks/use-query-params';
import { VesselControl } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';
import { formatCurrency } from 'utils/format';

export type VesselControlLabelInfo = LabelInfo<VesselControl>;

export const listLabels: (
  vesselOptions: string[],
  shipperOptions: string[],
  arrivalOptions: string[],
  countryOptions: string[],
  wireControlView: string,
  setQueryParams: (
    newQuery: Partial<DecodedValueMap<QueryParamConfigMap>>,
    updateType?: UpdateType,
  ) => void,
) => (wireId?: number) => VesselControlLabelInfo[] =
  (
    vesselOptions,
    shipperOptions,
    arrivalOptions,
    countryOptions,
    wireControlView,
    setQueryParams,
  ) =>
  (wireId) =>
    [
      {
        defaultSortOrder: SORT_ORDER.ASC,
        key: 'vessel',
        label: 'Code',
        sortable: true,
        sortKey: 'vesselCode',
        customSortBy: ({ shipper, vessel }) =>
          (`${vessel?.vesselCode}-${shipper?.shipperName}` || '').toLowerCase(),
        getValue: ({ vessel }) =>
          vessel ? (
            <ty.LinkText
              hover="false"
              target="_blank"
              to={`/inventory/vessels/${vessel.vesselCode}?isPre=0`}
            >
              {vessel.vesselCode}
            </ty.LinkText>
          ) : (
            <ty.BodyText>{'-'}</ty.BodyText>
          ),
      },
      {
        defaultSortOrder: SORT_ORDER.ASC,
        key: 'vessel',
        label: 'Vessel Name',
        sortable: true,
        customSortBy: ({ shipper, vessel }) =>
          (`${vessel?.vesselName}-${shipper?.shipperName}` || '').toLowerCase(),
        filterable: true,
        filterPanelProps: {
          customStyles: { width: 500 },
          customOptions: vesselOptions || [],
          showSearch: true,
          portalId: 'vessel-control-portal',
          portalTop: -4,
          portalLeft: 344,
        },
        getValue: ({ vessel }) => (
          <ty.BodyText>{vessel?.vesselName || '-'}</ty.BodyText>
        ),
      },
      {
        defaultSortOrder: SORT_ORDER.ASC,
        key: 'vessel',
        label: 'Arrival Location',
        sortable: true,
        sortKey: 'arrivalLocation',
        customSortBy: ({ shipper, vessel }) =>
          (
            `${vessel?.warehouse?.warehouseName}-${vessel?.vesselCode}-${shipper?.shipperName}` ||
            ''
          ).toLowerCase(),
        filterable: true,
        filterPanelProps: {
          columnCount: 1,
          customStyles: { width: 250 },
          customOptions: arrivalOptions || [],
          portalId: 'vessel-control-portal',
          portalTop: -4,
          portalLeft: 496,
        },
        getValue: ({ vessel }) =>
          vessel ? (
            <ty.LinkText
              hover="false"
              target="_blank"
              to={`/directory/warehouses/${vessel?.warehouse?.id}`}
            >
              {vessel?.warehouse?.warehouseName}
            </ty.LinkText>
          ) : (
            <ty.BodyText>-</ty.BodyText>
          ),
      },
      {
        key: 'vessel',
        label: 'Discharge',
        getValue: ({ vessel }) => (
          <ty.BodyText>
            {vessel?.dischargeDate
              ? formatShortDate(
                  new Date(vessel?.dischargeDate.replace(/-/g, '/')),
                )
              : '-'}
          </ty.BodyText>
        ),
      },
      {
        defaultSortOrder: SORT_ORDER.ASC,
        key: 'shipper',
        label: 'Code',
        sortable: true,
        sortKey: 'shipperCode',
        customSortBy: ({ shipper, vessel }) =>
          (`${shipper?.id}-${vessel?.vesselCode}` || '').toLowerCase(),
        getValue: ({ shipper }) =>
          shipper ? (
            <ty.LinkText
              hover="false"
              target="_blank"
              to={`/directory/shippers/${shipper.id}`}
            >
              {shipper.id}
            </ty.LinkText>
          ) : (
            <ty.BodyText>{'-'}</ty.BodyText>
          ),
      },
      {
        defaultSortOrder: SORT_ORDER.ASC,
        key: 'shipper',
        label: 'Shipper Name',
        sortable: true,
        customSortBy: ({ shipper, vessel }) =>
          (`${shipper?.shipperName}-${vessel?.vesselCode}` || '').toLowerCase(),
        filterable: true,
        filterPanelProps: {
          customStyles: { width: 500 },
          customOptions: shipperOptions || [],
          portalId: 'vessel-control-portal',
          portalTop: -4,
          portalLeft: 786,
          showSearch: true,
        },
        getValue: ({ shipper }) => (
          <ty.BodyText>{shipper?.shipperName || '-'}</ty.BodyText>
        ),
      },
      {
        key: 'vessel',
        label: 'Country',
        sortKey: 'country',
        filterable: true,
        filterPanelProps: {
          customOptions: countryOptions || [],
          portalId: 'vessel-control-portal',
          portalTop: -4,
          portalLeft: 938,
        },
        getValue: ({ vessel }) => (
          <ty.BodyText>{vessel?.country?.countryName || '-'}</ty.BodyText>
        ),
      },
      {
        key: 'isLiquidated',
        label: 'Liq',
        isBoolean: true,
        getValue: ({ isLiquidated }) => (
          <LineItemCheckbox checked={!!isLiquidated} onChange={() => ({})} />
        ),
      },
      ...((wireControlView === 'ocean-freight'
        ? oceanFreightLabels(wireId)
        : [
            {
              key: 'wires',
              label: 'OCN',
              getValue: ({ shipper, vessel, wires }) => {
                const oceanFreightWires = wires?.nodes.filter(
                  (wire) => wire?.wireType === 'ocean-freight',
                );
                const verifiedWires = oceanFreightWires?.filter(
                  (wire) => wire?.isVerified,
                );
                return oceanFreightWires && oceanFreightWires.length > 0 ? (
                  <ty.TriggerText
                    hover="false"
                    onClick={() => {
                      setQueryParams({
                        wireControlView: 'ocean-freight',
                        scrollToVessel: vessel?.vesselCode,
                        scrollToShipper: shipper?.id,
                      });
                    }}
                  >{`${verifiedWires.length} / ${oceanFreightWires.length}`}</ty.TriggerText>
                ) : (
                  <ty.BodyText>-</ty.BodyText>
                );
              },
            },
          ]) as VesselControlLabelInfo[]),
      {
        key: 'wires',
        label: 'ADV',
        getValue: ({ wires }) => {
          const shipperAdvanceWires = wires?.nodes.filter(
            (wire) => wire?.wireType === 'shipper-advance',
          );
          const verifiedWires = shipperAdvanceWires?.filter(
            (wire) => wire?.isVerified,
          );
          return (
            <ty.BodyText>
              {shipperAdvanceWires && shipperAdvanceWires.length > 0
                ? `${verifiedWires.length} / ${shipperAdvanceWires.length}`
                : '-'}
            </ty.BodyText>
          );
        },
      },
      {
        key: 'wires',
        label: 'AOS',
        getValue: ({ wires }) => {
          const accountOfSaleWires = wires?.nodes.filter(
            (wire) => wire?.wireType === 'account-of-sale',
          );
          const verifiedWires = accountOfSaleWires?.filter(
            (wire) => wire?.isVerified,
          );
          return (
            <ty.BodyText>
              {accountOfSaleWires && accountOfSaleWires.length > 0
                ? `${verifiedWires.length} / ${accountOfSaleWires.length}`
                : '-'}
            </ty.BodyText>
          );
        },
      },
      {
        key: 'wires',
        label: 'MSC',
        getValue: ({ wires }) => {
          const miscWires = wires?.nodes.filter(
            (wire) => wire?.wireType === 'misc',
          );
          const verifiedWires = miscWires?.filter((wire) => wire?.isVerified);
          return (
            <ty.BodyText>
              {miscWires && miscWires.length > 0
                ? `${verifiedWires.length} / ${miscWires.length}`
                : '-'}
            </ty.BodyText>
          );
        },
      },
    ];

const oceanFreightLabels: (wireId?: number) => VesselControlLabelInfo[] = (
  wireId,
) => [
  {
    key: 'vessel',
    label: 'Due Date',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ vessel }) => (
      <ty.BodyText>
        {vessel?.arrivalDate
          ? formatShortDate(
              add(new Date(vessel?.arrivalDate.replace(/-/g, '/')), {
                days: -3,
              }),
            )
          : '-'}
      </ty.BodyText>
    ),
  },
  {
    key: 'wires',
    label: 'Bill Of Lading',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      return <ty.BodyText>{wireItem?.billOfLading || '-'}</ty.BodyText>;
    },
  },
  {
    key: 'wires',
    label: 'Pallets',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      return <ty.BodyText>{wireItem?.palletCount || '-'}</ty.BodyText>;
    },
  },
  {
    key: 'wires',
    label: 'Date Rcvd',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      return (
        <ty.BodyText>
          {wireItem?.receivedDate
            ? formatShortDate(
                new Date(wireItem?.receivedDate.replace(/-/g, '/')),
              )
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Amount',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      const itemAmount = parseFloat(wireItem?.freightAmount);
      return (
        <ty.BodyText
          mr={th.spacing.sm}
          textAlign={isNaN(itemAmount) ? 'center' : 'right'}
        >
          {isNaN(itemAmount) ? '-' : formatCurrency(itemAmount)}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Line',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      return (
        <ty.LinkText
          hover="false"
          to={`/directory/vendors/${wire?.vendor?.id}`}
        >
          {wire?.vendor?.vendorName}
        </ty.LinkText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Wire Number',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      return (
        <ty.LinkText
          hover={wire?.wireNumber ? 'false' : 'true'}
          to={`/accounting/wires/${wire?.id}`}
        >
          {wire?.wireNumber || 'UNK'}
        </ty.LinkText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Verified',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      return (
        <LineItemCheckbox checked={!!wire?.isVerified} onChange={() => ({})} />
      );
    },
  },
];

const shipperAdvanceLabels: (wireId?: number) => VesselControlLabelInfo[] = (
  wireId,
) => [
  {
    key: 'wires',
    label: 'Paid Date',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const paidDate = wire?.checkHeader?.checkDate;
      return (
        <ty.BodyText>
          {paidDate
            ? formatShortDate(new Date(paidDate.replace(/-/g, '/')))
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Pallets',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      return <ty.BodyText>{wireItem?.palletCount || '-'}</ty.BodyText>;
    },
  },
  {
    key: 'wires',
    label: 'Date Rcvd',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      return (
        <ty.BodyText>
          {wireItem?.receivedDate
            ? formatShortDate(
                new Date(wireItem?.receivedDate.replace(/-/g, '/')),
              )
            : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Amount',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ shipper, vessel, wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      const wireItem = wire?.wireRequestOceanFreightItems?.nodes.find(
        (item) =>
          item?.vessel?.vesselCode === vessel?.vesselCode &&
          item?.shipper?.id === shipper?.id,
      );
      const itemAmount = parseFloat(wireItem?.freightAmount);
      return (
        <ty.BodyText
          mr={th.spacing.sm}
          textAlign={isNaN(itemAmount) ? 'center' : 'right'}
        >
          {isNaN(itemAmount) ? '-' : formatCurrency(itemAmount)}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Line',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      return (
        <ty.LinkText
          hover="false"
          to={`/directory/vendors/${wire?.vendor?.id}`}
        >
          {wire?.vendor?.vendorName}
        </ty.LinkText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Wire Number',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      return (
        <ty.LinkText
          hover={wire?.wireNumber ? 'false' : 'true'}
          to={`/accounting/wires/${wire?.id}`}
        >
          {wire?.wireNumber || 'UNK'}
        </ty.LinkText>
      );
    },
  },
  {
    key: 'wires',
    label: 'Verified',
    customStyles: {
      label: { color: th.colors.brand.primaryAccent, opacity: 1 },
    },
    getValue: ({ wires }) => {
      const wire = wires?.nodes.find((wire) => wire?.id === wireId);
      return (
        <LineItemCheckbox checked={!!wire?.isVerified} onChange={() => ({})} />
      );
    },
  },
];
