import {
  PriceCategory,
  PriceProduct,
  PriceSize,
  PriceEntry,
  Maybe,
} from 'types';

export type CategoryUpdate = Pick<
  PriceCategory,
  'id' | 'categoryName' | 'sortOrder'
>;
export type ProductUpdate = Pick<
  PriceProduct,
  'id' | 'categoryId' | 'color' | 'productName' | 'sortOrder'
>;
export type SizeUpdate = Pick<PriceSize, 'id' | 'productId' | 'sizeName'>;
export type EntryUpdate = Pick<
  PriceEntry,
  'id' | 'content' | 'entryDate' | 'entryDescription' | 'sizeId'
>;
export type UpdateType =
  | CategoryUpdate
  | ProductUpdate
  | SizeUpdate
  | EntryUpdate;

export type NewCategory = Pick<
  PriceCategory,
  'id' | 'categoryName' | 'sortOrder' | 'priceProductsByCategoryId'
>;
export type NewProduct = Pick<
  PriceProduct,
  | 'id'
  | 'color'
  | 'productName'
  | 'sortOrder'
  | 'categoryId'
  | 'priceSizesByProductId'
>;
export type NewSize = Pick<
  PriceSize,
  'id' | 'sizeName' | 'productId' | 'priceEntriesBySizeId'
>;
export type NewEntry = Pick<
  PriceEntry,
  'id' | 'content' | 'entryDate' | 'entryDescription' | 'sizeId'
>;

export interface PriceSheetChanges {
  categoryUpdates: CategoryUpdate[];
  productUpdates: ProductUpdate[];
  sizeUpdates: SizeUpdate[];
  entryUpdates: EntryUpdate[];
  newCategories: NewCategory[];
  newProducts: NewProduct[];
  newSizes: PriceSize[];
  newEntries: NewEntry[];
}

export interface CollapsedItems {
  categories: number[];
  products: number[];
}

export interface RemovedItems {
  categories: number[];
  products: number[];
  sizes: number[];
}

export interface PriceSheetProps {
  changeHandlers: {
    handleCategoryChange: (
      update: CategoryUpdate,
      updateKey: keyof CategoryUpdate,
    ) => void;
    handleProductChange: (
      update: ProductUpdate,
      updateKey: keyof ProductUpdate,
    ) => void;
    handleSizeChange: (update: SizeUpdate, updateKey: keyof SizeUpdate) => void;
    handleEntryChange: (
      update: EntryUpdate,
      updateKey: keyof EntryUpdate,
    ) => void;
  };
  editing: boolean;
  handleRemoveItem: (
    key: keyof RemovedItems,
    id: number,
    sortOrder: number,
  ) => void;
  handleSortChange: (
    type: 'category' | 'product',
    item: PriceCategory | PriceProduct,
    direction: 'up' | 'down',
  ) => void;
  isItemCollapsed: (key: keyof CollapsedItems, id: number) => boolean;
  newItemHandlers: {
    handleNewCategory: (newCategory: NewCategory) => void;
    handleNewProduct: (newProduct: NewProduct) => void;
    handleNewSize: (newSize: NewSize) => void;
    handleNewEntry: (newEntry: NewEntry) => void;
  };
  selectedWeekNumber: number;
  toggleCollapseItem: (key: keyof CollapsedItems, id: number) => void;
  valueGetters: {
    getCategoryValue: (
      category: Maybe<PriceCategory> | undefined,
      key: keyof CategoryUpdate,
    ) => { dirty: boolean; value: string };
    getProductValue: (
      product: Maybe<PriceProduct> | undefined,
      key: keyof ProductUpdate,
    ) => { dirty: boolean; value: string };
    getSizeValue: (
      size: Maybe<PriceSize> | undefined,
      key: keyof SizeUpdate,
    ) => { dirty: boolean; value: string };
    getEntryValue: (
      entry: Maybe<PriceEntry> | undefined,
      key: keyof EntryUpdate,
      defaultValue?: string,
    ) => { dirty: boolean; value: string };
  };
}
