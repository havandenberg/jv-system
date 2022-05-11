import React from 'react';
import styled from '@emotion/styled';
import { capitalCase } from 'change-case';
import { add, endOfISOWeek, format, startOfISOWeek } from 'date-fns';
import { pluck, sortBy, uniq } from 'ramda';

import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import { useTabBar } from 'components/tab-bar';
import useDateRange from 'hooks/use-date-range';
import {
  useDateRangeQueryParams,
  useInventoryQueryParams,
} from 'hooks/use-query-params';
import { InventoryItem } from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import { getDateInterval, getFilteredItems } from './utils';
import { CommonProductTag } from 'components/tag-manager';

export const leftTabStyles = {
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
  justifyContent: 'center',
  marginRight: th.spacing.sm,
  padding: `${th.spacing.sm} 10px ${th.spacing.sm} 12px`,
  width: th.spacing.md,
  style: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
};

export const middleTabStyles = {
  borderRadius: 0,
  justifyContent: 'center',
  marginRight: th.spacing.sm,
  padding: `${th.spacing.sm} 10px ${th.spacing.sm} 10px`,
  width: th.spacing.md,
  style: {
    borderRadius: 0,
  },
};

export const rightTabStyles = {
  justifyContent: 'center',
  marginRight: 0,
  padding: `${th.spacing.sm} 12px ${th.spacing.sm} 10px`,
  width: th.spacing.md,
  style: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
};

export const coastTabs = [
  {
    id: 'WC',
    customStyles: leftTabStyles,
    text: 'W',
  },
  {
    id: 'EC',
    customStyles: rightTabStyles,
    text: 'E',
  },
];

export const ResetButton = styled(l.Flex)({
  alignItems: 'center',
  height: th.sizes.fill,
  justifyContent: 'center',
  opacity: th.opacities.secondary,
  transition: th.transitions.default,
  ':hover': {
    opacity: 1,
  },
});

interface Props {
  items: InventoryItem[];
  loading: boolean;
}

interface Option {
  text: string;
  value: string | number;
}

const useInventoryFilters = ({ items, loading }: Props) => {
  const [selectedFilters, setQuery] = useInventoryQueryParams();

  const { TabBar: CoastFilter } = useTabBar(coastTabs, false, 'EC', 'coast', 1);

  const getFilter = (
    key: 'location' | 'shipper' | 'countryOfOrigin' | 'daysInStorage',
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
          setQuery({ ...selectedFilters, [key]: e.target.value || undefined });
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

  const otherOption = {
    text: 'Other',
    value: 'other',
  };

  const getOptions = (options: Option[]) => [
    { text: loading ? '...' : 'All', value: '' },
    ...sortBy(
      (opt) => (opt.text === 'Other' ? 'zzzzzzz' : opt.text.toLowerCase()),
      options,
    ),
  ];

  const itemsFilteredByCoast = (items as InventoryItem[]).filter(
    (item) =>
      selectedFilters.coast === item.coast &&
      !['98', '99'].includes(`${item.product?.species?.id}`),
  );

  const locationOptions = uniq(
    itemsFilteredByCoast.map((item) =>
      item.warehouse
        ? {
            text: `${item.warehouse.warehouseName} (${item.warehouse.id})`,
            value: item.warehouse.id,
          }
        : otherOption,
    ),
  );

  const countryOptions = uniq(
    itemsFilteredByCoast.map((item) =>
      item.country
        ? {
            text: `${item.country.countryName} (${item.country.id})`,
            value: item.country.id,
          }
        : otherOption,
    ),
  );

  const shipperOptions = uniq(
    itemsFilteredByCoast
      .filter(
        (item) =>
          !selectedFilters.countryOfOrigin ||
          item.country?.id === selectedFilters.countryOfOrigin,
      )
      .map((item) =>
        item.shipper
          ? {
              text: `${item.shipper.shipperName} (${item.shipper.id})`,
              value: item.shipper.id,
            }
          : otherOption,
      ),
  );

  const { DateRangePicker, handleDateChange, ForwardButton, BackwardButton } =
    useDateRange({
      hideDefinedRanges: true,
      singleSelection: true,
      maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
    });

  const [{ startDate = formatDate(startOfISOWeek(new Date())) }] =
    useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );
  const currentStartOfWeek = startOfISOWeek(
    new Date(startDate.replace(/-/g, '/')),
  );

  const handleWeekChange = (weeks: number) => {
    const newDate = startOfISOWeek(
      add(new Date(startDate.replace(/-/g, '/')), {
        weeks,
      }),
    );
    handleDateChange({
      selection: {
        startDate: newDate,
        endDate: newDate,
        key: 'selection',
      },
    });
  };

  const {
    species,
    variety,
    size,
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

  const filteredItems = (itemsFilteredByCoast as InventoryItem[]).filter(
    (item) => {
      const {
        species: itemSpecies,
        variety: itemVariety,
        sizes: itemSizes,
        packType: itemPackType,
      } = item.product || {};

      const commonSpeciesTags =
        (item.product?.species?.commonSpecieses?.nodes.find(
          (cs) => cs && cs.productSpeciesId === item.product?.species?.id,
        )?.commonSpeciesTags?.nodes || []) as CommonProductTag[];
      const commonVarietyTags =
        (item.product?.variety?.commonVarieties?.nodes.find(
          (cv) => cv && cv.productVarietyId === item.product?.variety?.id,
        )?.commonVarietyTags?.nodes || []) as CommonProductTag[];
      const commonSizeTags =
        (item.product?.sizes?.nodes[0]?.commonSizes?.nodes.find(
          (cs) => cs && cs.productSizeId === item.product?.sizes?.nodes[0]?.id,
        )?.commonSizeTags?.nodes || []) as CommonProductTag[];
      const commonPackTypeTags =
        (item.product?.packType?.commonPackTypes?.nodes.find(
          (cpt) => cpt && cpt.packMasterId === item.product?.packType?.id,
        )?.commonPackTypeTags?.nodes || []) as CommonProductTag[];

      return (
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
            : ['total', itemSizes?.nodes[0]?.id].includes(size)
          : !sizeTag || pluck('tagText', commonSizeTags).includes(sizeTag)) &&
        (packType
          ? packTypeTag
            ? commonPackTypeTags.includes(packTypeTag)
            : ['total', itemPackType?.packDescription].includes(packType)
          : !packTypeTag || commonPackTypeTags.includes(packTypeTag)) &&
        (!sizePackType ||
          [
            'total',
            `${itemSizes?.nodes[0]?.id}-${itemPackType?.packDescription}`,
          ].includes(sizePackType)) &&
        (!plu || ['total', item.plu ? 'true' : 'false'].includes(plu))
      );
    },
  );

  const detailsFilteredItems =
    detailsIndex &&
    getFilteredItems(
      filteredItems,
      parseInt(detailsIndex, 10),
      currentStartOfWeek,
    );

  const detailsDateRange = `${format(
    getDateInterval(detailsIndex, currentStartOfWeek).start,
    'M/dd',
  )} - ${format(
    add(getDateInterval(detailsIndex, currentStartOfWeek).end, {
      days: -1,
    }),
    'M/dd',
  )}`;
  const detailsDateText =
    detailsIndex === '13'
      ? `Storage - older than ${format(currentStartOfWeek, 'M/dd')}`
      : detailsIndex === '14'
      ? 'All Dates'
      : detailsDateRange;

  const filteredLocationOptions = getOptions(
    detailsFilteredItems
      ? locationOptions.filter((opt) =>
          (detailsFilteredItems as InventoryItem[])
            .map((item) => item.warehouse?.id)
            .includes(`${opt.value}`),
        )
      : locationOptions,
  );
  const locationSelect = getFilter('location', filteredLocationOptions);

  const filteredCountryOptions = getOptions(
    detailsFilteredItems
      ? countryOptions.filter((opt) =>
          (detailsFilteredItems as InventoryItem[])
            .map((item) => item.country?.id)
            .includes(`${opt.value}`),
        )
      : countryOptions,
  );
  const countrySelect = getFilter(
    'countryOfOrigin',
    filteredCountryOptions,
    150,
  );

  const filteredShipperOptions = getOptions(
    detailsFilteredItems
      ? shipperOptions.filter((opt) =>
          (detailsFilteredItems as InventoryItem[])
            .map((item) => item.shipper?.id)
            .includes(`${opt.value}`),
        )
      : shipperOptions,
  );
  const shipperSelect = getFilter('shipper', filteredShipperOptions);

  return {
    components: (
      <l.Flex alignCenter>
        <l.Div mr={th.spacing.md}>
          <ty.SmallText mb={th.spacing.xs} secondary>
            Coast
          </ty.SmallText>
          <CoastFilter />
        </l.Div>
        {locationSelect}
        {countrySelect}
        {shipperSelect}
        <l.Div mr={th.spacing.md}>
          <ty.SmallText mb={th.spacing.xs} secondary>
            Discharge Date
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
          <l.Div height={18} />
          <ResetButton>
            <l.AreaLink
              cursor="pointer"
              height={th.sizes.icon}
              width={th.sizes.icon}
              to="/sales/inventory?coast=EC"
            >
              <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
            </l.AreaLink>
          </ResetButton>
        </div>
      </l.Flex>
    ),
    detailsFilteredItems,
    filteredItems,
    handleDateChange,
    handleWeekChange,
    selectedWeekNumber,
    startDate,
  };
};

export default useInventoryFilters;
