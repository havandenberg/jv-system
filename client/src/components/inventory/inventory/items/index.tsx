import React from 'react';
import { useLocation } from 'react-router-dom';

import VirtualizedList from 'components/virtualized-list';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useInventoryQueryParams,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { InventoryItem } from 'types';

import { USE_NEW_PRE_INVENTORY } from '..';
import {
  getDetailedFilteredItems,
  getGroupedItems,
  getSortedItems,
  isPreInventoryItem,
} from '../utils';
import { indexListLabels } from './data-utils';
import ListItem from './list-item';

export const gridTemplateColumns = (
  hasShipper: boolean = true,
  secondaryDetailsIndex: string,
  isTotal: boolean,
) =>
  `1.5fr 120px ${hasShipper ? '' : '1fr '}${
    secondaryDetailsIndex || isTotal ? '1fr ' : ''
  } repeat(3, 65px) 50px 30px`;

interface Props {
  items: InventoryItem[];
}

const InventoryItems = ({ items }: Props) => {
  const { search } = useLocation();
  const [
    {
      shipper,
      species,
      variety,
      size,
      packType,
      plu,
      startDate,
      endDate,
      secondaryDetailsIndex,
    },
  ] = useInventoryQueryParams();
  const [{ sortBy = 'dischargeDate', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();

  const groupedItems = getGroupedItems(items);

  const detailsFilteredItems = secondaryDetailsIndex
    ? getDetailedFilteredItems(items, secondaryDetailsIndex)
    : groupedItems;

  const sortedItems = getSortedItems(
    indexListLabels({
      species,
      variety,
      size,
      packType,
      plu,
      shipper,
      secondaryDetailsIndex,
      isTotal: species === 'total',
    }),
    detailsFilteredItems,
    sortBy,
    sortOrder,
  );

  return (
    <VirtualizedList
      height={574}
      rowCount={sortedItems.length}
      rowRenderer={({ key, index, style }) => {
        const item = sortedItems[index] as InventoryItem;
        const to = secondaryDetailsIndex
          ? isPreInventoryItem(item) && USE_NEW_PRE_INVENTORY
            ? `/sales/projections?coast=${item.coast}&shipperId=${item.shipper?.id}&startDate=${startDate}&endDate=${endDate}&projectionsView=grid&vesselId=${item.vessel?.id}&projectionId=all`
            : `/inventory/items/${item.id}${search}`
          : `/inventory/index${search}&secondaryDetailsIndex=${item.vessel?.id}-${item.shipper?.id}`;

        return (
          item && (
            <div key={key} style={style}>
              <ListItem
                data={item}
                gridTemplateColumns={gridTemplateColumns(
                  !!shipper,
                  secondaryDetailsIndex,
                  species === 'total',
                )}
                listLabels={indexListLabels({
                  species,
                  variety,
                  size,
                  packType,
                  plu,
                  shipper,
                  secondaryDetailsIndex,
                  isTotal: species === 'total',
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
