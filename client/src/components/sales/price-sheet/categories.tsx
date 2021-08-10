import React from 'react';

import EditableCell from 'components/editable-cell';
import Expandable from 'components/expandable';
import { BasicModal } from 'components/modal';
import SortControl from 'components/sort-control';
import { PriceCategory } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import AddItem from '../../add-item';
import Products from './products';
import { PriceSheetProps } from './types';

interface Props extends PriceSheetProps {
  items: PriceCategory[];
}

const Categories = (props: Props) => {
  const {
    changeHandlers: { handleCategoryChange },
    editing,
    handleRemoveItem,
    handleSortChange,
    items,
    isItemCollapsed,
    newItemHandlers: { handleNewCategory },
    toggleCollapseItem,
    valueGetters: { getCategoryValue },
  } = props;

  return (
    <l.Div mb={items.length > 0 ? th.spacing.xxxl : 0}>
      {items.map((category, idx) => {
        const categoryName = getCategoryValue(category, 'categoryName');
        return (
          <l.Div key={category.id} mb={th.spacing.lg}>
            <Expandable
              disabled={editing}
              isOpen={!isItemCollapsed('categories', category.id)}
              header={
                <l.Flex alignCenter relative>
                  {editing && (
                    <BasicModal
                      title="Confirm Remove Category"
                      content={
                        <>
                          <ty.BodyText
                            mb={th.spacing.md}
                          >{`Are you sure you want to remove category "${category.categoryName}"?`}</ty.BodyText>
                          <ty.BodyText>
                            This will remove all attached products, sizes, and
                            price entries for the currently selected date and
                            all future dates.
                          </ty.BodyText>
                        </>
                      }
                      handleConfirm={() =>
                        handleRemoveItem('categories', category.id)
                      }
                      shouldConfirm={category.id >= 0}
                      triggerStyles={{
                        position: 'absolute',
                        left: `-${th.sizes.icon}`,
                      }}
                      triggerType="remove-icon"
                    />
                  )}
                  <EditableCell
                    content={categoryName}
                    defaultChildren={
                      <ty.BodyText bold ml={`-${th.spacing.tn}`}>
                        {categoryName.value}
                      </ty.BodyText>
                    }
                    editing={editing}
                    inputProps={{
                      autoFocus: category.id < 0 && !category.categoryName,
                      paddingLeft: th.spacing.xs,
                      width: 200,
                    }}
                    onChange={(e) =>
                      handleCategoryChange({
                        id: category.id,
                        sortOrder: category.sortOrder,
                        categoryName: e.target.value,
                      })
                    }
                  />
                  {editing && (
                    <l.Div position="absolute" left={280}>
                      <SortControl
                        disableUp={idx === 0}
                        disableDown={idx >= items.length - 1}
                        onDown={() => {
                          handleSortChange('category', category, 'down');
                        }}
                        onUp={() => {
                          handleSortChange('category', category, 'up');
                        }}
                      />
                    </l.Div>
                  )}
                </l.Flex>
              }
              content={<Products {...props} category={category} />}
              toggleIsOpen={() => {
                toggleCollapseItem('categories', category.id);
              }}
            />
          </l.Div>
        );
      })}
      {editing && (
        <l.Div ml={th.spacing.sm}>
          <AddItem
            onClick={() =>
              handleNewCategory({
                id: -1,
                categoryName: 'New Category',
                sortOrder: -1,
                priceProductsByCategoryId: {
                  edges: [],
                  nodes: [],
                  pageInfo: { hasNextPage: false, hasPreviousPage: false },
                  totalCount: 0,
                },
              })
            }
            text="Add category"
          />
        </l.Div>
      )}
    </l.Div>
  );
};

export default Categories;
