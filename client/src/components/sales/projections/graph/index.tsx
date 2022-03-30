import React, { useEffect } from 'react';
import { capitalCase } from 'change-case';
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
  sortBy,
  sum,
  times,
  uniq,
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
import {
  useProjectionsQueryParams,
  useQueryValue,
} from 'hooks/use-query-params';
import {
  Shipper,
  ShipperProjectionEntry,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';
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
  ];
  if (!hasSelectedShipper) {
    crumbs.push({
      id: 'by-shipper',
      text: 'By Shipper',
    });
  }
  return crumbs;
};

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

  const types = [
    { key: 'species', text: species || 'All Species', value: species },
    { key: 'variety', text: variety || 'All Varieties', value: variety },
    { key: 'size', text: size || 'All Sizes', value: size },
    { key: 'packType', text: packType || 'All Pack Types', value: packType },
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
          text: capitalCase(text),
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
    uniq(
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
              } = item.product || {};
              return (
                (!species || itemSpecies === species) &&
                (!variety || itemVariety === variety) &&
                (!size || itemSize === size) &&
                (!packType || itemPackType === packType) &&
                (!plu || itemPlu === plu)
              );
            })
            .map((entry) =>
              viewByShipper
                ? getShipperDisplayName(vessel?.projection?.shipper!)
                : entry?.product?.[key],
            ),
        )
        .flat()
        .sort(),
    );

  const itemList = getUniqueList(groupingKey);

  const getData = () => {
    const data = hasDateRange
      ? times(
          (idx) => ({ week: getWeekText(add(startDate, { weeks: idx })) }),
          differenceInCalendarWeeks(endDate, startDate) + 5,
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
          (acc, item) => ({
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
                      } = entry?.product || {};
                      return (
                        (!species || itemSpecies === species) &&
                        (!variety || itemVariety === variety) &&
                        (!size || itemSize === size) &&
                        (!packType || itemPackType === packType) &&
                        (!plu || itemPlu === plu) &&
                        (viewByShipper ||
                          (entry?.product || {})[groupingKey] === item) &&
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

  useEffect(() => {
    if (!!selectedShipper && graphView === 'by-shipper') {
      handleSelectTab('by-item');
    }
  }, [handleSelectTab, selectedShipper, graphView]);

  return (
    <Page
      actions={[<ProjectionSettings key={0} />]}
      extraPaddingTop={vessels.length > 0 ? 232 : 155}
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
          <l.Flex justifyBetween mb={th.spacing.lg}>
            <Breadcrumbs
              breadcrumbs={getBreadcrumbs()}
              customStyles={{ text: { fontSize: th.fontSizes.body } }}
            />
            <GraphTabBar />
          </l.Flex>
          <l.Flex alignCenter flexWrap="wrap">
            {itemList.map((item, idx) => (
              <l.Flex
                alignCenter
                key={item}
                mb={th.spacing.sm}
                mr={th.spacing.lg}
              >
                <ColorPicker
                  activeColor={defaultColorSet[idx]}
                  color={defaultColorSet[idx]}
                  onChange={() => ({})}
                />
                <ty.CaptionText
                  cursor="pointer"
                  link
                  ml={th.spacing.sm}
                  nowrap
                  onClick={() => {
                    setProjectionQueryParams({
                      [viewByShipper ? 'shipperId' : groupingKey]: item,
                    });
                  }}
                >
                  {packType ? item || 'No PLU' : item}
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
            {itemList.map((item, idx) => (
              <Bar dataKey={item} key={item} fill={defaultColorSet[idx]} />
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
