import React from 'react';
import { sortBy, times } from 'ramda';

import ColorPicker from 'components/color-picker';
import EditableCell from 'components/editable-cell';
import Expandable from 'components/expandable';
import RemoveButton from 'components/remove-button';
import SortControl from 'components/sort-control';
import { PriceCategory, PriceProduct } from 'types';
import th from 'ui/theme';
import ty from 'ui/typography';
import l from 'ui/layout';
import { contrastColor, getRandomColor } from 'ui/utils';
import { getDateOfISOWeek, getWeekNumber, isCurrentWeek } from 'utils/date';

import { gridTemplateColumns } from '.';
import AddItem from './add-item';
import Sizes from './sizes';
import { PriceSheetProps } from './types';

interface Props extends PriceSheetProps {
  category: PriceCategory;
}

const Products = (props: Props) => {
  const {
    category,
    changeHandlers: { handleProductChange, handleEntryChange },
    editing,
    handleRemoveItem,
    handleSortChange,
    isItemCollapsed,
    newItemHandlers: { handleNewProduct, handleNewEntry },
    selectedWeekNumber,
    toggleCollapseItem,
    valueGetters: { getProductValue, getEntryValue },
  } = props;
  const items = category.priceProductsByCategoryId.nodes as PriceProduct[];

  const lastIndex = items.length - 1;
  const disableAdd =
    items[lastIndex] &&
    items[lastIndex].id < 0 &&
    !items[lastIndex].productName;

  return (
    <div>
      {items.map((product, idx) => {
        if (!product) return null;

        const productRoot = product.priceSizesByProductId.nodes.find(
          (size) => size?.sizeName === 'product-root',
        );

        const entry =
          productRoot &&
          sortBy(
            (entry) => entry && entry.entryDate,
            productRoot.priceEntriesBySizeId.nodes,
          )[0];

        const color = getProductValue(product, 'color');
        const productName = getProductValue(product, 'productName');
        const entryDescription = getEntryValue(entry, 'entryDescription');

        const textColor = contrastColor(color.value);

        return (
          <l.Div key={product.id} mb={th.spacing.md}>
            <Expandable
              disabled={editing}
              isOpen={!isItemCollapsed('products', product.id)}
              header={
                <l.Grid
                  alignCenter
                  bg={color.value}
                  borderRadius={th.borderRadii.default}
                  gridTemplateColumns={gridTemplateColumns}
                  relative
                >
                  {editing && (
                    <RemoveButton
                      confirmTitle="Confirm Remove Product"
                      confirmContent={
                        <>
                          <ty.BodyText
                            mb={th.spacing.md}
                          >{`Are you sure you want to remove product ${product.productName}?`}</ty.BodyText>
                          <ty.BodyText>
                            This will remove all attached sizes and price
                            entries for the currently selected date and all
                            future dates.
                          </ty.BodyText>
                        </>
                      }
                      handleRemove={() =>
                        handleRemoveItem(
                          'products',
                          product.id,
                          parseInt(
                            getProductValue(product, 'sortOrder').value,
                            10,
                          ),
                        )
                      }
                      shouldConfirm={product.id >= 0}
                      triggerProps={{
                        position: 'absolute',
                        left: `-${th.sizes.icon}`,
                      }}
                    />
                  )}
                  <EditableCell
                    defaultChildren={
                      <ty.CaptionText color={textColor} ml={th.spacing.sm}>
                        {productName.value}
                      </ty.CaptionText>
                    }
                    editing={editing}
                    inputProps={{
                      autoFocus: product.id < 0 && !product.productName,
                      color: textColor,
                      fontWeight: productName.dirty ? 'bold' : undefined,
                      marginLeft: th.spacing.sm,
                      paddingLeft: th.spacing.xs,
                      width: 290,
                    }}
                    onChange={(e) => {
                      const { id, categoryId, color, sortOrder } = product;
                      handleProductChange(
                        {
                          id,
                          categoryId,
                          color,
                          sortOrder,
                          productName: e.target.value,
                        },
                        'productName',
                      );
                    }}
                    value={productName.value}
                  />
                  {editing && (
                    <>
                      <l.Div position="absolute" left={313}>
                        <ColorPicker
                          color={color.value}
                          onChange={(newColor) => {
                            const {
                              id,
                              categoryId,
                              productName,
                              sortOrder,
                            } = product;
                            handleProductChange(
                              {
                                id,
                                categoryId,
                                color: newColor,
                                sortOrder,
                                productName,
                              },
                              'color',
                            );
                          }}
                        />
                      </l.Div>
                      <l.Div position="absolute" left={338}>
                        <SortControl
                          disableUp={idx === 0}
                          disableDown={idx >= items.length - 1}
                          onDown={() => {
                            handleSortChange('product', product, 'down');
                          }}
                          onUp={() => {
                            handleSortChange('product', product, 'up');
                          }}
                        />
                      </l.Div>
                    </>
                  )}
                  <EditableCell
                    defaultChildren={
                      <ty.CaptionText center color={textColor} flex={1}>
                        {entryDescription.value}
                      </ty.CaptionText>
                    }
                    editing={editing}
                    inputProps={{
                      color: textColor,
                      fontWeight: entryDescription.dirty ? 'bold' : undefined,
                      textAlign: 'center',
                    }}
                    onChange={(e) => {
                      if (entry) {
                        const { id, content, entryDate, sizeId } = entry;
                        handleEntryChange(
                          {
                            id,
                            content,
                            entryDate,
                            entryDescription: e.target.value,
                            sizeId,
                          },
                          'entryDescription',
                        );
                      } else if (productRoot) {
                        handleNewEntry({
                          id: -1,
                          entryDate: getDateOfISOWeek(selectedWeekNumber),
                          entryDescription: e.target.value,
                          content: '',
                          sizeId: productRoot.id,
                        });
                      }
                    }}
                    value={entryDescription.value}
                  />
                  {productRoot &&
                    times((i) => {
                      const data = productRoot.priceEntriesBySizeId.nodes.find(
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
                      return (
                        <EditableCell
                          defaultChildren={
                            <ty.CaptionText center color={textColor} flex={1}>
                              {content.value}
                            </ty.CaptionText>
                          }
                          editing={editing}
                          highlight={isCurrentWeek(selectedWeekNumber + i)}
                          inputProps={{
                            color: textColor,
                            fontWeight: content.dirty ? 'bold' : undefined,
                            textAlign: 'center',
                          }}
                          key={i}
                          onChange={(e) => {
                            if (data) {
                              const {
                                id,
                                entryDate,
                                entryDescription,
                                sizeId,
                              } = data;
                              handleEntryChange(
                                {
                                  id,
                                  entryDate,
                                  entryDescription,
                                  content: e.target.value,
                                  sizeId,
                                },
                                'content',
                              );
                            } else {
                              handleNewEntry({
                                id: -1,
                                entryDate: getDateOfISOWeek(
                                  selectedWeekNumber + i,
                                ),
                                entryDescription: '',
                                content: e.target.value,
                                sizeId: productRoot.id,
                              });
                            }
                          }}
                          value={content.value}
                        />
                      );
                    }, 5)}
                </l.Grid>
              }
              content={<Sizes {...props} product={product} />}
              toggleIsOpen={() => {
                toggleCollapseItem('products', product.id);
              }}
            />
          </l.Div>
        );
      })}
      {editing && category.categoryName && (
        <l.Div ml={th.spacing.md}>
          <AddItem
            disabled={disableAdd}
            onClick={() => {
              handleNewProduct({
                id: -1,
                productName: 'New Product',
                categoryId: category.id,
                color: getRandomColor(),
                sortOrder: -1,
                priceSizesByProductId: {
                  edges: [],
                  nodes: [],
                  pageInfo: { hasNextPage: false, hasPreviousPage: false },
                  totalCount: 0,
                },
              });
            }}
            text="Add product"
          />
        </l.Div>
      )}
    </div>
  );
};

export default Products;
