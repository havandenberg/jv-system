import {
  PriceCategory,
  PriceProduct,
  PriceSize,
  PriceEntry,
  Maybe,
} from 'types';

export interface CollapsedItems {
  categories: number[];
  products: number[];
}

export type CategoryUpdate = Pick<
  PriceCategory,
  'id' | 'categoryName' | 'sortOrder'
>;
export type ProductUpdate = Pick<
  PriceProduct,
  'id' | 'categoryId' | 'color' | 'productName' | 'sortOrder'
>;
export type SizeUpdate = Pick<
  PriceSize,
  'id' | 'productId' | 'sizeName' | 'sortOrder'
>;
export type EntryUpdate = Pick<
  PriceEntry,
  'id' | 'content' | 'entryDate' | 'entryDescription' | 'highlight' | 'sizeId'
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
  'id' | 'sizeName' | 'sortOrder' | 'productId' | 'priceEntriesBySizeId'
>;
export type NewEntry = Pick<
  PriceEntry,
  'id' | 'content' | 'entryDate' | 'entryDescription' | 'highlight' | 'sizeId'
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

export interface RemovedItem {
  id: number;
  date: Date;
}

export interface RemovedItems {
  categories: RemovedItem[];
  products: RemovedItem[];
  sizes: RemovedItem[];
}

export interface NewItemNextIds {
  category: number;
  product: number;
  size: number;
  entry: number;
}

export interface PriceSheetState {
  changes: PriceSheetChanges;
  editing: boolean;
  removedItems: RemovedItems;
  newItemNextIds: NewItemNextIds;
}

export type SortItemType = PriceCategory | PriceProduct | PriceSize;

export interface PriceSheetProps {
  changeHandlers: {
    handleCategoryChange: (update: CategoryUpdate) => void;
    handleProductChange: (update: ProductUpdate) => void;
    handleSizeChange: (update: SizeUpdate) => void;
    handleEntryChange: (update: EntryUpdate) => void;
  };
  editing: boolean;
  handleRemoveItem: (key: keyof RemovedItems, id: number) => void;
  handleSortChange: (
    type: 'category' | 'product' | 'size',
    item: SortItemType,
    direction: 'up' | 'down',
    categoryId?: string,
  ) => void;
  isItemCollapsed: (key: keyof CollapsedItems, id: number) => boolean;
  newItemHandlers: {
    handleNewCategory: (newCategory: NewCategory) => void;
    handleNewProduct: (newProduct: NewProduct, category: PriceCategory) => void;
    handleNewSize: (newSize: NewSize, product: PriceProduct) => void;
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
