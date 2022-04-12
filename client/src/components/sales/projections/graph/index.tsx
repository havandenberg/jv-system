import React, { useEffect, useState } from 'react';
import { capitalCase, pascalCase } from 'change-case';
import {
  add,
  differenceInCalendarWeeks,
  format,
  startOfISOWeek,
} from 'date-fns';
import {
  isEmpty,
  last,
  mapObjIndexed,
  pluck,
  sortBy,
  sum,
  times,
  uniqBy,
  values,
} from 'ramda';
import { useLocation } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
} from 'recharts';

import api from 'api';
import ColorPicker from 'components/color-picker';
import useItemSelector from 'components/item-selector';
import Breadcrumbs from 'components/nav/breadcrumbs';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { useTabBar } from 'components/tab-bar';
import { CommonProductTag } from 'components/tag-manager';
import {
  useProjectionsQueryParams,
  useQueryValue,
} from 'hooks/use-query-params';
import usePrevious from 'hooks/use-previous';
import {
  Maybe,
  Shipper,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';
import { LineItemCheckbox } from 'ui/checkbox';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { defaultColorSet } from 'ui/utils';
import { getWeekNumber } from 'utils/date';

import { ShipperProjectionProps } from '..';
import ProjectionSettings from '../settings';

const getShipperDisplayName = (shipper: Shipper) =>
  `${shipper.shipperName} (${shipper.id})`;

const getWeekText = (date: Date) =>
  `${getWeekNumber(date)} (${format(startOfISOWeek(date), 'MMM dd')})`;

export const graphTabs = (groupingKey: string, hasSelectedShipper: boolean) => {
  const crumbs = [
    {
      id: 'by-item',
      text: `By ${capitalCase(groupingKey)}`,
    },
    {
      id: 'by-tags',
      text: `By ${capitalCase(groupingKey)} Tag`,
    },
  ];
  if (!hasSelectedShipper) {
    crumbs.push({
      id: 'by-shipper',
      text: 'By Shipper',
    });
  }
  return crumbs;
};

interface UniqueItem {
  color?: string;
  commonProductId?: string;
  name: string;
  tags: CommonProductTag[];
}

const ShipperProjectionGraph = ({
  CoastTabBar,
  DateRangePicker,
  Reset,
  ViewTabBar,
  selectedShipper,
  setShipperId,
  shipperDataError,
  shipperDataLoading,
  shippers,
}: ShipperProjectionProps) => {
  const { pathname, search } = useLocation();

  const { ItemSelector: ShipperItemSelector, clearSearch } =
    useItemSelector<Shipper>({
      selectItem: (shipper) => {
        setShipperId(shipper.id);
      },
      allItems: shippers as Shipper[],
      closeOnSelect: true,
      clearSearchOnBlur: true,
      excludedItems: [],
      error: shipperDataError,
      errorLabel: 'Shippers',
      loading: shipperDataLoading,
      nameKey: 'shipperName',
      onClear: () => setShipperId(undefined),
      onlyClearSearch: true,
      placeholder: 'Select shipper',
      selectedItem: selectedShipper
        ? `${selectedShipper.shipperName} (${selectedShipper.id})`
        : undefined,
      width: 300,
    });

  const [startDateQuery] = useQueryValue('startDate');
  const startDate = startDateQuery
    ? new Date(startDateQuery.replace(/-/g, '/'))
    : new Date();
  const [endDateQuery] = useQueryValue('endDate');
  const endDate = endDateQuery
    ? new Date(endDateQuery.replace(/-/g, '/'))
    : new Date();
  const hasDateRange = startDateQuery !== endDateQuery;

  const XTick = ({ payload, x, y }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={24}
        textAnchor="middle"
        fill={th.colors.brand.primary}
        fontSize={th.fontSizes.caption}
        fontWeight={payload.value === getWeekText(new Date()) ? 700 : undefined}
        opacity={th.opacities.secondary}
      >
        {payload.value}
      </text>
    </g>
  );

  const YTick = ({ payload, x, y }: any) => (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={8}
        dx={-16}
        textAnchor="middle"
        fill={th.colors.brand.secondary}
      >
        {payload.value}
      </text>
    </g>
  );

  const [
    { species, variety, size, packType, plu, ...rest },
    setProjectionQueryParams,
  ] = useProjectionsQueryParams();

  const getGroupingKey = () => {
    if (species && variety && size && packType) {
      return 'plu';
    }
    if (species && variety && size) {
      return 'packType';
    }
    if (species && variety) {
      return 'size';
    }
    if (species) {
      return 'variety';
    }
    return 'species';
  };

  const groupingKey = getGroupingKey();

  const {
    handleSelectTab,
    TabBar: GraphTabBar,
    selectedTabId: graphView,
  } = useTabBar(
    graphTabs(groupingKey, !!selectedShipper),
    false,
    'by-item',
    'graphView',
    0,
  );

  const viewByShipper = graphView === 'by-shipper';
  const viewByTags = graphView === 'by-tags';

  const types = [
    { key: 'species', text: species || 'All Species', value: species },
    {
      key: 'variety',
      text: variety || `All ${viewByTags ? 'Variety Tags' : 'Varieties'}`,
      value: variety,
    },
    {
      key: 'size',
      text: size || `All ${viewByTags ? 'Size Tags' : 'Sizes'}`,
      value: size,
    },
    {
      key: 'packType',
      text: packType || `${viewByTags ? 'Pack Type Tags' : 'All Pack Types'}`,
      value: packType,
    },
    { key: 'plu', text: plu || 'All PLUs', value: plu },
  ];
  const activeTypes = types.filter(({ value }) => !!value);

  const getBreadcrumbs = () => {
    const restParams = values(
      mapObjIndexed((value, key) => (value ? `${key}=${value}` : ''), rest),
    )
      .filter((value) => value)
      .join('&');
    const restParamString = restParams ? `${restParams}&` : '';

    return [
      {
        active: !species,
        text: `All Products`,
        to: `/sales/projections?${restParams}`,
      },
      ...activeTypes.map(({ text }, idx) => {
        const existingCategoriesParam = activeTypes
          .slice(0, idx + 1)
          .map(({ key }) => {
            switch (key) {
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

        return {
          active: idx === activeTypes.length - 1,
          text: capitalCase(text.replace('-tag', '')),
          to: `/sales/projections?${restParamString}${existingCategoriesParam}`,
        };
      }),
      {
        active: true,
        text: viewByShipper
          ? 'All Shippers'
          : packType
          ? types[activeTypes.length]?.text
          : capitalCase(types[activeTypes.length]?.text || ''),
        to: `${pathname}${search}`,
      },
    ];
  };

  const { data, loading, error } = api.useShipperProjectionVesselInfos();
  const vessels = sortBy(
    (vesselInfo) =>
      vesselInfo?.vessel?.shipper?.shipperName || 'Unknown shipper',
    ((data ? data.nodes : []) as ShipperProjectionVesselInfo[]).filter(
      (vesselInfo) =>
        vesselInfo?.id ===
        last(
          (vesselInfo.vessel?.shipperProjectionVesselInfosByVesselId.nodes ||
            []) as ShipperProjectionVesselInfo[],
        )?.id,
    ),
  );

  const getUniqueList = (key: keyof ShipperProjectionProduct) =>
    sortBy(
      (item: UniqueItem) => item.name || 'zzzzzz',
      uniqBy(
        ({ commonProductId, name }) =>
          viewByShipper ? name : commonProductId || name,
        vessels
          .map((vessel) =>
            (
              vessel.shipperProjectionEntriesByVesselInfoId
                .nodes as ShipperProjectionEntry[]
            )
              .filter((item) => {
                const {
                  species: itemSpecies,
                  variety: itemVariety,
                  size: itemSize,
                  packType: itemPackType,
                  plu: itemPlu,
                  commonSpecies,
                  commonVariety,
                  commonSize,
                  commonPackType,
                } = item.product || {};

                const hasValidTags = (
                  tags: Maybe<CommonProductTag>[] | undefined,
                  tagParam: string,
                ) =>
                  pluck('tagText', (tags || []) as CommonProductTag[]).includes(
                    tagParam.replace('-tag', ''),
                  );

                return (
                  (!species ||
                    itemSpecies === species ||
                    hasValidTags(
                      commonSpecies?.commonSpeciesTags?.nodes,
                      species,
                    )) &&
                  (!variety ||
                    itemVariety === variety ||
                    hasValidTags(
                      commonVariety?.commonVarietyTags?.nodes,
                      variety,
                    )) &&
                  (!size ||
                    itemSize === size ||
                    hasValidTags(commonSize?.commonSizeTags?.nodes, size)) &&
                  (!packType ||
                    itemPackType === packType ||
                    hasValidTags(
                      commonPackType?.commonPackTypeTags?.nodes,
                      packType,
                    )) &&
                  (!plu || itemPlu === plu)
                );
              })
              .map((entry) => ({
                color: viewByShipper
                  ? undefined
                  : entry.product?.[
                      `common${pascalCase(
                        key,
                      )}` as keyof ShipperProjectionProduct
                    ]?.uiColor,
                commonProductId:
                  entry.product?.[
                    `common${pascalCase(
                      key,
                    )}Id` as keyof ShipperProjectionProduct
                  ],
                name: viewByShipper
                  ? getShipperDisplayName(vessel?.projection?.shipper!)
                  : entry.product?.[
                      `common${pascalCase(
                        key,
                      )}` as keyof ShipperProjectionProduct
                    ]?.[`${pascalCase(key)}Name`] ||
                    entry?.product?.[key] ||
                    '',
                tags:
                  entry.product?.[
                    `common${pascalCase(key)}` as keyof ShipperProjectionProduct
                  ]?.[`common${pascalCase(key)}Tags`]?.nodes || [],
              })),
          )
          .flat(),
      ),
    );

  const uniqueList = getUniqueList(groupingKey);
  const uniqueTagList = sortBy(
    ({ tagText }: CommonProductTag) => tagText,
    uniqBy(({ tagText }) => tagText, pluck('tags', uniqueList).flat()),
  ).map(({ tagText }) => ({ name: tagText || '' } as UniqueItem));
  const itemList = viewByTags ? uniqueTagList : uniqueList;
  const previousItemList = usePrevious(itemList);

  const [selectedItems, setSelectedItems] = useState<string[]>(
    pluck('name', itemList),
  );
  const isAllSelected = selectedItems.length === itemList.length;

  const toggleSelectItem = (itemName: string) => {
    if (selectedItems.includes(itemName)) {
      if (isAllSelected) {
        setSelectedItems([itemName]);
      } else {
        setSelectedItems(selectedItems.filter((name) => name !== itemName));
      }
    } else {
      setSelectedItems([...selectedItems, itemName]);
    }
  };

  const selectAllItems = () => {
    setSelectedItems(pluck('name', itemList));
  };

  const unselectAllItems = () => {
    setSelectedItems([]);
  };

  const getData = () => {
    const data = hasDateRange
      ? times(
          (idx) => ({ week: getWeekText(add(startDate, { weeks: idx })) }),
          differenceInCalendarWeeks(endDate, startDate) + 1,
        )
      : [
          ...times(
            (idx) => ({
              week: getWeekText(add(startDate, { weeks: -1 * (idx + 1) })),
            }),
            4,
          ).reverse(),
          { week: getWeekText(startDate) },
          ...times(
            (idx) => ({
              week: getWeekText(add(startDate, { weeks: idx + 1 })),
            }),
            4,
          ),
        ];

    return data.map((weekData) => {
      const vesselsByWeek = vessels.filter(
        (v) =>
          getWeekText(add(new Date(v.departureDate), { weeks: 1 })) ===
          weekData.week,
      );

      return {
        ...weekData,
        ...itemList.reduce(
          (acc, { commonProductId, name: item }) => ({
            ...acc,
            [item]: sum(
              vesselsByWeek
                .map((vessel) =>
                  vessel.shipperProjectionEntriesByVesselInfoId.nodes
                    .filter((entry) => {
                      const {
                        species: itemSpecies,
                        variety: itemVariety,
                        size: itemSize,
                        packType: itemPackType,
                        plu: itemPlu,
                        commonSpecies,
                        commonVariety,
                        commonSize,
                        commonPackType,
                      } = entry?.product || {};

                      const hasValidTags = (
                        tags: Maybe<CommonProductTag>[] | undefined,
                        tagParam: string,
                      ) =>
                        pluck(
                          'tagText',
                          (tags || []) as CommonProductTag[],
                        ).includes(tagParam?.replace('-tag', ''));

                      const hasValidSpeciesTags = hasValidTags(
                        commonSpecies?.commonSpeciesTags?.nodes,
                        species,
                      );
                      const isValidSpecies =
                        !species ||
                        (groupingKey === 'species' &&
                        (viewByTags ? hasValidSpeciesTags : commonProductId)
                          ? commonProductId === `${commonSpecies?.id}`
                          : itemSpecies === species || hasValidSpeciesTags);

                      const hasValidVarietyTags = hasValidTags(
                        commonSpecies?.commonSpeciesTags?.nodes,
                        variety,
                      );
                      const isValidVariety =
                        !variety ||
                        (groupingKey === 'variety' &&
                        (viewByTags ? hasValidVarietyTags : commonProductId)
                          ? commonProductId === `${commonVariety?.id}`
                          : itemVariety === variety || hasValidVarietyTags);

                      const hasValidSizeTags = hasValidTags(
                        commonSize?.commonSizeTags?.nodes,
                        size,
                      );
                      const isValidSize =
                        !size ||
                        (groupingKey === 'size' &&
                        (viewByTags ? hasValidSizeTags : commonProductId)
                          ? commonProductId === `${commonSize?.id}`
                          : itemSize === size || hasValidSizeTags);

                      const hasValidPackTypeTags = hasValidTags(
                        commonPackType?.commonPackTypeTags?.nodes,
                        packType,
                      );
                      const isValidPackType =
                        !packType ||
                        (groupingKey === 'packType' &&
                        (viewByTags ? hasValidPackTypeTags : commonProductId)
                          ? commonProductId === `${commonPackType?.id}`
                          : itemPackType === packType || hasValidPackTypeTags);

                      const isValidPlu = !plu || itemPlu === plu;

                      return (
                        isValidSpecies &&
                        isValidVariety &&
                        isValidSize &&
                        isValidPackType &&
                        isValidPlu &&
                        (viewByShipper ||
                          (viewByTags
                            ? hasValidTags(
                                entry?.product?.[
                                  `common${pascalCase(
                                    groupingKey,
                                  )}` as keyof ShipperProjectionProduct
                                ]?.[`common${pascalCase(groupingKey)}Tags`]
                                  ?.nodes,
                                item,
                              )
                            : (entry?.product || {})[groupingKey] === item)) &&
                        (!viewByShipper ||
                          getShipperDisplayName(
                            vessel?.projection?.shipper!,
                          ) === item)
                      );
                    })
                    .map((entry) => entry?.palletCount),
                )
                .flat(),
            ),
          }),
          {},
        ),
      };
    });
  };

  const chartData = getData();

  const filteredItemList = itemList.filter(({ name }) =>
    selectedItems.includes(name),
  );

  useEffect(() => {
    if (!!selectedShipper && graphView === 'by-shipper') {
      handleSelectTab('by-item');
    }
  }, [handleSelectTab, selectedShipper, graphView]);

  useEffect(() => {
    if (
      previousItemList &&
      pluck('name', itemList).join() !== pluck('name', previousItemList).join()
    ) {
      setSelectedItems(pluck('name', itemList));
    }
  }, [itemList, previousItemList, graphView]);

  return (
    <Page
      actions={[<ProjectionSettings key={0} />]}
      extraPaddingTop={vessels.length > 0 ? 192 : 140}
      headerChildren={
        <>
          <l.Flex mb={th.spacing.lg}>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                View
              </ty.CaptionText>
              {ViewTabBar}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Shipper
              </ty.CaptionText>
              {ShipperItemSelector}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Coast
              </ty.CaptionText>
              {CoastTabBar}
            </l.Div>
            <l.Div mr={th.spacing.lg}>
              <ty.CaptionText mb={th.spacing.sm} secondary>
                Date Range
              </ty.CaptionText>
              {DateRangePicker}
            </l.Div>
            <div>
              <l.Div height={32} />
              <l.Div onClick={clearSearch}>{Reset}</l.Div>
            </div>
          </l.Flex>
          <l.Flex justifyBetween mb={th.spacing.md}>
            <Breadcrumbs
              breadcrumbs={getBreadcrumbs()}
              customStyles={{ text: { fontSize: th.fontSizes.body } }}
            />
            <GraphTabBar />
          </l.Flex>
          <l.Flex flexWrap="wrap">
            <l.Div mr={th.spacing.lg}>
              <LineItemCheckbox
                checked={isAllSelected}
                onChange={isAllSelected ? unselectAllItems : selectAllItems}
              />
            </l.Div>
            {itemList.map(({ color, commonProductId, name }, idx) => (
              <l.Flex
                alignCenter
                key={name}
                mb={th.spacing.sm}
                mr={th.spacing.lg}
              >
                <ColorPicker
                  activeColor={color || defaultColorSet[idx]}
                  color={color || defaultColorSet[idx]}
                  onChange={() => ({})}
                  readOnly
                />
                <l.Div ml={th.spacing.sm}>
                  <LineItemCheckbox
                    checked={selectedItems.includes(name)}
                    onChange={() => {
                      toggleSelectItem(name);
                    }}
                  />
                </l.Div>
                <ty.CaptionText
                  color={
                    viewByTags || commonProductId
                      ? th.colors.text.default
                      : th.colors.status.error
                  }
                  cursor="pointer"
                  link
                  ml={th.spacing.sm}
                  nowrap
                  onClick={() => {
                    setProjectionQueryParams({
                      [viewByShipper ? 'shipperId' : groupingKey]: `${name}${
                        viewByTags ? '-tag' : ''
                      }`,
                      graphView: 'by-item',
                    });
                  }}
                >
                  {packType ? name || 'No PLU' : name}
                </ty.CaptionText>
              </l.Flex>
            ))}
          </l.Flex>
        </>
      }
      title="Shipper Projections"
    >
      {!isEmpty(vessels) ? (
        <ResponsiveContainer width="100%" height={500}>
          <BarChart barSize={24} data={chartData} margin={{ left: 32 }}>
            <Tooltip />
            <CartesianGrid stroke={th.colors.brand.containerBackgroundAccent} />
            <XAxis
              dataKey="week"
              height={75}
              interval="preserveStartEnd"
              label={{
                position: 'insideBottom',
                value: 'Week Number',
              }}
              stroke={th.colors.brand.secondary}
              tick={<XTick />}
            />
            <YAxis
              allowDecimals={false}
              label={{
                angle: -90,
                position: 'left',
                value: 'Pallets',
              }}
              stroke={th.colors.brand.secondary}
              tick={<YTick />}
              width={60}
            />
            {filteredItemList.map(({ color, name }, idx) => (
              <Bar
                dataKey={name}
                key={name}
                fill={color || defaultColorSet[idx]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <DataMessage
          data={vessels}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No projections found',
            text: 'Modify search parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default ShipperProjectionGraph;
