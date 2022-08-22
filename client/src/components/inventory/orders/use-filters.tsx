import React from 'react';
import { capitalCase } from 'change-case';
import { add, endOfISOWeek, format, isBefore } from 'date-fns';
import { pluck, sortBy } from 'ramda';

import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import { useTabBar } from 'components/tab-bar';
import { CommonProductTag } from 'components/tag-manager';
import useDateRange from 'hooks/use-date-range';
import {
  useDateRangeQueryParams,
  useOrdersQueryParams,
} from 'hooks/use-query-params';
import useSearch from 'hooks/use-search';
import { CommonSpecies, OrderItem, OrderMaster } from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import { coastTabs, ResetButton } from '../inventory/use-filters';
import {
  getDateInterval,
  getInventoryStartDayIndex,
  isWithinDateInterval,
} from '../inventory/utils';

interface Props {
  commonSpecieses: CommonSpecies[];
  expanded: boolean;
  items: OrderMaster[];
  loading: boolean;
  toggleExpanded: () => void;
}

interface Option {
  text: string;
  shortText: string;
  value: string | number;
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
  loading,
  toggleExpanded,
}: Props) => {
  const [selectedFilters, setQuery] = useOrdersQueryParams();

  const { TabBar: CoastFilter, selectedTabId: coast } = useTabBar(
    coastTabs,
    false,
    'EC',
    'coast',
    1,
  );

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
          if (key === 'species') {
            setQuery({
              ...selectedFilters,
              [key]: e.target.value || undefined,
              variety: undefined,
              size: undefined,
              packType: undefined,
            });
          } else {
            setQuery({
              ...selectedFilters,
              [key]: e.target.value || undefined,
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
      (opt) => (opt.text === 'Other' ? 'zzzzzzz' : opt.text.toLowerCase()),
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

  const { Search } = useSearch();

  const { DateRangePicker, BackwardButton, ForwardButton } = useDateRange({
    maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
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
  } = selectedFilters;

  const inventoryStartDateIndex = getInventoryStartDayIndex(startDate);
  const isStorage = parseInt(detailsIndex) === 13 - inventoryStartDateIndex;
  const isTotal = parseInt(detailsIndex) === 14 - inventoryStartDateIndex;

  const filteredItems = items.filter((orderMaster) => {
    const otherCategory = {
      id: 'other',
      speciesDescription: 'Other',
      varietyDescription: 'Other',
      sizeDescription: 'Other',
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
      const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
      const itemPackType = item.product?.packType || otherCategory;

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

      if (
        (!selectedFilters.species ||
          itemSpecies?.id === selectedFilters.species) &&
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
        (!selectedFilters.species ||
          itemSpecies?.id === selectedFilters.species) &&
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
      }

      if (
        itemSpecies.id === selectedFilters.species &&
        !varietyOptions.find(({ value }) => value === itemVariety?.id) &&
        detailsValid &&
        itemVariety
      ) {
        varietyOptions.push({
          text: `${itemVariety.varietyDescription}`,
          shortText: `${itemVariety.varietyDescription}`,
          value: itemVariety.id,
        });
      }

      if (
        itemSpecies.id === selectedFilters.species &&
        !sizeOptions.find(({ value }) => value === itemSize?.id) &&
        detailsValid &&
        itemSize
      ) {
        sizeOptions.push({
          text: `${itemSize.combineDescription}`,
          shortText: `${itemSize.combineDescription}`,
          value: itemSize.id,
        });
      }

      if (
        itemSpecies.id === selectedFilters.species &&
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
    });

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
      ].includes(filterKey) && selectedFilters[filterKey],
  ) as FilterKey[];

  const selectedFiltersString = (
    <l.Flex alignCenter flex={1}>
      {selectedFilterKeys.length > 0 ? (
        selectedFilterKeys.map((filterKey, idx) => {
          const shortText = filterOptions[filterKey].find(
            ({ value }) => value === selectedFilters[filterKey],
          )?.shortText;
          return shortText ? (
            <l.Flex alignCenter>
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

  return {
    components: (
      <>
        <l.Flex alignCenter mb={th.spacing.md}>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.sm} secondary>
              Coast
            </ty.SmallText>
            <CoastFilter />
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <l.Flex alignCenter justifyBetween mb={th.spacing.sm}>
              <ty.SmallText secondary>Search</ty.SmallText>
              {!loading && (
                <ty.SmallText secondary>
                  Results: {items ? filteredItems.length : '-'}
                </ty.SmallText>
              )}
            </l.Flex>
            {Search}
          </l.Div>
          <l.Div mr={th.spacing.lg}>
            <ty.SmallText mb={th.spacing.sm} secondary>
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
                to={`/inventory/orders?coast=${coast}`}
              >
                <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
              </l.AreaLink>
            </ResetButton>
          </div>
        </l.Flex>
        {expanded ? (
          <>
            <l.Flex alignStart justifyBetween mb={th.spacing.md}>
              <l.Flex alignCenter>
                {locationSelect}
                {countrySelect}
                {shipperSelect}
                {labelSelect}
                {pluSelect}
              </l.Flex>
              <l.HoverButton active onClick={toggleExpanded}>
                <MinusInCircle
                  fill={th.colors.brand.primary}
                  height={th.sizes.icon}
                  width={th.sizes.icon}
                />
              </l.HoverButton>
            </l.Flex>
            <l.Flex alignCenter mb={th.spacing.lg}>
              {speciesSelect}
              {species && (
                <>
                  {varietySelect}
                  {sizeSelect}
                  {packTypeSelect}
                </>
              )}
            </l.Flex>
          </>
        ) : (
          <l.Flex alignCenter mb={th.spacing.lg}>
            <l.Flex alignCenter flex={1}>
              <ty.CaptionText>Additional filters:</ty.CaptionText>
              {selectedFiltersString}
            </l.Flex>
            <l.HoverButton onClick={toggleExpanded}>
              <PlusInCircle
                fill={th.colors.brand.primary}
                height={th.sizes.icon}
                width={th.sizes.icon}
              />
            </l.HoverButton>
          </l.Flex>
        )}
      </>
    ),
    filteredItems,
    coast,
    selectedWeekNumber,
    startDate,
  };
};

export default useOrdersFilters;
