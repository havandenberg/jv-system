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
import AddItem from '../../add-item';
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
        ) || {
          id: -1,
          sizeName: 'product-root',
          productId: product.id,
          priceEntriesBySizeId: {
            edges: [],
            nodes: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
            totalCount: 0,
          },
        };

        const entry =
          productRoot &&
          sortBy(
            (entry) => entry && entry.entryDate,
            productRoot.priceEntriesBySizeId.nodes,
          )[0];

        const color = getProductValue(product, 'color');
        const productName = getProductValue(product, 'productName');
        const entryDescription = getEntryValue(entry, 'entryDescription');
        const content = getEntryValue(entry, 'content');

        const textColor = contrastColor(color.value);

        return (
          <l.Div key={product.id} mt={th.spacing.sm}>
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
                  <EditableCell
                    content={productName}
                    defaultChildren={
                      <ty.SmallText color={textColor} ml={th.spacing.sm}>
                        {productName.value}
                      </ty.SmallText>
                    }
                    editing={editing}
                    inputProps={{
                      autoFocus: product.id < 0 && !product.productName,
                      color: textColor,
                      fontWeight: productName.dirty ? 'bold' : undefined,
                      marginLeft: th.spacing.sm,
                      paddingLeft: th.spacing.xs,
                      width: 232,
                    }}
                    onChange={(e) => {
                      const { id, categoryId, color, sortOrder } = product;
                      handleProductChange({
                        id,
                        categoryId,
                        color,
                        sortOrder,
                        productName: e.target.value,
                      });
                    }}
                  />
                  {editing && (
                    <>
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
                      <l.Div position="absolute" left={255}>
                        <ColorPicker
                          activeColor={color.value}
                          color={textColor}
                          onChange={(newColor) => {
                            const { id, categoryId, productName, sortOrder } =
                              product;
                            handleProductChange({
                              id,
                              categoryId,
                              color: newColor,
                              sortOrder,
                              productName,
                            });
                          }}
                        />
                      </l.Div>
                      <l.Div position="absolute" left={280}>
                        <SortControl
                          color={textColor}
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
                    content={entryDescription}
                    defaultChildren={
                      <ty.SmallText center color={textColor} flex={1}>
                        {entryDescription.value}
                      </ty.SmallText>
                    }
                    editing={editing}
                    inputProps={{
                      color: textColor,
                      fontWeight: entryDescription.dirty ? 'bold' : undefined,
                      textAlign: 'center',
                    }}
                    onChange={(e) => {
                      if (entry) {
                        handleEntryChange({
                          id: entry.id,
                          content: content.value,
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
                          sizeId: product.productRootId,
                        });
                      }
                    }}
                  />
                  {times((i) => {
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
                        content={content}
                        defaultChildren={
                          <ty.SmallText center color={textColor} flex={1}>
                            {content.value}
                          </ty.SmallText>
                        }
                        editing={editing}
                        secondaryHighlight={isCurrentWeek(
                          selectedWeekNumber + i,
                        )}
                        inputProps={{
                          color: textColor,
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
                              entryDescription: entryDescription.value,
                              highlight: data.highlight,
                              sizeId: data.sizeId,
                            });
                          } else {
                            handleNewEntry({
                              id: -1,
                              content: e.target.value,
                              entryDate: getDateOfISOWeek(
                                selectedWeekNumber + i,
                              ),
                              entryDescription: '',
                              highlight: false,
                              sizeId: product.productRootId,
                            });
                          }
                        }}
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
      {editing && (
        <l.Div ml={th.spacing.md}>
          <AddItem
            disabled={disableAdd}
            onClick={() => {
              handleNewProduct(
                {
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
                },
                category,
              );
            }}
            text="Add product"
          />
        </l.Div>
      )}
    </div>
  );
};

export default Products;
