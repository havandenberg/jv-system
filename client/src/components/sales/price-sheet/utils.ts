import { startOfISOWeek } from 'date-fns';
import { sortBy } from 'ramda';

import {
  Maybe,
  PriceCategory,
  PriceEntry,
  PriceProduct,
  PriceSize,
} from 'types';
import { isDateGreaterThanOrEqualTo } from 'utils/date';

import {
  CategoryUpdate,
  PriceSheetChanges,
  ProductUpdate,
  RemovedItems,
  SizeUpdate,
} from './types';

export const getAllItems = (
  items: Maybe<PriceCategory>[],
  changes: PriceSheetChanges,
  removedItems: RemovedItems,
  currentDate: Date,
  getCategoryValue: (
    category: Maybe<PriceCategory> | undefined,
    key: keyof CategoryUpdate,
  ) => { dirty: boolean; value: string },
  getProductValue: (
    product: Maybe<PriceProduct> | undefined,
    key: keyof ProductUpdate,
  ) => { dirty: boolean; value: string },
  getSizeValue: (
    size: Maybe<PriceSize> | undefined,
    key: keyof SizeUpdate,
  ) => { dirty: boolean; value: string },
) =>
  sortBy((c) => getCategoryValue(c, 'sortOrder').value, [
    ...items.filter(
      (c) =>
        c &&
        !removedItems.categories.find(
          (rc) =>
            rc.id === c.id && isDateGreaterThanOrEqualTo(currentDate, rc.date),
        ),
    ),
    ...changes.newCategories,
  ] as PriceCategory[]).map((c) => {
    if (c) {
      return {
        ...c,
        priceProductsByCategoryId: {
          nodes: sortBy((p) => getProductValue(p, 'sortOrder').value, [
            ...c.priceProductsByCategoryId.nodes.filter(
              (p) =>
                p &&
                !removedItems.products.find(
                  (rp) =>
                    rp.id === p.id &&
                    isDateGreaterThanOrEqualTo(currentDate, rp.date),
                ),
            ),
            ...changes.newProducts.filter((p) => p.categoryId === c.id),
          ] as PriceProduct[]).map((p) => {
            if (p) {
              return {
                ...p,
                priceSizesByProductId: {
                  nodes: sortBy(
                    (s) => getSizeValue(s, 'sortOrder').value,
                    [
                      ...p.priceSizesByProductId.nodes.filter(
                        (s) =>
                          s &&
                          !removedItems.sizes.find(
                            (rs) =>
                              rs.id === s.id &&
                              isDateGreaterThanOrEqualTo(currentDate, rs.date),
                          ),
                      ),
                      ...changes.newSizes.filter((s) => s.productId === p.id),
                    ],
                  ).map((s) => {
                    if (s) {
                      return {
                        ...s,
                        priceEntriesBySizeId: {
                          nodes: [
                            ...s.priceEntriesBySizeId.nodes.filter(
                              (e) => e && !isEntryRemoved(e, removedItems),
                            ),
                            ...changes.newEntries.filter(
                              (e) => e.sizeId === s.id,
                            ),
                          ],
                        },
                      };
                    }
                    return s;
                  }),
                },
              };
            }
            return p;
          }),
        },
      };
    }
    return c;
  });

const isEntryRemoved = (entry: PriceEntry, removedItems: RemovedItems) => {
  const entryDate = startOfISOWeek(
    new Date(entry.entryDate.replace(/-/g, '/')),
  );
  const isCategoryRemoved = !!removedItems.categories.find(
    (c) =>
      c.id === entry.size?.product?.categoryId &&
      isDateGreaterThanOrEqualTo(entryDate, c.date),
  );
  const isProductRemoved = !!removedItems.products.find(
    (p) =>
      p.id === entry.size?.productId &&
      isDateGreaterThanOrEqualTo(entryDate, p.date),
  );
  const isSizeRemoved = !!removedItems.sizes.find(
    (s) =>
      s.id === entry.sizeId && isDateGreaterThanOrEqualTo(entryDate, s.date),
  );
  return isCategoryRemoved || isProductRemoved || isSizeRemoved;
};
