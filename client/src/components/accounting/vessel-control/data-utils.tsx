import styled from '@emotion/styled';
import { add } from 'date-fns';

import { LabelInfo } from 'components/column-label';
import { formatDate } from 'components/date-range-picker';
import DateTimePicker from 'components/date-time-picker';
import { DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE } from 'components/directory/shippers/data-utils';
import EditableCell from 'components/editable-cell';
import { SORT_ORDER } from 'hooks/use-columns';
import { Shipper, Vessel, VesselControl } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';

import UnpaidsManager from './unpaids';

export const LocalDateTimePicker = styled(DateTimePicker)(
  ({ dirty, error }: { dirty?: boolean; error?: boolean }) => ({
    fontSize: th.fontSizes.caption,
    width: 60,
    input: {
      borderColor: error ? th.colors.status.error : undefined,
      color: th.colors.text.default,
      fontWeight: dirty ? th.fontWeights.bold : th.fontWeights.normal,
    },
    '.react-datetime-picker__wrapper': {
      height: 22,
      padding: 0,
    },
    '.react-datetime-picker__inputGroup': {
      minWidth: 0,
      width: 58,
    },
  }),
);

export const dateTimePickerProps = {
  calendarIcon: null,
  clearIcon: null,
  disableClock: true,
  locale: 'en-US',
  format: 'MM-dd',
  dayPlaceholder: '',
  monthPlaceholder: '',
  yearPlaceholder: '',
};

export type VesselControlLabelInfo = LabelInfo<VesselControl>;

export const listLabels: (
  handleChange: (updatedItem: VesselControl) => void,
  vesselOptions: string[],
  shipperOptions: string[],
  arrivalOptions: string[],
) => VesselControlLabelInfo[] = (
  handleChange,
  vesselOptions,
  shipperOptions,
  arrivalOptions,
) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'dueDate',
    label: 'Due',
    sortable: true,
    sortKey: 'dueDate',
    customSortBy: ({ shipper, vessel }) => {
      const dueDate =
        vessel && shipper && getVesselControlDueDate(vessel, shipper);
      return (
        `${dueDate ? new Date(dueDate).getTime() : 0}-${vessel?.vesselCode}-${
          shipper?.shipperName
        }` || ''
      ).toLowerCase();
    },
    getValue: ({ shipper, vessel }) => {
      const dueDate =
        vessel && shipper && getVesselControlDueDate(vessel, shipper);
      return (
        <ty.BodyText>{dueDate ? formatShortDate(dueDate) : '-'}</ty.BodyText>
      );
    },
  },
  {
    key: 'approval1',
    label: 'In',
    isBoolean: true,
    getValue: ({ approval1, ...rest }) => (
      <LineItemCheckbox
        checked={!!approval1}
        onChange={() => {
          handleChange({ ...rest, approval1: !approval1 });
        }}
      />
    ),
  },
  {
    key: 'approval2',
    label: 'Out',
    isBoolean: true,
    getValue: ({ approval2, ...rest }) => (
      <LineItemCheckbox
        checked={!!approval2}
        onChange={() => {
          handleChange({ ...rest, approval2: !approval2 });
        }}
      />
    ),
  },
  {
    key: 'dateSent',
    label: 'Sent',
    isDate: true,
    allowOverflow: true,
    getValue: ({ dateSent, ...rest }) => {
      const value = dateSent ? new Date(dateSent.replace(/-/g, '/')) : null;
      return (
        <l.Div cursor="text">
          <LocalDateTimePicker
            onChange={(date: Date) => {
              handleChange({
                ...rest,
                dateSent:
                  !date || (date as any)?.type === 'change'
                    ? undefined
                    : formatDate(date),
              });
            }}
            value={value}
            {...dateTimePickerProps}
          />
        </l.Div>
      );
    },
  },
  {
    key: 'isLiquidated',
    label: 'Liq',
    isBoolean: true,
    getValue: ({ isLiquidated, ...rest }) => (
      <LineItemCheckbox
        checked={!!isLiquidated}
        onChange={() => {
          handleChange({ ...rest, isLiquidated: !isLiquidated });
        }}
      />
    ),
  },
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
          ? formatShortDate(new Date(vessel?.dischargeDate.replace(/-/g, '/')))
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
    getValue: ({ vessel }) => (
      <ty.BodyText>{vessel?.country?.countryName || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Rcvd.',
    getValue: ({ pallets }) => (
      <ty.BodyText>{pallets ? pallets.totalCount : '...'}</ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Sold',
    getValue: ({ pallets, palletsShipped }) => (
      <ty.BodyText>{pallets ? palletsShipped : '...'}</ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Diff',
    getValue: ({ pallets, palletsShipped }) => (
      <ty.BodyText>
        {pallets ? pallets.totalCount - palletsShipped : '...'}
      </ty.BodyText>
    ),
  },
  {
    key: 'unpaids',
    label: 'Unpaids:',
    getValue: (data) => (
      <UnpaidsManager handleChange={handleChange} vesselControl={data} />
    ),
    allowOverflow: true,
  },
  {
    key: 'notes1',
    label: 'Notes 1',
    getValue: ({ notes1, ...rest }) => (
      <EditableCell
        content={{
          dirty: false,
          value: notes1 || '',
        }}
        defaultChildren={null}
        editing={true}
        inputProps={{
          width: th.sizes.fill,
        }}
        onChange={(e) => {
          handleChange({ ...rest, notes1: e.target.value });
        }}
      />
    ),
  },
  {
    key: 'notes2',
    label: 'Notes 2',
    getValue: ({ notes2, ...rest }) => (
      <EditableCell
        content={{
          dirty: false,
          value: notes2 || '',
        }}
        defaultChildren={null}
        editing={true}
        inputProps={{
          width: th.sizes.fill,
        }}
        onChange={(e) => {
          handleChange({ ...rest, notes2: e.target.value });
        }}
      />
    ),
  },
];

export const getVesselControlDueDate = (vessel: Vessel, shipper: Shipper) =>
  vessel.dischargeDate
    ? add(new Date(vessel.dischargeDate.replace(/-/g, '/')), {
        days:
          shipper.vesselControlDaysUntilDue ||
          DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE,
      })
    : undefined;
