import styled from '@emotion/styled';
import { add } from 'date-fns';

import { LabelInfo } from 'components/column-label';
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

const LocalDateTimePicker = styled(DateTimePicker)({
  fontSize: th.fontSizes.caption,
  width: 60,
  input: {
    color: th.colors.text.default,
  },
  '.react-datetime-picker__wrapper': {
    height: 22,
    padding: 0,
  },
  '.react-datetime-picker__inputGroup': {
    minWidth: 0,
    width: 58,
  },
});

const dateTimePickerProps = {
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
) => VesselControlLabelInfo[] = (handleChange) => [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'dueDate',
    label: 'Due Date',
    sortable: true,
    sortKey: 'dueDate',
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
      const value = dateSent ? new Date(dateSent) : null;
      return (
        <l.Div cursor="text">
          <LocalDateTimePicker
            onChange={(date: Date) => {
              handleChange({
                ...rest,
                dateSent:
                  !date || (date as any)?.type === 'change' ? undefined : date,
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
    key: 'vessel',
    label: 'Code',
    getValue: ({ vessel }) =>
      vessel ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/inventory/vessels/${vessel.vesselCode}`}
        >
          {vessel.vesselCode}
        </ty.LinkText>
      ) : (
        <ty.BodyText>{'-'}</ty.BodyText>
      ),
  },
  {
    key: 'vessel',
    label: 'Vessel Name',
    getValue: ({ vessel }) => (
      <ty.BodyText>{vessel?.vesselName || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Arrival Location',
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
    key: 'shipper',
    label: 'Shipper',
    getValue: ({ shipper }) =>
      shipper ? (
        <ty.LinkText
          hover="false"
          target="_blank"
          to={`/directory/shippers/${shipper.id}`}
        >
          {shipper.shipperName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
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
      <ty.BodyText>{pallets.totalCount || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Sold',
    getValue: ({ palletsShipped }) => (
      <ty.BodyText>{palletsShipped || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'vessel',
    label: 'Diff',
    getValue: ({ pallets, palletsShipped }) => (
      <ty.BodyText>{pallets.totalCount - palletsShipped}</ty.BodyText>
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
          handleChange({ ...rest, notes1: e.target.value });
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
