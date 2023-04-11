import React, { useEffect } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { isEmpty, mapObjIndexed, pluck, sortBy } from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { useInventoryQueryParams } from 'hooks/use-query-params';
import { CommonSpecies, InventoryItem, Vessel } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { useInventoryContext } from './context';
import Header, { categoryTypeOrder } from './header';
import InventoryItems from './items';
import InventoryRow from './row';
import useInventoryFilters from './use-filters';
import {
  buildCategories,
  convertProjectionsToInventoryItems,
  getDetailedFilteredItems,
  getInventoryStartDayIndex,
} from './utils';
import InventoryVessels from './vessels';

export const USE_NEW_PRE_INVENTORY = false;

export const gridTemplateColumns = (startDate: string) =>
  `1fr 60px repeat(${8 - getInventoryStartDayIndex(startDate)}, ${Math.ceil(
    300 / Math.max(3, 8 - getInventoryStartDayIndex(startDate)),
  )}px) repeat(5, 90px) 60px`;

const Inventory = () => {
  const [
    {
      species,
      variety,
      size,
      sizePackType,
      packType,
      plu,
      shipper,
      countryOfOrigin,
      program,
      speciesTag,
      varietyTag,
      sizeTag,
      packTypeTag,
      categoryTypes,
      ...rest
    },
  ] = useInventoryQueryParams();

  const {
    detailsIndex,
    secondaryDetailsIndex,
    startDate: startDateQuery,
  } = rest;

  const {
    data: itemsData,
    loading: itemsLoading,
    error: itemsError,
  } = api.useInventoryItems(
    formatDate(
      startOfISOWeek(
        add(
          startDateQuery
            ? new Date(startDateQuery.replace(/-/g, '/'))
            : new Date(),
          { months: -6 },
        ),
      ),
    ),
    formatDate(
      endOfISOWeek(
        add(
          startDateQuery
            ? new Date(startDateQuery.replace(/-/g, '/'))
            : new Date(),
          { weeks: 4 },
        ),
      ),
    ),
  );
  const items = (itemsData ? itemsData.nodes : []) as InventoryItem[];

  const {
    data: vesselsData,
    loading: vesselsLoading,
    error: vesselsError,
  } = api.useVessels({ isInventory: true });
  const vessels = vesselsData.map((vessel) => {
    if (!vessel.isPre || !USE_NEW_PRE_INVENTORY) {
      return vessel;
    }

    const { preInventoryItems } = convertProjectionsToInventoryItems(vessel);

    return { ...vessel, inventoryItems: { nodes: preInventoryItems } };
  });

  const preInventoryItems = USE_NEW_PRE_INVENTORY
    ? pluck(
        'inventoryItems',
        vessels.filter((vessel) => vessel.isPre),
      )
        .map((its) => its.nodes)
        .flat()
    : [];

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = api.useCommonSpecieses();
  const commonSpecieses = (productsData?.nodes || []) as CommonSpecies[];

  const loading =
    !rest.coast || itemsLoading || vesselsLoading || productsLoading;
  const error = itemsError || vesselsError || productsError;

  const allItems = [...items, ...preInventoryItems] as InventoryItem[];
  const allVessels = vessels;

  const categoryTypesArray = categoryTypes ? categoryTypes.split(',') : [];
  const categoryType = categoryTypes
    ? categoryTypesArray[categoryTypesArray.length - 1]
    : '';
  const isDistressed = categoryTypes
    ? categoryTypesArray.includes('distressed')
    : false;

  const {
    components,
    groupedItems,
    handleDateChange,
    handleWeekChange,
    selectedWeekNumber,
    startDate,
  } = useInventoryFilters({
    categoryType,
    commonSpecieses,
    items: allItems,
    loading,
  });
  const allFilteredItemsByDateRange = Object.keys(
    groupedItems.categories,
  ).reduce((acc, catKey) => {
    const cat = groupedItems.categories[catKey];
    return {
      ...acc,
      ...mapObjIndexed((val, key) => [...(acc[key] || []), ...val], cat),
    };
  }, {} as { [key: string]: InventoryItem[] });
  const filteredItems = Object.values(allFilteredItemsByDateRange).flat();

  const [inventoryContext, setContext] = useInventoryContext();
  const { showPre } = inventoryContext;

  const setShowPre = (showPre: boolean) => {
    setContext({ ...inventoryContext, showPre });
  };

  const buildCategoriesParams = {
    categoryType,
    rest,
    categoryTypeOrder,
    categoryTypes,
    commonSpecieses,
    params: {
      species,
      variety,
      size,
      packType,
      sizePackType,
      plu,
      shipper,
      speciesTag,
      varietyTag,
      sizeTag,
      packTypeTag,
      countryOfOrigin,
      program,
    },
  };

  const nonDistressedCategories = Object.keys(groupedItems.categories).filter(
    (key) => key !== 'distressed',
  );

  const categories = [
    ...(!species || isDistressed || !groupedItems.categories.distressed
      ? []
      : [
          buildCategories(groupedItems.categories, {
            ...buildCategoriesParams,
            isDistressed: true,
            isTag: false,
          })('distressed'),
        ]),
    ...Object.keys(groupedItems.tags).map(
      buildCategories(groupedItems.tags, {
        ...buildCategoriesParams,
        isDistressed: false,
        isTag: true,
      }),
    ),
    ...sortBy(
      ({ text }) => (text === 'Other' ? 'zzzzzzz' : text),
      nonDistressedCategories.map(
        buildCategories(groupedItems.categories, {
          ...buildCategoriesParams,
          isDistressed: false,
          isTag: false,
        }),
      ),
    ),
  ];

  useEffect(() => {
    if (!startDateQuery) {
      handleDateChange(
        {
          selection: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
          },
        },
        'replaceIn',
      );
    }
  }, [handleDateChange, startDateQuery]);

  return (
    <Page
      actions={
        <l.AreaLink to="/inventory/pallets">
          <b.Primary>Pallets</b.Primary>
        </l.AreaLink>
      }
      enableShadow={false}
      extraPaddingTop={
        itemsLoading || isEmpty(filteredItems)
          ? detailsIndex
            ? 135
            : 192
          : detailsIndex
          ? 135
          : 162
      }
      headerChildren={
        <>
          <l.Flex>{components}</l.Flex>
          <Header
            detailItems={
              detailsIndex
                ? secondaryDetailsIndex
                  ? getDetailedFilteredItems(
                      filteredItems,
                      secondaryDetailsIndex,
                    )
                  : filteredItems
                : undefined
            }
            handleWeekChange={handleWeekChange}
            loading={itemsLoading}
            selectedWeekNumber={selectedWeekNumber}
            setShowPre={setShowPre}
            showPre={showPre}
            startDate={startDate}
          />
        </>
      }
      title="Inventory"
    >
      {!isEmpty(filteredItems) && !loading ? (
        detailsIndex ? (
          !isEmpty(filteredItems) ? (
            <InventoryItems items={filteredItems} />
          ) : (
            <DataMessage
              data={filteredItems}
              error={error}
              loading={loading}
              emptyProps={{
                header: 'No inventory items found',
                text: 'Modify date parameters to view more results.',
              }}
            />
          )
        ) : (
          <>
            <InventoryVessels vessels={allVessels as Vessel[]} />
            {categories.map((category, idx) => (
              <InventoryRow
                categoryId={`${category.id}`}
                categoryLink={category.link}
                categoryText={category.text}
                defaultInvSortKey={category.defaultInvSortKey}
                tagLink={category.tagLink}
                tagText={category.tagText}
                index={idx}
                itemsByDateRange={
                  { ...groupedItems.tags, ...groupedItems.categories }[
                    `${category.id}`
                  ]
                }
                key={idx}
                showPre={showPre}
              />
            ))}
            <InventoryRow
              categoryId="total"
              categoryText="Total"
              index={categories.length}
              itemsByDateRange={allFilteredItemsByDateRange}
              showPre={showPre}
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
            header: 'No inventory items found',
            text: 'Modify date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Inventory;
