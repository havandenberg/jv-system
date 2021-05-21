import React from 'react';
import { sortBy, times } from 'ramda';

import EditableCell from 'components/editable-cell';
import RemoveButton from 'components/remove-button';
import { PriceProduct, PriceSize } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';
import l from 'ui/layout';
import { getDateOfISOWeek, getWeekNumber, isCurrentWeek } from 'utils/date';

import { gridTemplateColumns } from '.';
import AddItem from '../../add-item';
import { PriceSheetProps } from './types';
import SortControl from 'components/sort-control';

interface Props extends PriceSheetProps {
  product: PriceProduct;
}

const Sizes = (props: Props) => {
  const {
    changeHandlers: { handleSizeChange, handleEntryChange },
    editing,
    handleRemoveItem,
    handleSortChange,
    newItemHandlers: { handleNewSize, handleNewEntry },
    product,
    selectedWeekNumber,
    valueGetters: { getSizeValue, getEntryValue },
  } = props;
  const items = product.priceSizesByProductId.nodes as PriceSize[];

  const lastIndex = items.length - 1;
  const disableAdd =
    items[lastIndex] && items[lastIndex].id < 0 && !items[lastIndex].sizeName;

  return (
    <div>
      {items.map((size, idx) => {
        if (!size) return null;

        const entry = sortBy(
          (entry) => entry && entry.entryDate,
          size.priceEntriesBySizeId.nodes,
        )[0];

        const entryDescription = getEntryValue(entry, 'entryDescription');
        const entryContent = getEntryValue(entry, 'content');
        const sizeName = getSizeValue(size, 'sizeName');

        return (
          size.sizeName !== 'product-root' && (
            <l.Grid
              alignCenter
              gridTemplateColumns={gridTemplateColumns}
              key={size.id}
              ml={th.sizes.icon}
              relative
            >
              {editing && (
                <RemoveButton
                  confirmTitle="Confirm Remove Size"
                  confirmContent={
                    <>
                      <ty.BodyText
                        mb={th.spacing.md}
                      >{`Are you sure you want to remove size ${size.sizeName}?`}</ty.BodyText>
                      <ty.BodyText>
                        This will remove all attached price entries for the
                        currently selected date and all future dates.
                      </ty.BodyText>
                    </>
                  }
                  handleRemove={() => handleRemoveItem('sizes', size.id, -1)}
                  shouldConfirm={size.id >= 0}
                  triggerProps={{
                    position: 'absolute',
                    left: `-${th.sizes.xs}`,
                  }}
                />
              )}
              <EditableCell
                content={entryDescription}
                defaultChildren={
                  <ty.SmallText pl={th.spacing.sm}>
                    {entryDescription.value}
                  </ty.SmallText>
                }
                editing={editing}
                inputProps={{
                  fontWeight: entryDescription.dirty ? 'bold' : undefined,
                  marginLeft: th.spacing.sm,
                  paddingLeft: th.spacing.xs,
                  width: 256,
                }}
                onChange={(e) => {
                  if (entry) {
                    handleEntryChange({
                      id: entry.id,
                      content: entryContent.value,
                      entryDate: entry.entryDate,
                      entryDescription: e.target.value,
                      highlight: entry.highlight,
                      sizeId: entry.sizeId,
                    });
                  } else {
                    handleNewEntry({
                      id: -1,
                      content: '',
                      entryDate: getDateOfISOWeek(selectedWeekNumber),
                      entryDescription: e.target.value,
                      highlight: false,
                      sizeId: size.id,
                    });
                  }
                }}
              />
              {editing && (
                <l.Div position="absolute" left={280}>
                  <SortControl
                    disableUp={idx <= 1}
                    disableDown={idx >= items.length - 1}
                    onDown={() => {
                      handleSortChange(
                        'size',
                        size,
                        'down',
                        product.categoryId,
                      );
                    }}
                    onUp={() => {
                      handleSortChange('size', size, 'up', product.categoryId);
                    }}
                  />
                </l.Div>
              )}
              <EditableCell
                content={sizeName}
                defaultChildren={
                  <ty.SmallText center flex={1}>
                    {sizeName.value}
                  </ty.SmallText>
                }
                editing={editing}
                inputProps={{
                  autoFocus: size.id < 0 && !size.sizeName,
                  fontWeight: sizeName.dirty ? 'bold' : undefined,
                  textAlign: 'center',
                }}
                onChange={(e) => {
                  const { id, productId, sortOrder } = size;
                  handleSizeChange({
                    id,
                    productId,
                    sizeName: e.target.value,
                    sortOrder,
                  });
                }}
              />
              {times((i) => {
                const data = size.priceEntriesBySizeId.nodes.find(
                  (e) =>
                    e &&
                    getWeekNumber(
                      typeof e.entryDate === 'string'
                        ? new Date(e.entryDate.replace(/-/g, '/'))
                        : e.entryDate,
                    ) ===
                      selectedWeekNumber + i,
                );
                const content = getEntryValue(data, 'content');
                const highlight = getEntryValue(data, 'highlight');
                return (
                  <EditableCell
                    content={content}
                    defaultChildren={
                      <ty.SmallText center flex={1}>
                        {content.value || '-'}
                      </ty.SmallText>
                    }
                    editing={editing}
                    handleHighlight={
                      data
                        ? () => {
                            handleEntryChange({
                              id: data.id,
                              content: content.value,
                              entryDate: data.entryDate,
                              entryDescription: data.entryDescription,
                              highlight: !Boolean(highlight.value),
                              sizeId: data.sizeId,
                            });
                          }
                        : undefined
                    }
                    highlight={Boolean(highlight.value)}
                    secondaryHighlight={isCurrentWeek(selectedWeekNumber + i)}
                    inputProps={{
                      fontWeight: content.dirty ? 'bold' : undefined,
                      textAlign: 'center',
                    }}
                    key={i}
                    onChange={(e) => {
                      if (data) {
                        handleEntryChange({
                          id: data.id,
                          content: e.target.value,
                          entryDate: data.entryDate,
                          entryDescription: data.entryDescription,
                          highlight: e.target.value
                            ? e.target.value !== content.value
                            : false,
                          sizeId: data.sizeId,
                        });
                      } else {
                        handleNewEntry({
                          id: -1,
                          content: e.target.value,
                          highlight: true,
                          entryDate: getDateOfISOWeek(selectedWeekNumber + i),
                          entryDescription: '',
                          sizeId: size.id,
                        });
                      }
                    }}
                  />
                );
              }, 5)}
            </l.Grid>
          )
        );
      })}
      {editing && (
        <l.Div ml={th.spacing.lg}>
          <AddItem
            disabled={disableAdd}
            onClick={() =>
              handleNewSize(
                {
                  id: -1,
                  sizeName: 'New Size',
                  sortOrder: -1,
                  productId: product.id,
                  priceEntriesBySizeId: {
                    edges: [],
                    nodes: [],
                    pageInfo: { hasNextPage: false, hasPreviousPage: false },
                    totalCount: 0,
                  },
                },
                product,
              )
            }
            text="Add size"
          />
        </l.Div>
      )}
    </div>
  );
};

export default Sizes;
