import React, { useEffect, useMemo } from 'react';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { groupBy, isEmpty, pluck, sortBy } from 'ramda';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import { CommonProductTag } from 'components/tag-manager';
import { useInventoryQueryParams } from 'hooks/use-query-params';
import { InventoryItem, Vessel } from 'types';
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
  getInventoryStartDayIndex,
  reduceProductTags,
} from './utils';
import InventoryVessels from './vessels';

export const USE_NEW_PRE_INVENTORY = false;

export const gridTemplateColumns = (startDate: string) =>
  `1fr 60px repeat(${7 - getInventoryStartDayIndex(startDate)}, ${Math.ceil(
    280 / Math.max(3, 7 - getInventoryStartDayIndex(startDate)),
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
      speciesTag,
      varietyTag,
      sizeTag,
      packTypeTag,
      categoryTypes,
      ...rest
    },
  ] = useInventoryQueryParams();

  const { startDate: startDateQuery } = rest;
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
          { months: -3 },
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
  const vessels = ((vesselsData ? vesselsData.nodes : []) as Vessel[]).map(
    (vessel) => {
      if (!vessel.isPre || !USE_NEW_PRE_INVENTORY) {
        return vessel;
      }

      const { preInventoryItems } = convertProjectionsToInventoryItems(vessel);

      return { ...vessel, inventoryItems: { nodes: preInventoryItems } };
    },
  );

  const preInventoryItems = USE_NEW_PRE_INVENTORY
    ? pluck(
        'inventoryItems',
        vessels.filter((vessel) => vessel.isPre),
      )
        .map((its) => its.nodes)
        .flat()
    : [];

  const loading = itemsLoading || vesselsLoading;
  const error = itemsError || vesselsError;

  const allItems = [...items, ...preInventoryItems] as InventoryItem[];
  const allVessels = vessels;

  const {
    components,
    detailsFilteredItems,
    filteredItems,
    handleDateChange,
    handleWeekChange,
    selectedWeekNumber,
    startDate,
  } = useInventoryFilters({ items: allItems, loading });
  const [inventoryContext, setContext] = useInventoryContext();
  const { showPre } = inventoryContext;

  const setShowPre = (showPre: boolean) => {
    setContext({ ...inventoryContext, showPre });
  };

  const categoryTypesArray = categoryTypes ? categoryTypes.split(',') : [];
  const categoryType = categoryTypes
    ? categoryTypesArray[categoryTypesArray.length - 1]
    : '';

  const groupedItems = useMemo(
    () =>
      groupBy((item) => {
        const otherCategory = {
          id: 'other',
          packDescription: 'Other',
          label: {
            labelCode: 'other',
            labelName: 'Other',
          },
          shipperName: 'Other',
        };
        const itemSpecies = item.product?.species || otherCategory;
        const itemVariety = item.product?.variety || otherCategory;
        const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
        const itemPackType = item.product?.packType || otherCategory;
        const itemShipper = item.shipper || otherCategory;

        switch (categoryType) {
          case 'variety':
            return itemVariety.id;
          case 'size':
            return itemSize.id;
          case 'label':
            return `${itemPackType.label?.labelCode}`;
          case 'packType':
            return `${itemPackType.packDescription}`;
          case 'plu':
            return !!item.plu;
          case 'shipper':
            return itemShipper.id;
          case 'sizePackType':
            return `${itemSize.id} - ${itemPackType.packDescription}`;
          default:
            return itemSpecies.id;
        }
      }, filteredItems as InventoryItem[]),
    [filteredItems, categoryType],
  );

  const groupedItemsByTag = useMemo(
    () =>
      filteredItems.reduce((acc, item) => {
        const otherCategory = {
          id: 'other',
          packDescription: 'Other',
          shipperName: 'Other',
          commonSpeciesTags: { nodes: [] },
          commonVarietyTags: { nodes: [] },
          commonSizeTags: { nodes: [] },
          commonPackTypeTags: { nodes: [] },
        };
        const commonSpecies =
          item.product?.species?.commonSpecieses?.nodes.find(
            (cs) => cs && cs.productSpeciesId === item.product?.species?.id,
          ) || otherCategory;
        const commonVariety =
          item.product?.variety?.commonVarieties?.nodes.find(
            (cv) => cv && cv.productVarietyId === item.product?.variety?.id,
          ) || otherCategory;
        const commonSize =
          item.product?.sizes?.nodes[0]?.commonSizes?.nodes.find(
            (cs) =>
              cs && cs.productSizeId === item.product?.sizes?.nodes[0]?.id,
          ) || otherCategory;
        const commonPackType =
          item.product?.packType?.commonPackTypes?.nodes.find(
            (cpt) => cpt && cpt.packMasterId === item.product?.packType?.id,
          ) || otherCategory;

        switch (categoryType) {
          case 'species':
            return {
              ...acc,
              ...reduceProductTags(
                acc,
                (commonSpecies.commonSpeciesTags.nodes ||
                  []) as CommonProductTag[],
                item,
              ),
            };
          case 'variety':
            return {
              ...acc,
              ...reduceProductTags(
                acc,
                (commonVariety.commonVarietyTags.nodes ||
                  []) as CommonProductTag[],
                item,
              ),
            };
          case 'size':
            return {
              ...acc,
              ...reduceProductTags(
                acc,
                (commonSize.commonSizeTags.nodes || []) as CommonProductTag[],
                item,
              ),
            };
          case 'packType':
            return {
              ...acc,
              ...reduceProductTags(
                acc,
                (commonPackType.commonPackTypeTags.nodes ||
                  []) as CommonProductTag[],
                item,
              ),
            };
          default:
            return acc;
        }
      }, {} as { [key: string]: InventoryItem[] }),
    [filteredItems, categoryType],
  );

  const buildCategoriesParams = {
    categoryType,
    rest,
    categoryTypeOrder,
    categoryTypes,
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
    },
  };

  const categories = [
    ...Object.keys(groupedItemsByTag).map(
      buildCategories(groupedItemsByTag, {
        ...buildCategoriesParams,
        isTag: true,
      }),
    ),
    ...sortBy(
      ({ text }) => (text === 'Other' ? 'zzzzzzz' : text),
      Object.keys(groupedItems).map(
        buildCategories(groupedItems, {
          ...buildCategoriesParams,
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
        <l.AreaLink to="/sales/inventory/pallets">
          <b.Primary>Pallet Search</b.Primary>
        </l.AreaLink>
      }
      enableShadow={false}
      extraPaddingTop={
        itemsLoading || isEmpty(filteredItems)
          ? detailsFilteredItems
            ? 135
            : 192
          : detailsFilteredItems
          ? 135
          : 162
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
            setShowPre={setShowPre}
            showPre={showPre}
            startDate={startDate}
          />
        </>
      }
      title="Inventory"
    >
      {!isEmpty(filteredItems) && !loading ? (
        detailsFilteredItems ? (
          !isEmpty(detailsFilteredItems) ? (
            <InventoryItems items={detailsFilteredItems} />
          ) : (
            <DataMessage
              data={detailsFilteredItems}
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
                categoryId={category.id}
                categoryLink={category.link}
                categoryText={category.text}
                defaultInvSortKey={category.defaultInvSortKey}
                tagLink={category.tagLink}
                tagText={category.tagText}
                index={idx}
                items={{ ...groupedItemsByTag, ...groupedItems }[category.id]}
                key={idx}
                showPre={showPre}
              />
            ))}
            <InventoryRow
              categoryId="total"
              categoryText="Total"
              index={categories.length}
              items={filteredItems}
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
