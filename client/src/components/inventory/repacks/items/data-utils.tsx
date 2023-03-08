import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { RepackItem } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';

export type RepackItemLabelInfo = LabelInfo<RepackItem>;

export const listLabels: RepackItemLabelInfo[] = [
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'palletId',
    label: 'Original Pallet ID',
    sortable: true,
    getValue: ({ palletId }) =>
      palletId ? (
        <ty.LinkText hover={false} to={`/inventory/pallets/${palletId}`}>
          {palletId}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'newPalletId',
    label: 'New Pallet ID',
    getValue: ({ newPalletId }) => (
      <ty.BodyText>{newPalletId || '-'}</ty.BodyText>
    ),
  },
  {
    key: 'pallet',
    label: 'Vessel',
    getValue: ({ pallet }) =>
      pallet ? (
        <ty.LinkText
          hover="false"
          to={`/inventory/vessels/${pallet.vesselCode}`}
        >
          {pallet.vesselCode}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'pallet',
    label: 'Shipper',
    getValue: ({ pallet }) =>
      pallet ? (
        <ty.LinkText
          hover="false"
          to={`/directory/shippers/${pallet.shipper?.id}`}
        >
          {pallet.shipper?.shipperName}
        </ty.LinkText>
      ) : (
        <ty.BodyText>-</ty.BodyText>
      ),
  },
  {
    key: 'boxesIn',
    label: 'Boxes In',
    getValue: ({ boxesIn }) => <ty.BodyText>{boxesIn}</ty.BodyText>,
  },
  {
    key: 'boxesOut',
    label: 'Boxes Out',
    getValue: ({ boxesOut }) => <ty.BodyText>{boxesOut}</ty.BodyText>,
  },
  {
    key: 'boxesIn',
    label: 'Out/In',
    sortable: true,
    sortKey: 'boxesRatio',
    customSortBy: ({ boxesIn, boxesOut }) =>
      parseInt(boxesOut, 10) / parseInt(boxesIn, 10),
    getValue: ({ boxesIn, boxesOut }) => {
      const boxesInNum = parseInt(boxesIn, 10);
      const boxesOutNum = parseInt(boxesOut, 10);
      const boxRatio = boxesInNum && boxesOutNum ? boxesOutNum / boxesInNum : 0;
      const isLoss = boxRatio < 1;
      const isGain = boxRatio > 1;
      return (
        <ty.BodyText
          color={
            isLoss
              ? th.colors.status.errorAlt
              : isGain
              ? th.colors.status.success
              : undefined
          }
        >
          {boxRatio ? (boxRatio * 100).toFixed(1) + ' %' : '-'}
        </ty.BodyText>
      );
    },
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];
