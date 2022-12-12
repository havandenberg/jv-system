import React from 'react';
import styled from '@emotion/styled';
import { capitalCase } from 'change-case';
import { add, endOfISOWeek, format, isBefore } from 'date-fns';
import { pluck, sortBy, times } from 'ramda';

import ResetImg from 'assets/images/reset';
import { formatDate } from 'components/date-range-picker';
import useCoastTabBar from 'components/tab-bar/coast-tab-bar';
import { CommonProductTag } from 'components/tag-manager';
import useDateRange from 'hooks/use-date-range';
import {
  useDateRangeQueryParams,
  useInventoryQueryParams,
} from 'hooks/use-query-params';
import { CommonSpecies, InventoryItem } from 'types';
import { Select } from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { getWeekNumber } from 'utils/date';

import {
  getDateInterval,
  getInventoryStartDayIndex,
  isWithinDateInterval,
  reduceProductTags,
} from './utils';

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
  categoryType: string;
  commonSpecieses: CommonSpecies[];
  items: InventoryItem[];
  loading: boolean;
}

interface Option {
  text: string;
  value: string | number;
}

const useInventoryFilters = ({
  categoryType,
  commonSpecieses,
  items,
  loading,
}: Props) => {
  const [selectedFilters, setQuery] = useInventoryQueryParams();

  const { TabBar: CoastFilter, selectedTabId: coast } = useCoastTabBar();

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

  const getOptions = (options: Option[]) => [
    { text: loading ? '...' : 'All', value: '' },
    ...sortBy(
      (opt) => (opt.text === 'Other' ? 'zzzzzzz' : opt.text.toLowerCase()),
      options,
    ),
  ];

  const locationOptions = [] as Option[];
  const countryOptions = [] as Option[];
  const shipperOptions = [] as Option[];

  const { DateRangePicker, handleDateChange, ForwardButton, BackwardButton } =
    useDateRange({
      hideDefinedRanges: true,
      singleSelection: true,
      maxDate: endOfISOWeek(add(new Date(), { weeks: 4 })),
    });

  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  const selectedWeekNumber = getWeekNumber(
    new Date(startDate.replace(/-/g, '/')),
  );
  const currentStartOfWeek = new Date(startDate.replace(/-/g, '/'));
  const handleWeekChange = (weeks: number) => {
    const newDate = add(new Date(startDate.replace(/-/g, '/')), {
      weeks,
    });
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
    program,
    detailsIndex,
    secondaryDetailsIndex,
  } = selectedFilters;

  const inventoryStartDateIndex = getInventoryStartDayIndex(startDate);
  const isStorage = parseInt(detailsIndex) === 13 - inventoryStartDateIndex;
  const isTotal = parseInt(detailsIndex) === 14 - inventoryStartDateIndex;
  const isWeekTotal = parseInt(detailsIndex) === 15 - inventoryStartDateIndex;

  const [vesselId, shipperId] = secondaryDetailsIndex?.split('-') || [];

  const groupedItems = items.reduce<{
    categories: { [key: string]: { [key: string]: InventoryItem[] } };
    tags: { [key: string]: { [key: string]: InventoryItem[] } };
  }>(
    (acc, item) => {
      const otherCategory = {
        id: 'other',
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
        customerSpecial: { customerName: 'No Program' },
      };
      const itemSpecies = item.product?.species || otherCategory;
      const itemVariety = item.product?.variety || otherCategory;
      const itemSize = item.product?.sizes?.nodes[0] || otherCategory;
      const itemPackType = item.product?.packType || otherCategory;
      const itemShipper = item.shipper || otherCategory;
      const itemCountryOfOrigin = item.country || otherCategory;

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
            (!secondaryDetailsIndex ||
              (item.vessel?.id === vesselId &&
                [item.shipper?.id, item.shipperId].includes(shipperId))) &&
            isBefore(
              new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
              currentStartOfWeek,
            )
          : isTotal
          ? !secondaryDetailsIndex ||
            (item.vessel?.id === vesselId &&
              [item.shipper?.id, item.shipperId].includes(shipperId))
          : isWeekTotal
          ? item.vessel &&
            (!secondaryDetailsIndex ||
              (item.vessel?.id === vesselId &&
                [item.shipper?.id, item.shipperId].includes(shipperId))) &&
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
          value: item.shipper.id,
        });
      }

      const dateRangeIndex = `${times(
        (idx) => isWithinDateInterval(item, idx, currentStartOfWeek),
        14 - getInventoryStartDayIndex(formatDate(currentStartOfWeek)),
      ).indexOf(true)}`;

      const getGroupInfo = () => {
        switch (categoryType) {
          case 'variety':
            return {
              categoryKey: itemVariety.id,
              tags: commonVarietyTags,
            };
          case 'size':
            return {
              categoryKey: `${itemSize.combineDescription}`,
              tags: commonSizeTags,
            };
          case 'label':
            return {
              categoryKey: `${itemPackType.label?.labelCode}`,
            };
          case 'packType':
            return {
              categoryKey: `${itemPackType.packDescription}`,
              tags: commonPackTypeTags,
            };
          case 'plu':
            return {
              categoryKey: `${!!item.plu}`,
            };
          case 'shipper':
            return {
              categoryKey: itemShipper.id,
            };
          case 'countryOfOrigin':
            return {
              categoryKey: itemCountryOfOrigin.id,
            };
          case 'program':
            return {
              categoryKey: `${
                itemPackType.customerSpecial?.customerName || 'no program'
              }`,
            };
          case 'sizePackType':
            return {
              categoryKey: `${itemSize.id} - ${itemPackType.packDescription}`,
            };
          default:
            return {
              categoryKey: itemSpecies.id,
              tags: commonSpeciesTags,
            };
        }
      };

      const getGroup = () => {
        const { categoryKey, tags } = getGroupInfo();

        return {
          categories: {
            ...acc.categories,
            [categoryKey]: {
              ...(acc.categories[categoryKey] || {}),
              [dateRangeIndex]: [
                ...(acc.categories[categoryKey]?.[dateRangeIndex] || []),
                item,
              ],
            },
          },
          tags: tags
            ? {
                ...acc.tags,
                ...reduceProductTags(acc.tags, tags, item, dateRangeIndex),
              }
            : acc.tags,
        };
      };

      if (
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
        (!program ||
          ['total', itemPackType?.customerSpecial?.customerName].includes(
            program,
          ) ||
          (program === 'no program' && !itemPackType?.customerSpecial)) &&
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
      ) {
        return getGroup();
      } else {
        return acc;
      }
    },
    { categories: {}, tags: {} } as {
      categories: { [key: string]: { [key: string]: InventoryItem[] } };
      tags: { [key: string]: { [key: string]: InventoryItem[] } };
    },
  );

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

  const locationSelect = getFilter('location', getOptions(locationOptions));

  const countrySelect = getFilter(
    'countryOfOrigin',
    getOptions(countryOptions),
    150,
  );

  const shipperSelect = getFilter('shipper', getOptions(shipperOptions));

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
            Available Date
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
          <l.Div height={20} />
          <ResetButton>
            <l.AreaLink
              cursor="pointer"
              height={th.sizes.icon}
              width={th.sizes.icon}
              to={`/inventory?coast=${coast}`}
            >
              <ResetImg height={th.sizes.icon} width={th.sizes.icon} />
            </l.AreaLink>
          </ResetButton>
        </div>
      </l.Flex>
    ),
    groupedItems,
    handleDateChange,
    handleWeekChange,
    selectedWeekNumber,
    startDate,
  };
};

export default useInventoryFilters;
