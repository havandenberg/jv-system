import styled from '@emotion/styled';
import { add } from 'date-fns';
import { mergeDeepLeft, omit } from 'ramda';

import { LabelInfo } from 'components/column-label';
import DateTimePicker from 'components/date-time-picker';
import { DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE } from 'components/directory/shippers/data-utils';
import EditableCell from 'components/editable-cell';
import { SORT_ORDER } from 'hooks/use-columns';
import { Pallet, Shipper, Unpaid, Vessel, VesselControl } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatShortDate } from 'utils/date';

import { emptyUnpaid, palletSearchText } from '../unpaids/data-utils';
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

export type VesselControlItem = VesselControl & {
  groupedPallets: {
    [key: string]: {
      [key: string]: {
        pallets: Pallet[];
        unpaid: Unpaid & { orderId: string };
      };
    };
  };
  palletsReceived: number;
  palletsShipped: number;
};

export type VesselControlLabelInfo = LabelInfo<VesselControlItem>;

export type UnpaidItem = Unpaid & { orderId: string };

export const listLabels: (
  handleChange: (updatedItem: VesselControlItem) => void,
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
    getValue: ({ palletsReceived }) => (
      <ty.BodyText>{palletsReceived || '-'}</ty.BodyText>
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
    getValue: ({ palletsReceived, palletsShipped }) => (
      <ty.BodyText>{palletsReceived - palletsShipped}</ty.BodyText>
    ),
  },
  {
    key: 'unpaids',
    label: 'Unpaids:',
    getValue: (data) => (
      <UnpaidsManager handleChange={handleChange} vesselControlItem={data} />
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

export const buildVesselControlItems = (
  vesselControls: VesselControl[],
  searchArray?: string[],
) =>
  vesselControls
    .map((vesselControl) => {
      const pallets = ((vesselControl.pallets?.nodes || []) as Pallet[]).filter(
        (p) => {
          const searchText = palletSearchText(
            p,
            vesselControl.vessel as Vessel,
            vesselControl.shipper as Shipper,
          );
          return (
            !searchArray ||
            searchArray.every((searchVal) =>
              searchText.toLowerCase().includes(searchVal.toLowerCase()),
            )
          );
        },
      );

      if (pallets.length === 0) {
        return null;
      }

      const groupedPallets = pallets.reduce((acc, pallet) => {
        const newValues = pallet.invoiceHeaders.nodes?.reduce(
          (acc2, invoice) => {
            const salesUserCode = invoice?.salesUserCode || 'UNK';
            const orderId = invoice?.orderId || 'UNK';
            const info = acc2[salesUserCode]?.[orderId] || { pallets: [] };
            const accInfo =
              info.pallets.length > 0
                ? { pallets: [] }
                : acc[salesUserCode]?.[orderId] || { pallets: [] };
            const currentUnpaid = vesselControl.unpaids.nodes?.find(
              (unpaid) => unpaid && unpaid.invoiceId === invoice?.invoiceId,
            );
            return {
              ...acc2,
              [salesUserCode]: {
                ...acc2[salesUserCode],
                [orderId]: {
                  pallets: [...accInfo.pallets, ...info.pallets, pallet],
                  unpaid:
                    info.unpaid ||
                    (currentUnpaid
                      ? {
                          ...currentUnpaid,
                          orderId: invoice?.orderId,
                          invoice,
                          shipper: vesselControl.shipper,
                          vessel: vesselControl.vessel,
                        }
                      : {
                          ...emptyUnpaid,
                          vesselCode: vesselControl.vessel?.vesselCode,
                          shipperId: vesselControl.shipper?.id,
                          invoiceId: invoice?.invoiceId,
                          orderId: invoice?.orderId,
                          invoice,
                          shipper: vesselControl.shipper,
                          vessel: vesselControl.vessel,
                        }),
                },
              },
            };
          },
          {} as {
            [key: string]: {
              [key: string]: { pallets: Pallet[]; unpaid: Unpaid };
            };
          },
        );

        return mergeDeepLeft(newValues, acc) as {
          [key: string]: {
            [key: string]: { pallets: Pallet[]; unpaid: Unpaid };
          };
        };
      }, {} as { [key: string]: { [key: string]: { pallets: Pallet[]; unpaid: Unpaid } } });

      const palletsShipped = pallets.filter((pallet) => pallet.shipped).length;

      return {
        ...omit(['nodeId'], vesselControl),
        groupedPallets,
        palletsReceived: pallets.length,
        palletsShipped,
        id: vesselControl.id === '0' ? undefined : vesselControl.id,
      };
    })
    .filter((vc) => !!vc) as VesselControlItem[];
