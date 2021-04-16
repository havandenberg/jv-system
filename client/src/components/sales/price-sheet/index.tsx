import React, { Fragment, useEffect, useState } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { isEmpty, pluck } from 'ramda';
import ClipLoader from 'react-spinners/ClipLoader';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import Modal from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
import useScrollToTop from 'hooks/use-scroll-to-top';
import {
  Maybe,
  PriceCategory,
  PriceEntry,
  PriceProduct,
  PriceSize,
} from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getRandomColor } from 'ui/utils';
import { getDateOfISOWeek, getWeekNumber } from 'utils/date';

import Categories from './categories';
import Header from './header';
import {
  CategoryUpdate,
  CollapsedItems,
  EntryUpdate,
  NewCategory,
  NewEntry,
  NewProduct,
  NewSize,
  PriceSheetChanges,
  ProductUpdate,
  RemovedItems,
  SizeUpdate,
  UpdateType,
} from './types';
import { getAllItems } from './utils';

export const gridTemplateColumns = '3fr 1fr 1.3fr repeat(4, 1fr)';

const initialChangesState: PriceSheetChanges = {
  categoryUpdates: [],
  productUpdates: [],
  sizeUpdates: [],
  entryUpdates: [],
  newCategories: [],
  newProducts: [],
  newSizes: [],
  newEntries: [],
};

const initialCollapsedItemsState: CollapsedItems = {
  categories: [],
  products: [],
};

const initialRemovedItemsState: RemovedItems = {
  categories: [],
  products: [],
  sizes: [],
};

const initialNewItemNextIds = {
  category: -1,
  product: -1,
  size: -1,
  entry: -1,
};

const PriceSheet = () => {
  useScrollToTop();
  const [editing, setEditing] = useState(false);
  const { DateRangePicker, handleDateChange } = useDateRange({
    hideDefinedRanges: true,
    singleSelection: true,
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
    minDate: editing ? startOfISOWeek(new Date()) : undefined,
    showAsWeekNumber: true,
  });

  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );

  const [changes, setChanges] = useState<PriceSheetChanges>(
    initialChangesState,
  );
  const [removedItems, setRemovedItems] = useState(initialRemovedItemsState);
  const [newItemNextIds, setNewItemNextIds] = useState(initialNewItemNextIds);

  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpdate] = api.useUpdatePriceSheet();
  const [handleCreateCategory] = api.useCreatePriceCategory();
  const [handleCreateProduct] = api.useCreatePriceProduct();
  const [handleCreateSize] = api.useCreatePriceSize();
  const [handleCreateEntry] = api.useCreatePriceEntry();
  const [handleDeleteCategory] = api.useDeletePriceCategory();
  const [handleDeleteProduct] = api.useDeletePriceProduct();
  const [handleDeleteSize] = api.useDeletePriceSize();

  const getValue = <T extends UpdateType>(
    item: any,
    key: keyof T,
    changesKey: keyof PriceSheetChanges,
    defaultValue?: string,
  ) => {
    if (!item) {
      return {
        dirty: false,
        value: defaultValue || '',
      };
    }
    const items: any[] = changes[changesKey];
    const changedItem = items.find((i) => i.id === item.id);
    if (changedItem) {
      return {
        dirty: item.id < 0 || changedItem[key] !== item[key],
        value: changedItem[key],
      };
    }
    return { dirty: false, value: item[key] === undefined ? '' : item[key] };
  };

  const getCategoryValue = (
    category: Maybe<PriceCategory> | undefined,
    key: keyof CategoryUpdate,
  ) => {
    const changesKey =
      category && category.id < 0 ? 'newCategories' : 'categoryUpdates';
    return getValue(category, key, changesKey);
  };

  const getProductValue = (
    product: Maybe<PriceProduct> | undefined,
    key: keyof ProductUpdate,
  ) => {
    const changesKey =
      product && product.id < 0 ? 'newProducts' : 'productUpdates';
    return getValue(product, key, changesKey);
  };

  const getSizeValue = (
    size: Maybe<PriceSize> | undefined,
    key: keyof SizeUpdate,
  ) => {
    const changesKey = size && size.id < 0 ? 'newSizes' : 'sizeUpdates';
    return getValue(size, key, changesKey);
  };

  const getEntryValue = (
    entry: Maybe<PriceEntry> | undefined,
    key: keyof EntryUpdate,
    defaultValue?: string,
  ) => {
    const changesKey = entry && entry.id < 0 ? 'newEntries' : 'entryUpdates';
    return getValue(entry, key, changesKey, defaultValue);
  };

  const {
    data,
    loading: dataLoading,
    error: dataError,
  } = api.usePriceCategories();
  const items = data ? data.nodes : [];
  const allItems = getAllItems(
    items,
    changes,
    removedItems,
    getCategoryValue,
    getProductValue,
  );

  const [collapsedItems, setCollapsedItems] = useState(
    initialCollapsedItemsState,
  );

  const handleWeekChange = (weeks: number) => {
    const newDate = add(new Date(startDate.replace(/-/g, '/')), {
      weeks,
    });
    handleDateChange({
      selection: {
        startDate: newDate,
        endDate: newDate,
        key: 'selection',
      },
    });
  };

  const handleEdit = () => {
    handleDateChange({
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    });
    expandAllItems();
    setEditing(true);
  };

  const handleSave = () => {
    setUpdateLoading((prevLoading) => [...prevLoading, 'existing-items']);
    handleUpdate({
      variables: {
        categories: changes.categoryUpdates.map((c) => ({
          categoryName: c.categoryName,
          sortOrder: c.sortOrder,
          id: parseInt(c.id, 10),
        })),
        products: changes.productUpdates.map((p) => ({
          categoryId: p.categoryId,
          color: p.color,
          productName: p.productName,
          sortOrder: p.sortOrder,
          id: parseInt(p.id, 10),
        })),
        sizes: changes.sizeUpdates.map((s) => ({
          productId: s.productId,
          sizeName: s.sizeName,
          id: parseInt(s.id, 10),
        })),
        entries: changes.entryUpdates.map((e) => ({
          content: e.content,
          entryDate: e.entryDate,
          entryDescription: e.entryDescription,
          sizeId: e.sizeId,
          id: parseInt(e.id, 10),
        })),
      },
    }).then(() => {
      setUpdateLoading((prevLoading) =>
        prevLoading.filter((l) => l !== 'existing-items'),
      );
    });
    changes.newEntries
      .filter((e) => e.sizeId >= 0)
      .map((e) => ({
        sizeId: e.sizeId,
        content: e.content,
        entryDate: e.entryDate,
        entryDescription: e.entryDescription,
      }))
      .forEach((e, idx) => {
        setUpdateLoading((prevLoading) => [...prevLoading, `entry-${idx}`]);
        handleCreateEntry({ variables: { priceEntry: e } }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `entry-${idx}`),
          );
        });
      });
    changes.newSizes
      .filter((s) => s.productId >= 0)
      .map((s) => ({
        productId: s.productId,
        sizeName: s.sizeName,
        priceEntriesUsingId: {
          create: changes.newEntries
            .filter((e) => e.sizeId === s.id)
            .map((e) => ({
              entryDate: e.entryDate,
              entryDescription: e.entryDescription,
              content: e.content,
            })),
        },
      }))
      .forEach((s, idx) => {
        setUpdateLoading((prevLoading) => [...prevLoading, `size-${idx}`]);
        handleCreateSize({ variables: { priceSize: s } }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `size-${idx}`),
          );
        });
      });
    changes.newProducts
      .filter((p) => p.categoryId >= 0)
      .map((p) => ({
        categoryId: p.categoryId,
        color: p.color,
        productName: p.productName,
        sortOrder: p.sortOrder,
        priceSizesUsingId: {
          create: changes.newSizes
            .filter((s) => s.productId === p.id)
            .map((s) => ({
              sizeName: s.sizeName,
              priceEntriesUsingId: {
                create: changes.newEntries
                  .filter((e) => e.sizeId === s.id)
                  .map((e) => ({
                    entryDate: e.entryDate,
                    entryDescription: e.entryDescription,
                    content: e.content,
                  })),
              },
            })),
        },
      }))
      .forEach((p, idx) => {
        setUpdateLoading((prevLoading) => [...prevLoading, `product-${idx}`]);
        handleCreateProduct({ variables: { priceProduct: p } }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `product-${idx}`),
          );
        });
      });
    changes.newCategories
      .map((c) => ({
        categoryName: c.categoryName,
        sortOrder: c.sortOrder,
        priceProductsUsingId: {
          create: changes.newProducts
            .filter((p) => p.categoryId === c.id)
            .map((p) => ({
              color: p.color,
              productName: p.productName,
              sortOrder: p.sortOrder,
              priceSizesUsingId: {
                create: changes.newSizes
                  .filter((s) => s.productId === p.id)
                  .map((s) => ({
                    sizeName: s.sizeName,
                    priceEntriesUsingId: {
                      create: changes.newEntries
                        .filter((e) => e.sizeId === s.id)
                        .map((e) => ({
                          entryDate: e.entryDate,
                          entryDescription: e.entryDescription,
                          content: e.content,
                        })),
                    },
                  })),
              },
            })),
        },
      }))
      .forEach((c, idx) => {
        setUpdateLoading((prevLoading) => [...prevLoading, `category-${idx}`]);
        handleCreateCategory({ variables: { priceCategory: c } }).then(() => {
          setUpdateLoading((prevLoading) =>
            prevLoading.filter((l) => l !== `category-${idx}`),
          );
        });
      });
    removedItems.categories.forEach((id, idx) => {
      setUpdateLoading((prevLoading) => [
        ...prevLoading,
        `del-category-${idx}`,
      ]);
      handleDeleteCategory({ variables: { id } }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-category-${idx}`),
        );
      });
    });
    removedItems.products.forEach((id, idx) => {
      setUpdateLoading((prevLoading) => [...prevLoading, `del-product-${idx}`]);
      handleDeleteProduct({ variables: { id } }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-product-${idx}`),
        );
      });
    });
    removedItems.sizes.forEach((id, idx) => {
      setUpdateLoading((prevLoading) => [...prevLoading, `del-size-${idx}`]);
      handleDeleteSize({ variables: { id } }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-size-${idx}`),
        );
      });
    });
  };

  useEffect(() => {
    if (
      !isEmpty(previousUpdateLoading) &&
      isEmpty(updateLoading) &&
      !dataLoading
    ) {
      handleCancel();
    }
  }, [dataLoading, previousUpdateLoading, updateLoading]);

  const handleCancel = () => {
    setChanges(initialChangesState);
    setRemovedItems(initialRemovedItemsState);
    setNewItemNextIds(initialNewItemNextIds);
    setEditing(false);
  };

  const handleChange = <T extends UpdateType>(
    updates: T[],
    updateKey: keyof T,
    changesKey: keyof PriceSheetChanges,
  ) => {
    let updatedItems: any[] = changes[changesKey];
    updates.forEach((update) => {
      if (updatedItems.find((u) => u.id === update.id)) {
        updatedItems = updatedItems.map((u) =>
          u.id === update.id ? { ...u, [updateKey]: update[updateKey] } : u,
        );
      } else {
        updatedItems = [...updatedItems, update];
      }
    });
    setChanges({ ...changes, [changesKey]: updatedItems });
  };

  const handleCategoryChange = (
    update: CategoryUpdate,
    updateKey: keyof CategoryUpdate,
  ) => {
    const changesKey = update.id < 0 ? 'newCategories' : 'categoryUpdates';
    handleChange([update], updateKey, changesKey);
  };

  const handleProductChange = (
    update: ProductUpdate,
    updateKey: keyof ProductUpdate,
  ) => {
    const changesKey = update.id < 0 ? 'newProducts' : 'productUpdates';
    handleChange([update], updateKey, changesKey);
  };

  const handleSizeChange = (
    update: SizeUpdate,
    updateKey: keyof SizeUpdate,
  ) => {
    const changesKey = update.id < 0 ? 'newSizes' : 'sizeUpdates';
    handleChange([update], updateKey, changesKey);
  };

  const handleEntryChange = (
    update: EntryUpdate,
    updateKey: keyof EntryUpdate,
  ) => {
    const changesKey = update.id < 0 ? 'newEntries' : 'entryUpdates';
    handleChange([update], updateKey, changesKey);
  };

  const handleSortChange = (
    type: 'category' | 'product',
    item: PriceCategory | PriceProduct,
    direction: 'up' | 'down',
  ) => {
    const isCategory = type === 'category';
    const updatesKey = isCategory ? 'categoryUpdates' : 'productUpdates';
    const newKey = isCategory ? 'newCategories' : 'newProducts';
    const list = isCategory
      ? allItems
      : allItems.find((c) => c && c.id === (item as PriceProduct).categoryId)
          ?.priceProductsByCategoryId.nodes;
    const getItemSortOrder = (it: PriceCategory | PriceProduct) =>
      isCategory
        ? getCategoryValue(it as PriceCategory, 'sortOrder').value
        : getProductValue(it as PriceProduct, 'sortOrder').value;
    const itemCurrentSortOrder = getItemSortOrder(item);

    if (list) {
      const adjacentItem = (list as (PriceCategory | PriceProduct)[]).find(
        (c) => {
          return (
            c &&
            getItemSortOrder(c) ===
              (direction === 'up'
                ? itemCurrentSortOrder - 1
                : itemCurrentSortOrder + 1)
          );
        },
      );
      if (adjacentItem) {
        const updatedItems = [
          {
            ...item,
            sortOrder: getItemSortOrder(adjacentItem),
            [isCategory
              ? 'priceProductsByCategoryId'
              : 'priceSizesByProductId']: { nodes: [] },
          },
          {
            ...adjacentItem,
            sortOrder: getItemSortOrder(item),
            [isCategory
              ? 'priceProductsByCategoryId'
              : 'priceSizesByProductId']: { nodes: [] },
          },
        ];
        if (item.id >= 0 && adjacentItem.id >= 0) {
          handleChange(updatedItems, 'sortOrder', updatesKey);
        } else if (item.id < 0 && adjacentItem.id < 0) {
          handleChange(updatedItems, 'sortOrder', newKey);
        } else {
          const itemChangeKey = item.id < 0 ? newKey : updatesKey;
          const adjacentItemChangeKey =
            adjacentItem.id < 0 ? newKey : updatesKey;

          let updatedItemList = changes[itemChangeKey] as any[];
          if (pluck('id', updatedItemList).includes(item.id)) {
            updatedItemList = updatedItemList.map((i) =>
              i.id === item.id ? updatedItems[0] : i,
            );
          } else {
            updatedItemList = [...updatedItemList, updatedItems[0]];
          }

          let updatedAdjacentItemList = changes[adjacentItemChangeKey] as any[];
          if (pluck('id', updatedAdjacentItemList).includes(adjacentItem.id)) {
            updatedAdjacentItemList = updatedAdjacentItemList.map((i) =>
              i.id === adjacentItem.id ? updatedItems[1] : i,
            );
          } else {
            updatedAdjacentItemList = [
              ...updatedAdjacentItemList,
              updatedItems[1],
            ];
          }

          setChanges({
            ...changes,
            [itemChangeKey]: updatedItemList,
            [adjacentItemChangeKey]: updatedAdjacentItemList,
          });
        }
      }
    }
  };

  const handleNewCategory = (newCategory: NewCategory) => {
    const newProduct = {
      id: newItemNextIds.product,
      productName: 'New Product',
      categoryId: newItemNextIds.category,
      color: getRandomColor(),
      sortOrder: 0,
      priceSizesByProductId: {
        edges: [],
        nodes: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      },
    };
    const baseNewSize = {
      productId: newItemNextIds.product,
      priceEntriesBySizeId: {
        edges: [],
        nodes: [],
        pageInfo: { hasNextPage: false, hasPreviousPage: false },
        totalCount: 0,
      },
    };
    const newProductRootSize = {
      ...baseNewSize,
      id: newItemNextIds.size,
      sizeName: 'product-root',
    };
    const newSize = {
      ...baseNewSize,
      id: newItemNextIds.size - 1,
      sizeName: 'New Size',
    };
    const baseNewEntry = {
      entryDate: getDateOfISOWeek(selectedWeekNumber),
      entryDescription: '',
      content: '',
    };
    const newProductRootEntry = {
      ...baseNewEntry,
      id: newItemNextIds.entry,
      sizeId: newItemNextIds.size,
    };
    const newEntry = {
      ...baseNewEntry,
      id: newItemNextIds.entry - 1,
      sizeId: newItemNextIds.size - 1,
    };
    setChanges({
      ...changes,
      newCategories: [
        ...changes.newCategories,
        {
          ...newCategory,
          id: newItemNextIds.category,
          sortOrder: allItems.length,
        },
      ],
      newProducts: [
        ...changes.newProducts,
        { ...newProduct, id: newItemNextIds.product },
      ],
      newSizes: [
        ...changes.newSizes,
        newProductRootSize,
        newSize,
      ] as PriceSize[],
      newEntries: [
        ...changes.newEntries,
        newProductRootEntry,
        newEntry,
      ] as PriceEntry[],
    });
    setNewItemNextIds({
      category: newItemNextIds.category - 1,
      product: newItemNextIds.product - 1,
      size: newItemNextIds.size - 2,
      entry: newItemNextIds.entry - 2,
    });
  };

  const handleNewProduct = (newProduct: NewProduct) => {
    const category = allItems.find((c) => c && c.id === newProduct.categoryId);
    if (category) {
      const baseNewSize = {
        productId: newItemNextIds.product,
        priceEntriesBySizeId: {
          edges: [],
          nodes: [],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
          totalCount: 0,
        },
      };
      const newProductRootSize = {
        ...baseNewSize,
        id: newItemNextIds.size,
        sizeName: 'product-root',
      };
      const newSize = {
        ...baseNewSize,
        id: newItemNextIds.size - 1,
        sizeName: 'New Size',
      };
      const baseNewEntry = {
        entryDate: getDateOfISOWeek(selectedWeekNumber),
        entryDescription: '',
        content: '',
      };
      const newProductRootEntry = {
        ...baseNewEntry,
        id: newItemNextIds.entry,
        sizeId: newItemNextIds.size,
      };
      const newEntry = {
        ...baseNewEntry,
        id: newItemNextIds.entry - 1,
        sizeId: newItemNextIds.size - 1,
      };
      setChanges({
        ...changes,
        newProducts: [
          ...changes.newProducts,
          {
            ...newProduct,
            id: newItemNextIds.product,
            sortOrder: category.priceProductsByCategoryId.nodes.length,
          },
        ],
        newSizes: [
          ...changes.newSizes,
          newProductRootSize,
          newSize,
        ] as PriceSize[],
        newEntries: [
          ...changes.newEntries,
          newProductRootEntry,
          newEntry,
        ] as PriceEntry[],
      });
      setNewItemNextIds({
        ...newItemNextIds,
        product: newItemNextIds.product - 1,
        size: newItemNextIds.size - 2,
        entry: newItemNextIds.entry - 2,
      });
    }
  };

  const handleNewSize = (newSize: NewSize) => {
    const baseNewEntry = {
      entryDate: getDateOfISOWeek(selectedWeekNumber),
      entryDescription: '',
      content: '',
    };
    const newProductRootEntry = {
      ...baseNewEntry,
      id: newItemNextIds.entry,
      sizeId: newItemNextIds.size,
    };
    const newEntry = {
      ...baseNewEntry,
      id: newItemNextIds.entry - 1,
      sizeId: newItemNextIds.size - 1,
    };
    setChanges({
      ...changes,
      newSizes: [
        ...changes.newSizes,
        { ...newSize, id: newItemNextIds.size },
      ] as PriceSize[],
      newEntries: [
        ...changes.newEntries,
        newProductRootEntry,
        newEntry,
      ] as PriceEntry[],
    });
    setNewItemNextIds({
      ...newItemNextIds,
      size: newItemNextIds.size - 1,
      entry: newItemNextIds.entry - 2,
    });
  };

  const handleNewEntry = (newEntry: NewEntry) => {
    setChanges({
      ...changes,
      newEntries: [
        ...changes.newEntries,
        { ...newEntry, id: newItemNextIds.entry },
      ] as PriceEntry[],
    });
    setNewItemNextIds({
      ...newItemNextIds,
      entry: newItemNextIds.entry - 1,
    });
  };

  const handleRemoveNewCategory = (id: number, sortOrder: number) => {
    const productsToRemove = pluck(
      'id',
      changes.newProducts.filter((item) => item.categoryId === id),
    );
    const sizesToRemove = pluck(
      'id',
      changes.newSizes.filter((item) =>
        productsToRemove.includes(item.productId),
      ),
    );
    const existingCategories = items.filter(
      (item) => item && getCategoryValue(item, 'sortOrder').value > sortOrder,
    );
    setChanges({
      ...changes,
      newCategories: changes.newCategories
        .filter((item) => item.id !== id)
        .map((c) =>
          c.sortOrder > sortOrder ? { ...c, sortOrder: c.sortOrder - 1 } : c,
        ),
      categoryUpdates: [
        ...changes.categoryUpdates.map((c) =>
          c.sortOrder > sortOrder ? { ...c, sortOrder: c.sortOrder - 1 } : c,
        ),
        ...existingCategories.map((c) =>
          c
            ? {
                ...c,
                priceProductsByCategoryId: { nodes: [] },
                sortOrder: c.sortOrder - 1,
              }
            : c,
        ),
      ] as CategoryUpdate[],
      newProducts: changes.newProducts.filter(
        (item) => !productsToRemove.includes(item.id),
      ),
      newSizes: changes.newSizes.filter(
        (item) => !productsToRemove.includes(item.productId),
      ),
      newEntries: changes.newEntries.filter(
        (item) => !sizesToRemove.includes(item.sizeId),
      ),
    });
  };

  const handleRemoveNewProduct = (id: number, sortOrder: number) => {
    const sizesToRemove = pluck(
      'id',
      changes.newSizes.filter((item) => item.productId === id),
    );
    const existingCategory = items.find((item) => item && item.id === id);
    const existingProducts = existingCategory
      ? existingCategory.priceProductsByCategoryId.nodes.filter(
          (item) =>
            item && getProductValue(item, 'sortOrder').value > sortOrder,
        )
      : [];
    setChanges({
      ...changes,
      newProducts: changes.newProducts
        .filter((item) => item.id !== id)
        .map((p) =>
          p.sortOrder > sortOrder ? { ...p, sortOrder: p.sortOrder - 1 } : p,
        ),
      productUpdates: [
        ...changes.productUpdates.map((p) =>
          p.sortOrder > sortOrder ? { ...p, sortOrder: p.sortOrder - 1 } : p,
        ),
        ...existingProducts.map((p) =>
          p
            ? {
                ...p,
                priceSizesByCategoryId: { nodes: [] },
                sortOrder: p.sortOrder - 1,
              }
            : p,
        ),
      ] as ProductUpdate[],
      newSizes: changes.newSizes.filter((item) => item.productId !== id),
      newEntries: changes.newEntries.filter(
        (item) => !sizesToRemove.includes(item.sizeId),
      ),
    });
  };

  const handleRemoveItem = (
    key: keyof RemovedItems,
    id: number,
    sortOrder: number,
  ) => {
    if (id < 0) {
      switch (key) {
        case 'categories':
          handleRemoveNewCategory(id, sortOrder);
          break;
        case 'products':
          handleRemoveNewProduct(id, sortOrder);
          break;
        case 'sizes':
          setChanges({
            ...changes,
            newSizes: changes.newSizes.filter((item) => item.id !== id),
            newEntries: changes.newEntries.filter((item) => item.sizeId !== id),
          });
          break;
        default:
          return;
      }
    } else {
      setRemovedItems({ ...removedItems, [key]: [...removedItems[key], id] });
      if (key === 'categories') {
        const existingCategories = items.filter(
          (item) =>
            item && getCategoryValue(item, 'sortOrder').value > sortOrder,
        );
        setChanges({
          ...changes,
          categoryUpdates: [
            ...changes.categoryUpdates.map((c) =>
              c.sortOrder > sortOrder
                ? { ...c, sortOrder: c.sortOrder - 1 }
                : c,
            ),
            ...existingCategories.map((c) =>
              c
                ? {
                    ...c,
                    priceProductsByCategoryId: { nodes: [] },
                    sortOrder: c.sortOrder - 1,
                  }
                : c,
            ),
          ] as CategoryUpdate[],
          newCategories: [
            ...changes.newCategories.map((c) =>
              c.sortOrder > sortOrder
                ? { ...c, sortOrder: c.sortOrder - 1 }
                : c,
            ),
          ],
        });
      } else if (key === 'products') {
        const existingCategory = items.find((item) => item && item.id === id);
        const existingProducts = existingCategory
          ? existingCategory.priceProductsByCategoryId.nodes.filter(
              (item) =>
                item && getProductValue(item, 'sortOrder').value > sortOrder,
            )
          : [];
        setChanges({
          ...changes,
          productUpdates: [
            ...changes.productUpdates.map((p) =>
              p.sortOrder > sortOrder
                ? { ...p, sortOrder: p.sortOrder - 1 }
                : p,
            ),
            ...existingProducts.map((p) =>
              p
                ? {
                    ...p,
                    priceSizesByCategoryId: { nodes: [] },
                    sortOrder: p.sortOrder - 1,
                  }
                : p,
            ),
          ] as ProductUpdate[],
          newProducts: [
            ...changes.newProducts.map((p) =>
              p.sortOrder > sortOrder
                ? { ...p, sortOrder: p.sortOrder - 1 }
                : p,
            ),
          ],
        });
      }
    }
  };

  const toggleCollapseItem = (key: keyof CollapsedItems, id: number) => {
    if (collapsedItems[key].includes(id)) {
      setCollapsedItems({
        ...collapsedItems,
        [key]: collapsedItems[key].filter((it) => it !== id),
      });
    } else {
      setCollapsedItems({
        ...collapsedItems,
        [key]: [...collapsedItems[key], id],
      });
    }
  };

  const isItemCollapsed = (key: keyof CollapsedItems, id: number) =>
    collapsedItems[key].includes(id);

  const collapseAllItems = () => {
    const newCollapsedItems: CollapsedItems = { categories: [], products: [] };
    allItems.forEach((category) => {
      if (category) {
        category.priceProductsByCategoryId.nodes.forEach((product) => {
          if (product) {
            newCollapsedItems.products.push(product.id);
          }
        });
      }
    });
    setCollapsedItems(newCollapsedItems);
  };

  const expandAllItems = () => {
    setCollapsedItems(initialCollapsedItemsState);
  };

  return (
    <Page
      actions={[
        editing ? (
          <Fragment key={0}>
            <Modal
              trigger={(show) => (
                <b.Primary mr={th.spacing.sm} onClick={show} width={88}>
                  Cancel
                </b.Primary>
              )}
            >
              {({ hide }) => (
                <>
                  <ty.TitleText>Confirm discard changes</ty.TitleText>
                  <ty.BodyText>
                    You will lose all unsaved price sheet changes.
                  </ty.BodyText>
                  <l.Flex justifyCenter mt={th.spacing.xl}>
                    <b.Primary mr={th.spacing.lg} onClick={hide}>
                      Cancel
                    </b.Primary>
                    <b.Primary onClick={handleCancel}>Discard</b.Primary>
                  </l.Flex>
                </>
              )}
            </Modal>
            <b.Primary onClick={handleSave} width={88}>
              {!isEmpty(updateLoading) ? (
                <l.Flex alignCenter justifyCenter>
                  <ClipLoader
                    color={th.colors.brand.secondary}
                    size={th.sizes.xs}
                  />
                </l.Flex>
              ) : (
                'Save'
              )}
            </b.Primary>
          </Fragment>
        ) : (
          <b.Primary key={0} onClick={handleEdit} width={88}>
            Edit
          </b.Primary>
        ),
        !editing && (
          <l.AreaLink
            key={1}
            ml={th.spacing.md}
            to={`/sales/agenda?endDate=${startDate}&startDate=${startDate}`}
          >
            <b.Primary width={126}>Agenda</b.Primary>
          </l.AreaLink>
        ),
      ]}
      breadcrumbs={[]}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex>{DateRangePicker}</l.Flex>
          <Header
            collapseAllItems={collapseAllItems}
            editing={editing}
            expandAllItems={expandAllItems}
            handleWeekChange={handleWeekChange}
            selectedWeekNumber={selectedWeekNumber}
            startDate={startDate}
          />
        </>
      }
      title="Price Sheet"
    >
      <Categories
        changeHandlers={{
          handleCategoryChange,
          handleProductChange,
          handleSizeChange,
          handleEntryChange,
        }}
        editing={editing}
        handleRemoveItem={handleRemoveItem}
        handleSortChange={handleSortChange}
        isItemCollapsed={isItemCollapsed}
        items={allItems as PriceCategory[]}
        newItemHandlers={{
          handleNewCategory,
          handleNewProduct,
          handleNewSize,
          handleNewEntry,
        }}
        selectedWeekNumber={selectedWeekNumber}
        toggleCollapseItem={toggleCollapseItem}
        valueGetters={{
          getCategoryValue,
          getProductValue,
          getSizeValue,
          getEntryValue,
        }}
      />
      {!editing && isEmpty(allItems) && (
        <DataMessage
          data={items}
          error={dataError}
          loading={dataLoading}
          emptyProps={{
            header: 'No Price Entries Found 😔',
            text: 'Modify date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default PriceSheet;
