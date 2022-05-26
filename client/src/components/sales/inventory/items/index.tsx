import React from 'react';
import { useLocation } from 'react-router-dom';

import VirtualizedList from 'components/virtualized-list';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useInventoryQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { InventoryItem } from 'types';

import { getSortedItems, isPreInventoryItem } from '../utils';
import { indexListLabels } from './data-utils';
import ListItem from './list-item';

export const gridTemplateColumns = (hasShipper: boolean = true) =>
  `1.5fr 120px ${hasShipper ? '' : '1fr '} 1fr repeat(3, 65px) 50px 30px`;

interface Props {
  items: InventoryItem[];
}

const InventoryItems = ({ items }: Props) => {
  const { search } = useLocation();
  const [
    { shipper, species, variety, size, packType, plu, startDate, endDate },
  ] = useInventoryQueryParams();
  const [{ sortBy = 'vessel', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const sortedItems = getSortedItems(
    indexListLabels({ species, variety, size, packType, plu, shipper }),
    items,
    sortBy,
    sortOrder,
  );

  return (
    <VirtualizedList
      height={618}
      rowCount={sortedItems.length}
      rowRenderer={({ key, index, style }) => {
        const item = sortedItems[index] as InventoryItem;
        const to = isPreInventoryItem(item)
          ? `/sales/projections?coast=${item.coast}&shipperId=${item.shipper?.id}&startDate=${startDate}&endDate=${endDate}&projectionsView=grid&vesselId=${item.vessel?.id}&projectionId=all`
          : `/sales/inventory/items/${item.id}${search}`;

        return (
          item && (
            <div key={key} style={style}>
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns(!!shipper)}
                listLabels={indexListLabels({
                  species,
                  variety,
                  size,
                  packType,
                  plu,
                  shipper,
                })}
                to={to}
              />
            </div>
          )
        );
      }}
    />
  );
};

export default InventoryItems;
