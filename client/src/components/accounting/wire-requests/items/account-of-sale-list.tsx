import React from 'react';
import { isEmpty } from 'ramda';

import AddItem from 'components/add-item';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { Vessel, WireRequestAccountOfSaleItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { accountOfSaleItemLabels } from '../data-utils';

const gridTemplateColumns = 'repeat(3, 1fr) 2fr 1fr';

const AccountOfSaleItemList = ({
  disableAdd,
  editing,
  handleAdd,
  handleChange,
  handleRemove,
  items,
  itemChanges,
  saveAttempt,
  vessels,
}: {
  disableAdd: boolean;
  editing: boolean;
  handleAdd: () => void;
  handleChange: (updatedItem: WireRequestAccountOfSaleItem) => void;
  handleRemove: (itemId: number | string) => void;
  items?: WireRequestAccountOfSaleItem[];
  itemChanges: WireRequestAccountOfSaleItem[];
  saveAttempt: boolean;
  vessels: Vessel[];
}) => {
  const [{ sortBy = 'billOfLading', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const listLabels = accountOfSaleItemLabels(vessels, editing);

  const columnLabels = useColumns<WireRequestAccountOfSaleItem>(
    'billOfLading',
    SORT_ORDER.ASC,
    listLabels,
    'accounting',
    'wire_request_account_of_sale_item',
  );

  const allItems = editing
    ? itemChanges
    : getSortedItems(listLabels, items || [], sortBy, sortOrder);

  const handleItemChange =
    (itemId: number) =>
    (field: keyof WireRequestAccountOfSaleItem, value: any) => {
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
                <ListItem<WireRequestAccountOfSaleItem>
                  changes={itemChange}
                  confirmRemove={item.id >= 0}
                  data={currentItem || item}
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns}
                  handleChange={handleItemChange(item.id)}
                  handleRemove={handleItemRemove(item.id)}
                  key={idx}
                  listLabels={listLabels}
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
                header: 'No account of sale items found',
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

export default AccountOfSaleItemList;
