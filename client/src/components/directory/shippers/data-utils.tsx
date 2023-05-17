import { omit, pluck } from 'ramda';

import { LabelInfo } from 'components/column-label';
import { SORT_ORDER } from 'hooks/use-columns';
import { ProductSpecies, Shipper, ShipperAdvance } from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import th from 'ui/theme';
import ty from 'ui/typography';
import { formatCurrency } from 'utils/format';

export const DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE = 45;

export type ShipperLabelInfo = LabelInfo<Shipper>;

export const listLabels: ShipperLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'shipperName',
    label: 'Shipper Name',
    sortable: true,
  },
  {
    defaultSortOrder: SORT_ORDER.ASC,
    key: 'countryId',
    label: 'Country',
    filterPanelProps: { columnCount: 3 },
    filterable: true,
    sortable: true,
    getValue: (data) =>
      data.country ? (
        <ty.BodyText>{data.country?.countryName}</ty.BodyText>
      ) : (
        ''
      ),
  },
  {
    key: 'groupId',
    label: 'Group ID',
  },
];

export const baseLabels: ShipperLabelInfo[] = [
  {
    key: 'id',
    label: 'ID',
    readOnly: true,
  },
  {
    key: 'shipperName',
    label: 'Shipper Name',
    readOnly: true,
  },
  {
    key: 'countryId',
    label: 'Country',
    getValue: (data) =>
      data.country ? (
        <ty.BodyText>{data.country?.countryName}</ty.BodyText>
      ) : (
        ''
      ),
    readOnly: true,
  },
  {
    key: 'groupId',
    label: 'Group ID',
    readOnly: true,
  },
  {
    key: 'vendor',
    label: 'Vendor',
    getValue: ({ vendor }) =>
      vendor ? (
        <ty.LinkText hover="false" to={`/directory/vendors/${vendor.id}`}>
          {vendor.id}
        </ty.LinkText>
      ) : (
        '-'
      ),
    readOnly: true,
  },
  {
    key: 'commissionRate',
    label: 'Commission (%)',
  },
  {
    key: 'sendProjectionRequest',
    label: 'Send Projection Request',
    isBoolean: true,
    getValue: (data) => (
      <LineItemCheckbox
        checked={!!data.sendProjectionRequest}
        disabled
        onChange={() => ({})}
      />
    ),
  },
  {
    key: 'projectionRequestStartDate',
    label: 'Projections Start Date',
    isDate: true,
  },
  {
    key: 'projectionRequestEndDate',
    label: 'Projections End Date',
    isDate: true,
  },
  {
    key: 'vesselControlDaysUntilDue',
    label: 'Vessel Control Days Until Due',
    getValue: ({ vesselControlDaysUntilDue }) => (
      <ty.BodyText
        disabled={
          !vesselControlDaysUntilDue ||
          vesselControlDaysUntilDue === DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE
        }
      >
        {vesselControlDaysUntilDue || DEFAULT_VESSEL_CONTROL_DAYS_UNTIL_DUE}
      </ty.BodyText>
    ),
    validate: ({ vesselControlDaysUntilDue }) =>
      !vesselControlDaysUntilDue || !isNaN(Number(vesselControlDaysUntilDue)),
  },
  {
    key: 'psaShipperId',
    label: 'PSA Shipper ID',
  },
  {
    key: 'notes',
    label: 'Notes',
  },
];

export type ShipperAdvanceLabelInfo = LabelInfo<ShipperAdvance>;

export const advanceListLabels: (
  editing: boolean,
  speciesList: ProductSpecies[],
) => ShipperAdvanceLabelInfo[] = (editing, speciesList) => [
  {
    key: 'speciesId',
    label: 'Species',
    allowOverflow: editing,
    itemSelectorQueryProps: {
      customOptions: speciesList,
      customSearchKeys: ['id', 'speciesDescription'],
      errorLabel: 'species',
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
      !!speciesId &&
      !!speciesList.find((s) => s.id === speciesId),
  },
  {
    key: 'advanceAmount',
    label: 'Advance Amt / Box',
    getValue: ({ advanceAmount }) => (
      <ty.BodyText mr={th.spacing.lg} textAlign="right">
        {formatCurrency(parseFloat(advanceAmount))}
      </ty.BodyText>
    ),
    validate: ({ advanceAmount }) => advanceAmount > 0,
    isCurrency: true,
  },
];

export const validationLabels: (
  speciesList: ProductSpecies[],
) => ShipperLabelInfo[] = (speciesList) =>
  baseLabels.concat([
    {
      key: 'shipperAdvances',
      label: 'Advances',
      validate: ({ shipperAdvances }) =>
        ((shipperAdvances.nodes || []) as ShipperAdvance[]).every(
          ({ advanceAmount, speciesId }) =>
            speciesId &&
            speciesList.find((s) => s.id === speciesId) &&
            advanceAmount > 0,
        ),
    },
  ]);

export const transformChangesOnUpdate = (
  changes: Shipper,
  advances: ShipperAdvance[],
) => ({
  ...omit(
    [
      'country',
      'personContactsByShipperPersonContactShipperIdAndPersonContactId',
      'shipperAdvances',
      'vendor',
      '__typename',
    ],
    changes,
  ),
  shipperAdvancesUsingId: {
    create: ((changes.shipperAdvances?.nodes || []) as ShipperAdvance[])
      .filter(({ id }) => id < 0)
      .map(({ id, ...rest }) => rest),
    updateById: ((changes.shipperAdvances?.nodes || []) as ShipperAdvance[])
      .filter(({ id }) => id > 0)
      .map(({ id, species, __typename, ...rest }) => ({
        patch: rest,
        id,
      })),
    deleteById: advances
      .filter(
        ({ id }) =>
          !pluck(
            'id',
            (changes.shipperAdvances?.nodes || []) as ShipperAdvance[],
          ).includes(id),
      )
      .map(({ id }) => ({ id: `${id}` })),
  },
});
