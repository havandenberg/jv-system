import React from 'react';
import { useLocation } from 'react-router-dom';

import VirtualizedList from 'components/virtualized-list';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useInventoryQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { InventoryItem } from 'types';

import { listLabels } from './data-utils';
import ListItem from './list-item';
import { getSortedItems } from '../utils';

export const gridTemplateColumns = (
  count: number = 5,
  hasShipper: boolean = true,
) =>
  `80px ${hasShipper ? '' : '2.5fr '}${
    count ? 'repeat(' + count + ', 1.5fr) ' : ''
  }repeat(3, 90px) 30px`;

interface Props {
  items: InventoryItem[];
}

const InventoryItems = ({ items }: Props) => {
  const { search } = useLocation();
  const [{ species, variety, size, packType, plu, shipper }] =
    useInventoryQueryParams();
  const [{ sortBy = 'vessel', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const sortedItems = getSortedItems(listLabels, items, sortBy, sortOrder);

  const columnCount =
    5 -
    [species, variety, size, packType, plu].filter(
      (val) => !!val && val !== 'total',
    ).length;

  return (
    <VirtualizedList
      height={618}
      rowCount={sortedItems.length}
      rowRenderer={({ key, index, style }) => {
        const item = sortedItems[index];
        return (
          item && (
            <div key={key} style={style}>
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns(
                  columnCount,
                  !!shipper,
                )}
                listLabels={listLabels.filter(
                  (label) =>
                    (!species ||
                      species === 'total' ||
                      label.sortKey !== 'species') &&
                    (!variety ||
                      variety === 'total' ||
                      label.sortKey !== 'variety') &&
                    (!size || size === 'total' || label.sortKey !== 'size') &&
                    (!packType ||
                      packType === 'total' ||
                      label.sortKey !== 'packType') &&
                    (!plu || plu === 'total' || label.key !== 'plu') &&
                    (!shipper ||
                      shipper === 'total' ||
                      label.key !== 'shipper'),
                )}
                to={`/sales/inventory/items/${item.id}${search}`}
              />
            </div>
          )
        );
      }}
    />
  );
};

export default InventoryItems;
