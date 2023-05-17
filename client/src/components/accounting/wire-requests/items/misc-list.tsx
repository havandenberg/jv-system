import React from 'react';
import { isEmpty } from 'ramda';

import AddItem from 'components/add-item';
import { getSortedItems } from 'components/column-label';
import ListItem from 'components/list-item';
import { DataMessage } from 'components/page/message';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useSortQueryParams } from 'hooks/use-query-params';
import { WireRequestMiscItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import { miscItemLabels } from '../data-utils';

const gridTemplateColumns = 'repeat(3, 1fr) 2fr 1fr';

const MiscItemList = ({
  disableAdd,
  editing,
  handleAdd,
  handleChange,
  handleRemove,
  items,
  itemChanges,
  saveAttempt,
}: {
  disableAdd: boolean;
  editing: boolean;
  handleAdd: () => void;
  handleChange: (updatedItem: WireRequestMiscItem) => void;
  handleRemove: (itemId: number | string) => void;
  items?: WireRequestMiscItem[];
  itemChanges: WireRequestMiscItem[];
  saveAttempt: boolean;
}) => {
  const [{ sortBy = 'itemDescription', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const columnLabels = useColumns<WireRequestMiscItem>(
    'itemDescription',
    SORT_ORDER.ASC,
    miscItemLabels,
    'accounting',
    'wire_request_misc_item',
  );

  const allItems = editing
    ? itemChanges
    : getSortedItems(miscItemLabels, items || [], sortBy, sortOrder);

  const handleItemChange =
    (itemId: number) => (field: keyof WireRequestMiscItem, value: any) => {
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
                <ListItem<WireRequestMiscItem>
                  changes={itemChange}
                  confirmRemove={item.id >= 0}
                  data={currentItem || item}
                  editing={editing}
                  gridTemplateColumns={gridTemplateColumns}
                  handleChange={handleItemChange(item.id)}
                  handleRemove={handleItemRemove(item.id)}
                  key={idx}
                  listLabels={miscItemLabels}
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
                header: 'No misc items found',
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

export default MiscItemList;
