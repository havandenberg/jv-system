import React, { useEffect } from 'react';
import { startOfISOWeek } from 'date-fns';
import { groupBy, isEmpty, mapObjIndexed, sortBy, values } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useInventoryQueryParams } from 'hooks/use-query-params';
import { InventoryItem, Vessel } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import Header, { categoryTypeOrder } from './header';
import InventoryItems from './items';
import InventoryRow from './row';
import useInventoryFilters from './use-filters';
import InventoryVessels from './vessels';

export const gridTemplateColumns =
  '1fr 60px repeat(7, 40px) repeat(5, 90px) 60px';

const Inventory = () => {
  const [{ species, variety, size, packType, plu, categoryTypes, ...rest }] =
    useInventoryQueryParams();

  const { startDate: startDateQuery } = rest;
  const {
    data: itemsData,
    loading: itemsLoading,
    error: itemsError,
  } = api.useInventoryItems();
  const items = itemsData ? itemsData.nodes : [];

  const {
    data: vesselsData,
    loading: vesselsLoading,
    error: vesselsError,
  } = api.useVessels(true);
  const vessels = vesselsData ? vesselsData.nodes : [];

  const loading = itemsLoading || vesselsLoading;
  const error = itemsError || vesselsError;

  const {
    components,
    detailsFilteredItems,
    filteredItems,
    handleDateChange,
    handleWeekChange,
    selectedWeekNumber,
    startDate,
  } = useInventoryFilters({ items: items as InventoryItem[], loading });

  const categoryTypesArray = categoryTypes ? categoryTypes.split(',') : [];
  const categoryType = categoryTypes
    ? categoryTypesArray[categoryTypesArray.length - 1]
    : '';

  const groupedItems = groupBy((item) => {
    const otherCategory = { id: 'other', packDescription: 'other' };
    const itemSpecies = item.product?.species || otherCategory;
    const itemVariety = item.product?.variety || otherCategory;
    const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
    const itemPackType = item.product?.packType || otherCategory;

    switch (categoryType) {
      case 'variety':
        return itemVariety.id;
      case 'size':
        return itemSize.id;
      case 'packType':
        return itemPackType.packDescription;
      case 'plu':
        return !!item.plu;
      default:
        return itemSpecies.id;
    }
  }, filteredItems as InventoryItem[]);

  const categories = sortBy(
    ({ text }) => (text === 'Other' ? 'zzzzzzz' : text),
    Object.keys(groupedItems).map((key) => {
      const item = groupedItems[key][0];
      const itemSpecies = item.product?.species || {
        id: 'other',
        speciesDescription: '',
      };
      const itemVariety = item.product?.variety || {
        id: 'other',
        varietyDescription: '',
      };
      const itemSize = item.product?.sizes?.nodes[0] || {
        id: 'other',
        jvDescription: '',
      };
      const itemPackType = item.product?.packType || {
        id: 'other',
        packDescription: 'other',
      };

      const getId = () => {
        switch (categoryType) {
          case 'variety':
            return itemVariety.id;
          case 'size':
            return itemSize.id;
          case 'packType':
            return itemPackType.packDescription;
          case 'plu':
            return item.plu ? 'true' : 'false';
          default:
            return itemSpecies.id;
        }
      };
      const id = getId();

      const getText = () => {
        switch (categoryType) {
          case 'variety':
            return itemVariety.varietyDescription;
          case 'size':
            return itemSize.jvDescription;
          case 'packType':
            return itemPackType.packDescription === 'other'
              ? ''
              : itemPackType.packDescription;
          case 'plu':
            return item.plu ? 'PLU' : 'No PLU';
          default:
            return itemSpecies.speciesDescription;
        }
      };
      const text = getText() || 'Other';

      const restParams = values(
        mapObjIndexed((value, key) => (value ? `${key}=${value}` : ''), rest),
      )
        .filter((value) => value)
        .join('&');
      const restParamString = restParams ? `${restParams}&` : '';

      const existingCategoriesParam = categoryTypeOrder
        .filter((type) => {
          switch (type) {
            case 'variety':
              return !!variety;
            case 'size':
              return !!size;
            case 'packType':
              return !!packType;
            case 'plu':
              return !!plu;
            default:
              return !!species;
          }
        })
        .map((type) => {
          switch (type) {
            case 'variety':
              return `variety=${variety}`;
            case 'size':
              return `size=${size}`;
            case 'packType':
              return `packType=${packType}`;
            case 'plu':
              return `plu=${plu}`;
            default:
              return `species=${species}`;
          }
        })
        .join('&');
      const existingCategoriesParamString = existingCategoriesParam
        ? `${existingCategoriesParam}&`
        : '';

      const nextCategoryType = categoryTypeOrder
        .filter((type) => type !== categoryType)
        .find((type) => {
          switch (type) {
            case 'variety':
              return !variety;
            case 'size':
              return !size;
            case 'packType':
              return !packType;
            case 'plu':
              return !plu;
            default:
              return !species;
          }
        });

      const link = `/sales/inventory?${restParamString}${existingCategoriesParamString}${categoryType}=${id}&categoryTypes=${categoryTypes},${nextCategoryType}`;

      return {
        id,
        link,
        text,
      };
    }),
  );

  useEffect(() => {
    if (!startDateQuery) {
      handleDateChange({
        selection: {
          startDate: startOfISOWeek(new Date()),
          endDate: startOfISOWeek(new Date()),
          key: 'selection',
        },
      });
    }
  }, [handleDateChange, startDateQuery]);

  return (
    <Page
      actions={[
        <l.AreaLink key={0} to="/sales/inventory/pallets">
          <b.Primary>Pallets</b.Primary>
        </l.AreaLink>,
      ]}
      enableShadow={false}
      extraPaddingTop={
        itemsLoading || isEmpty(filteredItems)
          ? detailsFilteredItems
            ? 135
            : 192
          : detailsFilteredItems
          ? 135
          : 168
      }
      headerChildren={
        <>
          <l.Flex>{components}</l.Flex>
          <Header
            detailItems={
              detailsFilteredItems ? detailsFilteredItems : undefined
            }
            handleWeekChange={handleWeekChange}
            loading={itemsLoading}
            selectedWeekNumber={selectedWeekNumber}
            startDate={startDate}
          />
        </>
      }
      title="Inventory"
    >
      {!isEmpty(filteredItems) ? (
        detailsFilteredItems ? (
          !isEmpty(detailsFilteredItems) ? (
            <InventoryItems items={detailsFilteredItems} />
          ) : (
            <DataMessage
              data={detailsFilteredItems}
              error={error}
              loading={loading}
              emptyProps={{
                header: 'No Inventory Items Found 😔',
                text: 'Modify date parameters to view more results.',
              }}
            />
          )
        ) : (
          <>
            <InventoryVessels vessels={vessels as Vessel[]} />
            {categories.map((category, idx) => (
              <InventoryRow
                categoryId={category.id}
                categoryLink={category.link}
                categoryText={category.text}
                index={idx}
                items={groupedItems[category.id]}
                key={idx}
              />
            ))}
            <InventoryRow
              categoryId="total"
              categoryText="Total"
              index={categories.length}
              items={filteredItems}
            />
            <l.Div
              borderTop={th.borders.disabled}
              height="1px"
              mb={th.spacing.xxl}
              width={th.sizes.fill}
            />
          </>
        )
      ) : (
        <DataMessage
          data={filteredItems}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Inventory Items Found 😔',
            text: 'Modify date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Inventory;
