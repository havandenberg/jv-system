import React, { useEffect } from 'react';
import { isEmpty, uniq, uniqBy } from 'ramda';

import api from 'api';
import AddItem from 'components/add-item';
import { getSortedItems } from 'components/column-label';
import ListItem, { ListItemProps } from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import { useSortQueryParams } from 'hooks/use-query-params';
import {
  InventoryItem,
  InvoiceItem,
  Pallet,
  ProductSpecies,
  Shipper,
  ShipperAdvance,
  Vessel,
  WireRequestShipperAdvanceItem,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { shipperAdvanceItemLabels } from '../data-utils';

const ShipperAdvanceItem = ({
  handleUpdateData,
  shipperId,
  vessels,
  ...props
}: ListItemProps<WireRequestShipperAdvanceItem> & {
  handleUpdateData: (updatedItem: Vessel) => void;
  shipperId: string;
  vessels: Vessel[];
}) => {
  const { data, loading } = api.useVessel(props.data?.vesselCode, false);
  const previousLoading = usePrevious(loading);
  const vesselDetails = data?.nodes?.[0];

  const billsOfLading = uniq(
    (
      (vesselDetails?.inventoryItems?.nodes?.filter(
        (ii) => ii?.shipper?.id === shipperId,
      ) || []) as InventoryItem[]
    )
      .map((ii) =>
        ((ii?.pallets.nodes || []) as Pallet[])
          .map((p) => ({ id: p?.billOfLading || '' }))
          .flat(),
      )
      .flat(),
  );

  const speciesList = (uniqBy(
    (ii) => ii.shipper?.id,
    (vesselDetails?.inventoryItems?.nodes?.filter(
      (ii) =>
        ii?.shipper?.id === shipperId &&
        (!props.changes?.billOfLading ||
          (ii.pallets?.nodes || []).some(
            (p) => p?.billOfLading === props.changes?.billOfLading,
          )),
    ) || []) as InventoryItem[],
  ).map((ii) => ii?.product?.species) || []) as ProductSpecies[];

  const pallets = (
    (vesselDetails?.inventoryItems?.nodes?.filter(
      (ii) =>
        ii?.shipper?.id === shipperId &&
        (!props.changes?.billOfLading ||
          (ii.pallets?.nodes || []).some(
            (p) => p?.billOfLading === props.changes?.billOfLading,
          )) &&
        (!props.changes?.speciesId ||
          ii?.product?.species?.id === props.changes?.speciesId),
    ) || []) as InventoryItem[]
  )
    .map((ii) => (ii?.pallets?.nodes || []) as Pallet[])
    .flat();

  const boxCount = pallets.reduce(
    (acc, { invoiceItems }) =>
      acc +
      ((invoiceItems.nodes || []) as InvoiceItem[]).reduce(
        (acc, { pickedQty }) => acc + (pickedQty ? parseInt(pickedQty, 10) : 0),
        0,
      ),
    0,
  );

  const itemTotal = (props.changes?.boxAmount || 0) * boxCount;

  const listLabels = shipperAdvanceItemLabels(
    vessels,
    speciesList,
    billsOfLading,
    !!props.editing,
    loading,
    boxCount,
    itemTotal,
  );

  useEffect(() => {
    if (!loading && previousLoading && vesselDetails) {
      handleUpdateData(vesselDetails);
    }
  }, [handleUpdateData, loading, previousLoading, vesselDetails]);

  return (
    <ListItem<WireRequestShipperAdvanceItem>
      {...props}
      listLabels={listLabels}
    />
  );
};

const gridTemplateColumns = 'repeat(3, 1fr) 1fr 1fr 1fr';

const ShipperAdvanceItemList = ({
  disableAdd,
  editing,
  handleAdd,
  handleChange,
  handleRemove,
  handleUpdateData,
  items,
  itemChanges,
  loading,
  saveAttempt,
  shipper,
  vessels,
  speciesList,
}: {
  disableAdd: boolean;
  editing: boolean;
  handleAdd: () => void;
  handleChange: (updatedItem: WireRequestShipperAdvanceItem) => void;
  handleRemove: (itemId: number | string) => void;
  handleUpdateData: (updatedItem: Vessel) => void;
  items?: WireRequestShipperAdvanceItem[];
  itemChanges: WireRequestShipperAdvanceItem[];
  loading: boolean;
  saveAttempt: boolean;
  shipper?: Shipper;
  vessels: Vessel[];
  speciesList: ProductSpecies[];
}) => {
  const [{ sortBy = 'vesselCode', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const listLabels = shipperAdvanceItemLabels(
    vessels,
    [],
    speciesList,
    editing,
  );

  const columnLabels = useColumns<WireRequestShipperAdvanceItem>(
    'vesselCode',
    SORT_ORDER.ASC,
    listLabels,
    'accounting',
    'wire_request_shipper_advance_item',
  );

  const allItems = editing
    ? itemChanges
    : getSortedItems(listLabels, items || [], sortBy, sortOrder);

  const handleItemChange =
    (itemId: number) =>
    (field: keyof WireRequestShipperAdvanceItem, value: any) => {
      const itemChange = itemChanges?.find(({ id }) => id === itemId);
      const updatedItem = itemChange && {
        ...itemChange,
        [field]: value,
      };

      const species =
        field === 'speciesId' && speciesList.find(({ id }) => id === value);

      if (updatedItem && species) {
        updatedItem.boxAmount =
          ((shipper?.shipperAdvances.nodes || []) as ShipperAdvance[]).find(
            (a) => a.speciesId === value,
          )?.advanceAmount || undefined;
      }

      updatedItem && handleChange(updatedItem);
    };

  const handleItemRemove = (id: number) => () => {
    handleRemove(id);
  };

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        ml={editing ? th.sizes.icon : undefined}
        pl={th.spacing.sm}
      >
        {columnLabels}
      </l.Grid>
      {!isEmpty(allItems)
        ? allItems.map((item, idx) => {
            const itemChange = itemChanges?.find(({ id }) => id === item.id);
            const currentItem = items?.find(({ id }) => id === item.id);

            return (
              item && (
                <ShipperAdvanceItem
                  changes={itemChange}
                  confirmRemove={item.id >= 0}
                  data={currentItem || item}
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns}
                  handleChange={handleItemChange(item.id)}
                  handleRemove={handleItemRemove(item.id)}
                  handleUpdateData={handleUpdateData}
                  key={idx}
                  listLabels={listLabels}
                  showValidation={saveAttempt}
                  shipperId={shipper?.id || ''}
                  vessels={vessels}
                />
              )
            );
          })
        : !editing && (
            <DataMessage
              data={items || []}
              error={null}
              loading={false}
              emptyProps={{
                header: 'No shipper advance items found',
              }}
            />
          )}
      {editing && (
        <l.Div ml={th.spacing.md} mt={th.spacing.md}>
          <AddItem disabled={disableAdd} onClick={handleAdd} text="Add item" />
        </l.Div>
      )}
    </>
  );
};

export default ShipperAdvanceItemList;
