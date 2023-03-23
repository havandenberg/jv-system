import React, { useEffect } from 'react';
import { capitalCase } from 'change-case';
import { add, endOfISOWeek, format, isBefore } from 'date-fns';
import { pluck, sortBy } from 'ramda';

import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import { Tab, useTabBar } from 'components/tab-bar';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import { CommonProductTag } from 'components/tag-manager';
import { SORT_ORDER } from 'hooks/use-columns';
import useDateRange from 'hooks/use-date-range';
import usePrevious from 'hooks/use-previous';
import {
  useDateRangeQueryParams,
  useOrdersQueryParams,
  useQueryValue,
  useSortQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { CommonSpecies, OrderItem, OrderMaster } from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import { ResetButton } from '../inventory/use-filters';
import {
  getDateInterval,
  getInventoryStartDayIndex,
  isWithinDateInterval,
} from '../inventory/utils';

const tabs = (isInvoices: boolean): Tab[] => [
  {
    id: isInvoices ? 'invoices' : 'orders',
    text: isInvoices ? 'Invoices' : 'Orders',
  },
  {
    id: 'items',
    text: `Items`,
  },
];

interface Props {
  commonSpecieses: CommonSpecies[];
  expanded: boolean;
  items: OrderMaster[];
  isInvoices: boolean;
  loading: boolean;
  toggleExpanded: () => void;
}

interface Option {
  text: string;
  shortText: string;
  value: string | number;
  isTag?: boolean;
}

type FilterKey =
  | 'location'
  | 'shipper'
  | 'countryOfOrigin'
  | 'label'
  | 'species'
  | 'variety'
  | 'size'
  | 'packType'
  | 'plu';

const useOrdersFilters = ({
  commonSpecieses,
  expanded,
  items,
  isInvoices,
  loading,
  toggleExpanded,
}: Props) => {
  const [, setSortQueryParams] = useSortQueryParams();
  const [, setScrollTop] = useQueryValue('listScrollTop');
  const [selectedFilters, setQuery] = useOrdersQueryParams();
  const prevOrdersView = usePrevious(selectedFilters.view);

  const { TabBar: CoastFilter, selectedTabId: coast } = useCoastTabBar();

  const { TabBar } = useTabBar({
    tabs: tabs(isInvoices),
    isRoute: false,
    defaultTabId: isInvoices ? 'invoices' : 'orders',
    paramName: 'view',
    defaultTabIndex: 0,
    onSelectTab: () => {
      setScrollTop('0');
    },
  });

  useEffect(() => {
    if (selectedFilters.view !== prevOrdersView) {
      setSortQueryParams(
        {
          sortBy: 'expectedShipDate',
          sortOrder: SORT_ORDER.DESC,
        },
        'replaceIn',
      );
    }
  }, [setSortQueryParams, selectedFilters.view, prevOrdersView]);

  const getFilter = (
    key: FilterKey,
    optionList: Option[],
    selectWidth?: string | number,
  ) => (
    <div key={key}>
      <ty.SmallText mb={th.spacing.xs} secondary>
        {capitalCase(key)}
      </ty.SmallText>
      <Select
        mr={th.spacing.md}
        onChange={(e) => {
          const selectedOption = optionList.find(
            (option) => option.value === e.target.value,
          );
          const isTag = selectedOption?.isTag;
          if (key === 'species') {
            setQuery({
              ...selectedFilters,
              [key]: e.target.value || undefined,
              [`${key}Tag`]: isTag ? e.target.value : undefined,
              variety: undefined,
              size: undefined,
              packType: undefined,
            });
          } else {
            setQuery({
              ...selectedFilters,
              [key]: e.target.value || undefined,
              [`${key}Tag`]: isTag ? e.target.value : undefined,
            });
          }
        }}
        value={selectedFilters[key] || ''}
        width={selectWidth}
      >
        {optionList.map(({ text, value }) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </Select>
    </div>
  );

  const getOptions = (options: Option[]) => [
    { text: loading ? '...' : 'All', shortText: '', value: '' },
    ...sortBy(
      (opt) =>
        opt.text === 'Other'
          ? 'zzzzzzz'
          : opt.isTag
          ? `0 ${opt.text.toLowerCase()}`
          : opt.text.toLowerCase(),
      options,
    ),
  ];

  const locationOptions = [] as Option[];
  const countryOptions = [] as Option[];
  const shipperOptions = [] as Option[];
  const labelOptions = [] as Option[];
  const speciesOptions = [] as Option[];
  const varietyOptions = [] as Option[];
  const sizeOptions = [] as Option[];
  const packTypeOptions = [] as Option[];
  const pluOptions = [] as Option[];

  const { Search } = useSearch({ width: 241 });

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
    offsetLeft: -110,
  });

  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );
  const currentStartOfWeek = new Date(startDate.replace(/-/g, '/'));

  const {
    species,
    variety,
    size,
    label,
    packType,
    sizePackType,
    speciesTag,
    varietyTag,
    sizeTag,
    packTypeTag,
    plu,
    location,
    shipper,
    countryOfOrigin,
    detailsIndex,
    view,
  } = selectedFilters;

  const isOrders =
    !view || ['invoices', 'orders'].includes(selectedFilters.view);

  const inventoryStartDateIndex = getInventoryStartDayIndex(startDate);
  const isStorage = parseInt(detailsIndex) === 13 - inventoryStartDateIndex;
  const isTotal = parseInt(detailsIndex) === 14 - inventoryStartDateIndex;
  const isWeekTotal = parseInt(detailsIndex) === 15 - inventoryStartDateIndex;
  const allFilteredOrderItems = [] as OrderItem[];

  const filteredOrders = items.filter((orderMaster) => {
    const otherCategory = {
      id: 'other',
      speciesDescription: 'Other',
      varietyDescription: 'Other',
      combineDescription: 'Other',
      packDescription: 'Other',
      label: {
        labelCode: 'other',
        labelName: 'Other',
      },
      shipperName: 'Other',
      countryName: 'Other',
      commonSpeciesTags: { nodes: [] },
      commonVarietyTags: { nodes: [] },
      commonSizeTags: { nodes: [] },
      commonPackTypeTags: { nodes: [] },
    };
    const orderItems = (orderMaster.items.nodes || []) as OrderItem[];

    const filteredOrderItems = orderItems.filter((orderItem) => {
      const item = orderItem.inventoryItem;

      if (!item) {
        return false;
      }

      const itemSpecies = item.product?.species || otherCategory;
      const itemVariety = item.product?.variety || otherCategory;
      const itemSize = item.sizes?.nodes[0] || otherCategory;
      const itemPackType = item.packType || otherCategory;

      const commonSpecies = commonSpecieses.find(
        (cs) => cs && cs.productSpeciesId === itemSpecies?.id,
      );
      const commonSpeciesTags = (commonSpecies?.commonSpeciesTags?.nodes ||
        []) as CommonProductTag[];
      const commonVarietyTags = (commonSpecies?.commonVarieties?.nodes.find(
        (cv) => cv && cv.productVarietyId === itemVariety?.id,
      )?.commonVarietyTags?.nodes || []) as CommonProductTag[];
      const commonSizeTags = (commonSpecies?.commonSizes?.nodes.find(
        (cs) => cs && cs.productSizeId === itemSize?.id,
      )?.commonSizeTags?.nodes || []) as CommonProductTag[];
      const commonPackTypeTags = (commonSpecies?.commonPackTypes?.nodes.find(
        (cpt) => cpt && cpt.packMasterId === itemPackType?.id,
      )?.commonPackTypeTags?.nodes || []) as CommonProductTag[];

      const detailsValid =
        !detailsIndex ||
        (isStorage
          ? item.vessel &&
            isBefore(
              new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
              currentStartOfWeek,
            )
          : isTotal
          ? true
          : isWeekTotal
          ? item.vessel &&
            isBefore(
              new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
              endOfISOWeek(currentStartOfWeek),
            )
          : isWithinDateInterval(
              item,
              parseInt(detailsIndex, 10),
              currentStartOfWeek,
            ));

      if (
        !locationOptions.find(({ value }) => value === item.warehouse?.id) &&
        detailsValid &&
        item.warehouse
      ) {
        locationOptions.push({
          text: `${item.warehouse.warehouseName} (${item.warehouse.id})`,
          shortText: item.warehouse.warehouseName,
          value: item.warehouse.id,
        });
      }

      if (
        !countryOptions.find(({ value }) => value === item.country?.id) &&
        detailsValid &&
        item.country
      ) {
        countryOptions.push({
          text: `${item.country.countryName} (${item.country.id})`,
          shortText: item.country.countryName,
          value: item.country.id,
        });
      }

      if (
        (!selectedFilters.countryOfOrigin ||
          item.country?.id === selectedFilters.countryOfOrigin) &&
        !shipperOptions.find(({ value }) => value === item.shipper?.id) &&
        detailsValid &&
        item.shipper
      ) {
        shipperOptions.push({
          text: `${item.shipper.shipperName} (${item.shipper.id})`,
          shortText: item.shipper.shipperName,
          value: item.shipper.id,
        });
      }

      const isSpeciesValid =
        !selectedFilters.species ||
        itemSpecies.id === selectedFilters.species ||
        commonSpeciesTags.find(
          ({ tagText }) => selectedFilters.speciesTag === tagText,
        );

      if (
        isSpeciesValid &&
        !labelOptions.find(
          ({ value }) => value === itemPackType?.label?.labelCode,
        ) &&
        detailsValid &&
        itemPackType?.label
      ) {
        labelOptions.push({
          text: `${itemPackType.label.labelName}`,
          shortText: `${itemPackType.label.labelName}`,
          value: `${itemPackType.label.labelCode}`,
        });
      }

      if (
        isSpeciesValid &&
        !pluOptions.find(({ value }) => value === `${item.plu}`) &&
        detailsValid
      ) {
        pluOptions.push({
          text: `${item.plu}`,
          shortText: `${item.plu}`,
          value: `${item.plu}`,
        });
      }

      if (
        !speciesOptions.find(({ value }) => value === itemSpecies?.id) &&
        detailsValid &&
        itemSpecies
      ) {
        speciesOptions.push({
          text: `${itemSpecies.speciesDescription} (${itemSpecies.id})`,
          shortText: `${itemSpecies.speciesDescription}`,
          value: itemSpecies.id,
        });
        commonSpeciesTags.forEach((tag) => {
          if (!speciesOptions.find(({ value }) => value === tag.tagText)) {
            speciesOptions.push({
              text: `${tag.tagText} (tag)`,
              shortText: `${tag.tagText} (tag)`,
              value: tag.tagText,
              isTag: true,
            });
          }
        });
      }

      if (
        isSpeciesValid &&
        !varietyOptions.find(({ value }) => value === itemVariety?.id) &&
        detailsValid &&
        itemVariety
      ) {
        varietyOptions.push({
          text: `${itemVariety.varietyDescription}`,
          shortText: `${itemVariety.varietyDescription}`,
          value: itemVariety.id,
        });
        commonVarietyTags.forEach((tag) => {
          if (!varietyOptions.find(({ value }) => value === tag.tagText)) {
            varietyOptions.push({
              text: `${tag.tagText} (tag)`,
              shortText: `${tag.tagText} (tag)`,
              value: tag.tagText,
              isTag: true,
            });
          }
        });
      }

      if (
        isSpeciesValid &&
        !sizeOptions.find(
          ({ value }) => value === `${itemSize.combineDescription}`,
        ) &&
        detailsValid &&
        itemSize
      ) {
        sizeOptions.push({
          text: `${itemSize.combineDescription}`,
          shortText: `${itemSize.combineDescription}`,
          value: `${itemSize.combineDescription}`,
        });
        commonSizeTags.forEach((tag) => {
          if (!sizeOptions.find(({ value }) => value === tag.tagText)) {
            sizeOptions.push({
              text: `${tag.tagText} (tag)`,
              shortText: `${tag.tagText} (tag)`,
              value: tag.tagText,
              isTag: true,
            });
          }
        });
      }

      if (
        isSpeciesValid &&
        !packTypeOptions.find(
          ({ value }) => value === itemPackType?.packDescription,
        ) &&
        detailsValid &&
        itemPackType
      ) {
        packTypeOptions.push({
          text: `${itemPackType.packDescription}`,
          shortText: `${itemPackType.packDescription}`,
          value: `${itemPackType?.packDescription}`,
        });
        commonPackTypeTags.forEach((tag) => {
          if (!packTypeOptions.find(({ value }) => value === tag.tagText)) {
            packTypeOptions.push({
              text: `${tag.tagText} (tag)`,
              shortText: `${tag.tagText} (tag)`,
              value: tag.tagText,
              isTag: true,
            });
          }
        });
      }

      return (
        selectedFilters.coast === item.coast &&
        (!location || location === item.warehouse?.id) &&
        (!shipper || shipper === item.shipper?.id) &&
        (!countryOfOrigin || countryOfOrigin === item.country?.id) &&
        (species
          ? speciesTag
            ? pluck('tagText', commonSpeciesTags).includes(speciesTag)
            : ['total', itemSpecies?.id].includes(species)
          : !speciesTag ||
            pluck('tagText', commonSpeciesTags).includes(speciesTag)) &&
        (variety
          ? varietyTag
            ? pluck('tagText', commonVarietyTags).includes(varietyTag)
            : ['total', itemVariety?.id].includes(variety)
          : !varietyTag ||
            pluck('tagText', commonVarietyTags).includes(varietyTag)) &&
        (size
          ? sizeTag
            ? pluck('tagText', commonSizeTags).includes(sizeTag)
            : ['total', itemSize?.combineDescription].includes(size)
          : !sizeTag || pluck('tagText', commonSizeTags).includes(sizeTag)) &&
        (!label || ['total', itemPackType?.label?.labelCode].includes(label)) &&
        (packType
          ? packTypeTag
            ? commonPackTypeTags.includes(packTypeTag)
            : ['total', itemPackType?.packDescription].includes(packType)
          : !packTypeTag || commonPackTypeTags.includes(packTypeTag)) &&
        (!sizePackType ||
          [
            'total',
            `${itemSize?.id} - ${itemPackType?.packDescription}`,
          ].includes(sizePackType)) &&
        (!plu || ['total', item.plu ? 'true' : 'false'].includes(plu)) &&
        detailsValid
      );
    }) as OrderItem[];

    allFilteredOrderItems.push(...filteredOrderItems);

    return filteredOrderItems.some((val) => val);
  });

  const detailsDateRange = `${format(
    getDateInterval(detailsIndex, currentStartOfWeek).start,
    'M/dd',
  )} - ${format(
    add(getDateInterval(detailsIndex, currentStartOfWeek).end, {
      days: -1,
    }),
    'M/dd',
  )} (Week ${getWeekNumber(
    getDateInterval(detailsIndex, currentStartOfWeek).start,
  )})`;

  const detailsDateText = isStorage
    ? `Storage - older than ${format(currentStartOfWeek, 'M/dd')}`
    : isTotal
    ? 'All Dates'
    : isWeekTotal
    ? `This Week - thru ${format(endOfISOWeek(currentStartOfWeek), 'M/dd')}`
    : detailsDateRange;

  const filterOptions = {
    location: locationOptions,
    countryOfOrigin: countryOptions,
    shipper: shipperOptions,
    species: speciesOptions,
    variety: varietyOptions,
    size: sizeOptions,
    packType: packTypeOptions,
    label: labelOptions,
    plu: pluOptions,
  };

  const locationSelect = getFilter('location', getOptions(locationOptions));
  const countrySelect = getFilter(
    'countryOfOrigin',
    getOptions(countryOptions),
    150,
  );
  const shipperSelect = getFilter('shipper', getOptions(shipperOptions));
  const labelSelect = getFilter('label', getOptions(labelOptions), 120);
  const pluSelect = getFilter('plu', getOptions(pluOptions), 90);
  const speciesSelect = getFilter('species', getOptions(speciesOptions));
  const varietySelect = getFilter('variety', getOptions(varietyOptions));
  const sizeSelect = getFilter('size', getOptions(sizeOptions));
  const packTypeSelect = getFilter('packType', getOptions(packTypeOptions));

  const selectedFilterKeys = Object.keys(selectedFilters).filter(
    (filterKey) =>
      ![
        'coast',
        'startDate',
        'endDate',
        'detailsIndex',
        'speciesTag',
        'varietyTag',
        'sizeTag',
        'packTypeTag',
        'view',
      ].includes(filterKey) && selectedFilters[filterKey],
  ) as FilterKey[];

  const selectedFiltersString = (
    <l.Flex alignCenter flex={1}>
      {selectedFilterKeys.length > 0 ? (
        selectedFilterKeys.map((filterKey, idx) => {
          const shortText = filterOptions[filterKey]?.find(
            ({ value }) => value === selectedFilters[filterKey],
          )?.shortText;
          return shortText ? (
            <l.Flex alignCenter key={filterKey}>
              <ty.CaptionText mx={th.spacing.sm} secondary>
                {idx > 0 ? '|' : ''}
              </ty.CaptionText>
              <ty.CaptionText mr={th.spacing.xs} secondary>
                {capitalCase(filterKey)}:
              </ty.CaptionText>{' '}
              <ty.CaptionText>{shortText}</ty.CaptionText>
            </l.Flex>
          ) : null;
        })
      ) : (
        <ty.CaptionText ml={th.spacing.sm} secondary>
          none
        </ty.CaptionText>
      )}
    </l.Flex>
  );

  const hasOrderItems = allFilteredOrderItems.length > 0;

  const itemPrices = allFilteredOrderItems
    .map((item) => parseInt(item.unitSellPrice, 10))
    .filter((price) => price > 0);

  const { totalItemsPrice, totalPalletCount } = hasOrderItems
    ? allFilteredOrderItems.reduce<{
        totalItemsPrice: number;
        totalPalletCount: number;
      }>(
        (acc, item) => ({
          totalItemsPrice:
            acc.totalItemsPrice +
            parseFloat(item.unitSellPrice) * parseInt(item.palletCount, 10),
          totalPalletCount:
            acc.totalPalletCount + parseInt(item.palletCount, 10),
        }),
        { totalItemsPrice: 0, totalPalletCount: 0 },
      )
    : { totalItemsPrice: 0, totalPalletCount: 0 };

  const averagePrice = hasOrderItems
    ? (totalItemsPrice / totalPalletCount).toFixed(0)
    : '-';
  const lowPrice = hasOrderItems ? Math.min(...itemPrices) : '-';
  const highPrice = hasOrderItems ? Math.max(...itemPrices) : '-';

  const priceValues = (
    <l.Div position="absolute" top="-6px" right={0}>
      <ty.SmallText
        color={th.colors.brand.primaryAccent}
        mr={th.spacing.md}
        textAlign="right"
      >
        Plts:
        <ty.Span bold ml={th.spacing.xs} mr={th.spacing.sm}>
          {loading ? '-' : totalPalletCount}
        </ty.Span>
        |<l.Span ml={th.spacing.sm} />
        Avg Price:
        <ty.Span bold ml={th.spacing.xs}>
          ${loading ? '-' : averagePrice}
        </ty.Span>
      </ty.SmallText>
      <l.Flex justifyEnd mt={th.spacing.xs}>
        <ty.SmallText color={th.colors.status.error} nowrap textAlign="right">
          Low: <ty.Span bold>${loading ? '-' : lowPrice}</ty.Span>
        </ty.SmallText>
        <ty.SmallText
          color={th.colors.status.success}
          ml={th.spacing.sm}
          mr={th.spacing.md}
          nowrap
        >
          High: <ty.Span bold>${loading ? '-' : highPrice}</ty.Span>
        </ty.SmallText>
      </l.Flex>
    </l.Div>
  );

  return {
    components: (
      <>
        <l.Flex alignCenter mb={24}>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.xs} secondary>
              Coast
            </ty.SmallText>
            <CoastFilter />
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.xs} secondary>
              View
            </ty.SmallText>
            <TabBar />
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <l.Flex alignCenter justifyBetween mb={th.spacing.xs}>
              <ty.SmallText secondary>Search</ty.SmallText>
              {!loading && (
                <ty.SmallText secondary>
                  Results:{' '}
                  {items
                    ? isOrders
                      ? filteredOrders.length
                      : allFilteredOrderItems.length
                    : '-'}
                </ty.SmallText>
              )}
            </l.Flex>
            {Search}
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.xs} secondary>
              Date
            </ty.SmallText>
            {detailsIndex ? (
              <l.Flex alignCenter height={34}>
                <ty.BodyText>{detailsDateText}</ty.BodyText>
              </l.Flex>
            ) : (
              <l.Flex alignCenter>
                {DateRangePicker}
                {BackwardButton}
                {ForwardButton}
              </l.Flex>
            )}
          </l.Div>
          <div>
            <l.Div height={24} />
            <ResetButton>
              <l.AreaLink
                cursor="pointer"
                height={th.sizes.icon}
                width={th.sizes.icon}
                to={`${
                  isInvoices ? '/accounting/invoices' : '/inventory/orders'
                }?coast=${coast}`}
              >
                <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
              </l.AreaLink>
            </ResetButton>
          </div>
        </l.Flex>
        {expanded ? (
          <l.Div relative>
            <l.Flex alignStart justifyBetween mb={th.spacing.sm}>
              <l.Flex alignStart>
                <l.Div mr={th.spacing.md} relative>
                  <l.HoverButton active onClick={toggleExpanded}>
                    <MinusInCircle
                      fill={th.colors.brand.primary}
                      height={th.sizes.icon}
                      width={th.sizes.icon}
                    />
                  </l.HoverButton>
                  <l.HoverButton
                    cursor="pointer"
                    dark
                    height={th.sizes.icon}
                    width={th.sizes.icon}
                    position="absolute"
                    top={40}
                    onClick={() => {
                      setQuery({
                        species: undefined,
                        variety: undefined,
                        size: undefined,
                        packType: undefined,
                        plu: undefined,
                        label: undefined,
                        vesselCode: undefined,
                        shipper: undefined,
                        location: undefined,
                        countryOfOrigin: undefined,
                      });
                    }}
                  >
                    <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
                  </l.HoverButton>
                </l.Div>
                <l.Flex alignCenter>
                  {locationSelect}
                  {countrySelect}
                  {shipperSelect}
                  {labelSelect}
                  {pluSelect}
                </l.Flex>
              </l.Flex>
              {!isOrders && priceValues}
            </l.Flex>
            <l.Flex alignCenter mb={24} ml={40}>
              {speciesSelect}
              {species && (
                <>
                  {varietySelect}
                  {sizeSelect}
                  {packTypeSelect}
                </>
              )}
            </l.Flex>
          </l.Div>
        ) : (
          <l.Flex alignCenter mb={24} relative>
            <l.HoverButton mr={th.spacing.md} onClick={toggleExpanded}>
              <PlusInCircle
                fill={th.colors.brand.primary}
                height={th.sizes.icon}
                width={th.sizes.icon}
              />
            </l.HoverButton>
            <l.Flex alignCenter flex={1}>
              <ty.CaptionText>Additional filters:</ty.CaptionText>
              {selectedFiltersString}
            </l.Flex>
            {!isOrders && priceValues}
          </l.Flex>
        )}
      </>
    ),
    filteredOrders,
    filteredOrderItems: allFilteredOrderItems,
    coast,
    selectedWeekNumber,
    startDate,
  };
};

export default useOrdersFilters;
