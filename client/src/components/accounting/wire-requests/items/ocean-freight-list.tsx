import React from 'react';
import { isEmpty, uniq } from 'ramda';

import AddItem from 'components/add-item';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import {
  InventoryItem,
  Shipper,
  Vessel,
  WireRequestOceanFreightItem,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { oceanFreightItemLabels } from '../data-utils';

const gridTemplateColumns = (editing: boolean) =>
  `repeat(2, 1fr) 0.7fr 100px 110px ${editing ? '150px' : '100px'}`;

const OceanFreightItemList = ({
  disableAdd,
  editing,
  handleAdd,
  handleChange,
  handleRemove,
  items,
  itemChanges,
  saveAttempt,
  vessels,
  shippers,
}: {
  disableAdd: boolean;
  editing: boolean;
  handleAdd: () => void;
  handleChange: (updatedItem: WireRequestOceanFreightItem) => void;
  handleRemove: (itemId: number | string) => void;
  items?: WireRequestOceanFreightItem[];
  itemChanges: WireRequestOceanFreightItem[];
  saveAttempt: boolean;
  vessels: Vessel[];
  shippers: Shipper[];
}) => {
  const [{ sortBy = 'vesselCode', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const listLabels = oceanFreightItemLabels(vessels, shippers, editing, false);

  const columnLabels = useColumns<WireRequestOceanFreightItem>(
    'vesselCode',
    SORT_ORDER.ASC,
    listLabels,
    'accounting',
    'wire_request_ocean_freight_item',
  );

  const allItems = editing
    ? itemChanges
    : getSortedItems(listLabels, items || [], sortBy, sortOrder);

  const handleItemChange =
    (itemId: number) =>
    (field: keyof WireRequestOceanFreightItem, value: any) => {
      const itemChange = itemChanges?.find(({ id }) => id === itemId);
      const updatedItem = itemChange && {
        ...itemChange,
        [field]: value,
      };
      updatedItem && handleChange(updatedItem);
    };

  const handleItemRemove = (id: number) => () => {
    handleRemove(id);
  };

  return (
    <>
      <l.Grid
        gridTemplateColumns={gridTemplateColumns(editing)}
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

            const vessel = vessels?.find(
              (v) => v.vesselCode === itemChange?.vesselCode,
            );
            const vesselShipperIds = uniq(
              ((vessel?.inventoryItems?.nodes || []) as InventoryItem[]).map(
                (item) => item.shipper?.id,
              ) || [],
            ).filter((s) => !!s);

            const filteredShippers = itemChange?.vesselCode
              ? shippers?.filter((s) => vesselShipperIds.includes(s.id))
              : shippers;

            const filteredVessels =
              itemChange?.vesselCode || !itemChange?.shipperId
                ? vessels
                : vessels?.filter((v) =>
                    (v.inventoryItems.nodes || []).some(
                      (i) => i?.shipper?.id === itemChange?.shipperId,
                    ),
                  );

            const labels = oceanFreightItemLabels(
              filteredVessels,
              filteredShippers,
              editing,
              false,
            );

            return (
              item && (
                <ListItem<WireRequestOceanFreightItem>
                  changes={itemChange}
                  confirmRemove={item.id >= 0}
                  data={currentItem || item}
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns(editing)}
                  handleChange={handleItemChange(item.id)}
                  handleRemove={handleItemRemove(item.id)}
                  key={idx}
                  listLabels={labels}
                  showValidation={saveAttempt}
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
                header: 'No ocean freight items found',
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

export default OceanFreightItemList;
