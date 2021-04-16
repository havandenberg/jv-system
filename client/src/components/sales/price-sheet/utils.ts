import { sortBy } from 'ramda';
import { Maybe, PriceCategory, PriceProduct } from 'types';

import {
  CategoryUpdate,
  PriceSheetChanges,
  ProductUpdate,
  RemovedItems,
} from './types';

export const getAllItems = (
  items: Maybe<PriceCategory>[],
  changes: PriceSheetChanges,
  removedItems: RemovedItems,
  getCategoryValue: (
    category: Maybe<PriceCategory> | undefined,
    key: keyof CategoryUpdate,
  ) => { dirty: boolean; value: string },
  getProductValue: (
    product: Maybe<PriceProduct> | undefined,
    key: keyof ProductUpdate,
  ) => { dirty: boolean; value: string },
) =>
  sortBy((c) => getCategoryValue(c, 'sortOrder').value, [
    ...items.filter((c) => c && !removedItems.categories.includes(c.id)),
    ...changes.newCategories,
  ] as PriceCategory[]).map((c) => {
    if (c) {
      return {
        ...c,
        priceProductsByCategoryId: {
          nodes: sortBy((p) => getProductValue(p, 'sortOrder').value, [
            ...c.priceProductsByCategoryId.nodes.filter(
              (p) => p && !removedItems.products.includes(p.id),
            ),
            ...changes.newProducts.filter((p) => p.categoryId === c.id),
          ] as PriceProduct[]).map((p) => {
            if (p) {
              return {
                ...p,
                priceSizesByProductId: {
                  nodes: [
                    ...p.priceSizesByProductId.nodes.filter(
                      (s) => s && !removedItems.sizes.includes(s.id),
                    ),
                    ...changes.newSizes.filter((s) => s.productId === p.id),
                  ].map((s) => {
                    if (s) {
                      return {
                        ...s,
                        priceEntriesBySizeId: {
                          nodes: [
                            ...s.priceEntriesBySizeId.nodes,
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
