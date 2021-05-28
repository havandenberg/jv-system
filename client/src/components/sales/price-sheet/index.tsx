import React, { Fragment, useEffect, useState } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { isEmpty, omit, pluck, reduce } from 'ramda';
import ClipLoader from 'react-spinners/ClipLoader';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import Modal from 'components/modal';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import { useDateRangeQueryParams } from 'hooks/use-query-params';
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
  NewItemNextIds,
  NewProduct,
  NewSize,
  PriceSheetChanges,
  PriceSheetState,
  ProductUpdate,
  RemovedItems,
  SizeUpdate,
  SortItemType,
  UpdateType,
} from './types';
import { getAllItems } from './utils';
import { FilterCheckbox } from 'ui/checkbox';

export const gridTemplateColumns = '3fr 1fr 1.3fr repeat(4, 1fr)';

const initialCollapsedItemsState: CollapsedItems = {
  categories: [],
  products: [],
};

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

const initialRemovedItemsState: RemovedItems = {
  categories: [],
  products: [],
  sizes: [],
};

const initialNewItemNextIds: NewItemNextIds = {
  category: -1,
  product: -1,
  size: -1,
  entry: -1,
};

const initialState: PriceSheetState = {
  changes: initialChangesState,
  editing: false,
  newItemNextIds: initialNewItemNextIds,
  removedItems: initialRemovedItemsState,
  sendNotification: false,
};

const PriceSheet = () => {
  const [state, setState] = useState<PriceSheetState>(initialState);
  const { changes, editing, newItemNextIds, removedItems, sendNotification } =
    state;
  const hasChanges = reduce(
    (acc, key) => acc || changes[key].length > 0,
    false,
    Object.keys(changes) as (keyof PriceSheetChanges)[],
  );

  const setChanges = (newChanges: PriceSheetChanges) => {
    setState((prevState) => ({ ...prevState, changes: newChanges }));
  };

  const setEditing = (newEditing: boolean) => {
    setState((prevState) => ({ ...prevState, editing: newEditing }));
  };

  const setNewItemNextIds = (newNewItemNextIds: NewItemNextIds) => {
    setState((prevState) => ({
      ...prevState,
      newItemNextIds: newNewItemNextIds,
    }));
  };

  const setRemovedItems = (newRemovedItems: RemovedItems) => {
    setState((prevState) => ({ ...prevState, removedItems: newRemovedItems }));
  };

  const setSendNotification = (newSendNotification: boolean) => {
    setState((prevState) => ({
      ...prevState,
      sendNotification: newSendNotification,
    }));
  };

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

  const [updateLoading, setUpdateLoading] = useState<string[]>([]);
  const previousUpdateLoading = usePrevious(updateLoading);
  const [handleUpdate] = api.useUpdatePriceSheet();
  const [handleNotify] = api.useSendPriceSheetUpdateEmail();
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
    startOfISOWeek(new Date(startDate.replace(/-/g, '/'))),
    getCategoryValue,
    getProductValue,
    getSizeValue,
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
          sortOrder: s.sortOrder,
          id: parseInt(s.id, 10),
        })),
        entries: changes.entryUpdates.map((e) => ({
          content: e.content,
          entryDate: e.entryDate,
          entryDescription: e.entryDescription,
          highlight: e.highlight,
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
        highlight: e.highlight,
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
        sortOrder: s.sortOrder,
        priceEntriesUsingId: {
          create: changes.newEntries
            .filter((e) => e.sizeId === s.id)
            .map((e) => ({
              entryDate: e.entryDate,
              entryDescription: e.entryDescription,
              content: e.content,
              highlight: e.highlight,
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
              sortOrder: s.sortOrder,
              priceEntriesUsingId: {
                create: changes.newEntries
                  .filter((e) => e.sizeId === s.id)
                  .map((e) => ({
                    entryDate: e.entryDate,
                    entryDescription: e.entryDescription,
                    content: e.content,
                    highlight: e.highlight,
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
                    sortOrder: s.sortOrder,
                    priceEntriesUsingId: {
                      create: changes.newEntries
                        .filter((e) => e.sizeId === s.id)
                        .map((e) => ({
                          entryDate: e.entryDate,
                          entryDescription: e.entryDescription,
                          content: e.content,
                          highlight: e.highlight,
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
    removedItems.categories.forEach(({ id, date }, idx) => {
      setUpdateLoading((prevLoading) => [
        ...prevLoading,
        `del-category-${idx}`,
      ]);
      handleDeleteCategory({
        variables: { id, selectedDate: date },
      }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-category-${idx}`),
        );
      });
    });
    removedItems.products.forEach(({ id, date }, idx) => {
      setUpdateLoading((prevLoading) => [...prevLoading, `del-product-${idx}`]);
      handleDeleteProduct({
        variables: { id, selectedDate: date },
      }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-product-${idx}`),
        );
      });
    });
    removedItems.sizes.forEach(({ id, date }, idx) => {
      setUpdateLoading((prevLoading) => [...prevLoading, `del-size-${idx}`]);
      handleDeleteSize({
        variables: { id, selectedDate: date },
      }).then(() => {
        setUpdateLoading((prevLoading) =>
          prevLoading.filter((l) => l !== `del-size-${idx}`),
        );
      });
    });
    if (sendNotification) {
      handleNotify();
    }
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
    setState(initialState);
  };

  const handleChange = <T extends UpdateType>(
    updates: T[],
    changesKey: keyof PriceSheetChanges,
  ) => {
    let updatedItems: any[] = changes[changesKey];
    updates.forEach((update) => {
      if (updatedItems.find((u) => u.id === update.id)) {
        updatedItems = updatedItems.map((u) =>
          u.id === update.id ? { ...u, ...omit(['id'], update) } : u,
        );
      } else {
        updatedItems = [...updatedItems, update];
      }
    });
    setChanges({ ...changes, [changesKey]: updatedItems });
  };

  const handleCategoryChange = (update: CategoryUpdate) => {
    const changesKey = update.id < 0 ? 'newCategories' : 'categoryUpdates';
    handleChange([update], changesKey);
  };

  const handleProductChange = (update: ProductUpdate) => {
    const changesKey = update.id < 0 ? 'newProducts' : 'productUpdates';
    handleChange([update], changesKey);
  };

  const handleSizeChange = (update: SizeUpdate) => {
    const changesKey = update.id < 0 ? 'newSizes' : 'sizeUpdates';
    handleChange([update], changesKey);
  };

  const handleEntryChange = (update: EntryUpdate) => {
    const changesKey = update.id < 0 ? 'newEntries' : 'entryUpdates';
    handleChange([update], changesKey);
  };

  const handleSortChange = (
    type: 'category' | 'product' | 'size',
    item: SortItemType,
    direction: 'up' | 'down',
    categoryId?: string,
  ) => {
    const isCategory = type === 'category';
    const isProduct = type === 'product';
    const updatesKey = isCategory
      ? 'categoryUpdates'
      : isProduct
      ? 'productUpdates'
      : 'sizeUpdates';
    const newKey = isCategory
      ? 'newCategories'
      : isProduct
      ? 'newProducts'
      : 'newSizes';

    const list = isCategory
      ? allItems
      : isProduct
      ? allItems.find((c) => c && c.id === (item as PriceProduct).categoryId)
          ?.priceProductsByCategoryId.nodes
      : allItems
          .find((c) => c && c.id === categoryId)
          ?.priceProductsByCategoryId.nodes.find(
            (p) => p && p.id === (item as PriceSize).productId,
          )?.priceSizesByProductId.nodes;

    const getItemSortOrder = (it: SortItemType) =>
      isCategory
        ? getCategoryValue(it as PriceCategory, 'sortOrder').value
        : isProduct
        ? getProductValue(it as PriceProduct, 'sortOrder').value
        : getSizeValue(it as PriceSize, 'sortOrder').value;

    if (list) {
      const itemCurrentIndex = (list as SortItemType[]).findIndex(
        (it: SortItemType) => item.id === it.id,
      );
      const adjacentItem = (list as SortItemType[])[
        direction === 'up' ? itemCurrentIndex - 1 : itemCurrentIndex + 1
      ];
      if (adjacentItem) {
        const updatedItems = [
          {
            ...item,
            sortOrder: getItemSortOrder(adjacentItem),
            [isCategory
              ? 'priceProductsByCategoryId'
              : isProduct
              ? 'priceSizesByProductId'
              : 'priceEntriesBySizeId']: { nodes: [] },
          },
          {
            ...adjacentItem,
            sortOrder: getItemSortOrder(item),
            [isCategory
              ? 'priceProductsByCategoryId'
              : isProduct
              ? 'priceSizesByProductId'
              : 'priceEntriesBySizeId']: { nodes: [] },
          },
        ];
        if (item.id >= 0 && adjacentItem.id >= 0) {
          handleChange(updatedItems, updatesKey);
        } else if (item.id < 0 && adjacentItem.id < 0) {
          handleChange(updatedItems, newKey);
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
      sortOrder: 0,
    };
    const newSize = {
      ...baseNewSize,
      id: newItemNextIds.size - 1,
      sizeName: 'New Size',
      sortOrder: 1,
    };
    const baseNewEntry = {
      entryDate: getDateOfISOWeek(selectedWeekNumber),
      entryDescription: '',
      content: '',
      highlight: false,
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
          sortOrder:
            allItems.length > 0
              ? getCategoryValue(
                  allItems[allItems.length - 1] as PriceCategory,
                  'sortOrder',
                ).value + 1
              : 0,
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

  const handleNewProduct = (
    newProduct: NewProduct,
    category: PriceCategory,
  ) => {
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
      sortOrder: 0,
    };
    const newSize = {
      ...baseNewSize,
      id: newItemNextIds.size - 1,
      sizeName: 'New Size',
      sortOrder: 1,
    };
    const baseNewEntry = {
      entryDate: getDateOfISOWeek(selectedWeekNumber),
      entryDescription: '',
      content: '',
      highlight: false,
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
          sortOrder:
            getProductValue(
              category.priceProductsByCategoryId.nodes[
                category.priceProductsByCategoryId.nodes.length - 1
              ] as PriceProduct,
              'sortOrder',
            ).value + 1,
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
  };

  const handleNewSize = (newSize: NewSize, product: PriceProduct) => {
    const baseNewEntry = {
      entryDate: getDateOfISOWeek(selectedWeekNumber),
      entryDescription: '',
      content: '',
      highlight: false,
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
        {
          ...newSize,
          id: newItemNextIds.size,
          sortOrder:
            getSizeValue(
              product.priceSizesByProductId.nodes[
                product.priceSizesByProductId.nodes.length - 1
              ] as PriceSize,
              'sortOrder',
            ).value + 1,
        },
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

  const handleRemoveNewCategory = (id: number) => {
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
    setChanges({
      ...changes,
      newCategories: changes.newCategories.filter((item) => item.id !== id),
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

  const handleRemoveNewProduct = (id: number) => {
    const sizesToRemove = pluck(
      'id',
      changes.newSizes.filter((item) => item.productId === id),
    );
    setChanges({
      ...changes,
      newProducts: changes.newProducts.filter((item) => item.id !== id),
      newSizes: changes.newSizes.filter((item) => item.productId !== id),
      newEntries: changes.newEntries.filter(
        (item) => !sizesToRemove.includes(item.sizeId),
      ),
    });
  };

  const handleRemoveItem = (key: keyof RemovedItems, id: number) => {
    if (id < 0) {
      switch (key) {
        case 'categories':
          handleRemoveNewCategory(id);
          break;
        case 'products':
          handleRemoveNewProduct(id);
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
      setRemovedItems({
        ...removedItems,
        [key]: [
          ...removedItems[key].filter((removedItem) => removedItem.id !== id),
          {
            id,
            date: startOfISOWeek(new Date(startDate.replace(/-/g, '/'))),
          },
        ],
      });
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
          <l.Flex key={0} position="relative">
            <Modal
              trigger={(show) => (
                <b.Primary
                  mr={th.spacing.sm}
                  onClick={hasChanges ? show : handleCancel}
                  width={88}
                >
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
            <l.Div position="absolute" right={0} top={50}>
              <FilterCheckbox
                checked={sendNotification}
                label="Send email notification"
                onChange={() => setSendNotification(!sendNotification)}
              />
            </l.Div>
          </l.Flex>
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
      extraPaddingTop={108}
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
