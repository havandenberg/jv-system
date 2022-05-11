import React, { Fragment, useCallback, useEffect } from 'react';
import { capitalCase } from 'change-case';
import { add, endOfISOWeek, format, startOfISOWeek } from 'date-fns';
import { mapObjIndexed, times, values } from 'ramda';

import api from 'api';
import Chevron from 'assets/images/chevron';
import Breadcrumbs, { BreadcrumbProps } from 'components/nav/breadcrumbs';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { useInventoryQueryParams, useQueryValue } from 'hooks/use-query-params';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import {
  isCurrentWeek,
  isDateGreaterThanOrEqualTo,
  isDateLessThanOrEqualTo,
} from 'utils/date';

import { gridTemplateColumns } from '.';
import { gridTemplateColumns as listGridTemplateColumns } from './items';
import { indexListLabels } from './items/data-utils';
import InventoryListTotals from './items/list-totals';
import { Select } from 'ui/input';

export const categoryTypeOrder = [
  'species',
  'variety',
  'size',
  'packType',
  'plu',
  'shipper',
  'sizePackType',
];

const gridColumnSpans = [
  { start: 3, end: 10 },
  { start: 10, end: 12 },
  { start: 12, end: 13 },
  { start: 13, end: 14 },
  { start: 14, end: 15 },
];

interface Props {
  detailItems?: InventoryItem[];
  handleWeekChange: (weeks: number) => void;
  loading: boolean;
  selectedWeekNumber: number;
  startDate: string;
}

const Header = ({
  detailItems,
  handleWeekChange,
  loading,
  selectedWeekNumber,
  startDate,
}: Props) => {
  const [
    {
      species,
      speciesTag,
      variety,
      varietyTag,
      size,
      sizeTag,
      packType,
      packTypeTag,
      plu,
      shipper,
      detailsIndex,
      sizePackType,
      categoryTypes,
      ...rest
    },
  ] = useInventoryQueryParams();
  const [, setCategoryTypes] = useQueryValue('categoryTypes');
  const { data: speciesData, loading: speciesLoading } = api.useProductSpecies(
    species || '',
  );
  const { data: varietyData, loading: varietyLoading } = api.useProductVariety(
    variety || '',
  );
  const { data: sizeData, loading: sizeLoading } = api.useProductSize(
    size || '',
  );
  const { data: shipperData, loading: shipperLoading } = api.useShipper(
    shipper || '',
    'FIRST_NAME_ASC',
  );

  const categoryLoading =
    speciesLoading || varietyLoading || sizeLoading || shipperLoading;

  const handleBackward = () => handleWeekChange(-1);
  const handleForward = () => handleWeekChange(1);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey) {
      if (event.code === 'ArrowRight') handleForward();
      else if (event.code === 'ArrowLeft') handleBackward();
    }
  };

  const categoryTypesArray = (
    categoryTypes ? categoryTypes.split(',') : []
  ) as string[];
  const categoryType = categoryTypes
    ? categoryTypesArray[categoryTypesArray.length - 1]
    : '';

  const getBreadcrumbs = () => {
    const restParams = values(
      mapObjIndexed((value, key) => (value ? `${key}=${value}` : ''), rest),
    )
      .filter((value) => value)
      .join('&');
    const restParamString = restParams ? `${restParams}&` : '';

    const breadcrumbText: { [key: string]: string } = {
      species: speciesTag
        ? speciesTag
        : speciesData
        ? `${capitalCase(speciesData.speciesDescription || '')}`
        : 'All Species',
      variety: varietyTag
        ? varietyTag
        : varietyData
        ? `${capitalCase(varietyData.varietyDescription || '')}`
        : 'All Varieties',
      size: sizeTag
        ? sizeTag
        : sizeData
        ? `${capitalCase(sizeData.jvDescription || '')}`
        : 'All Sizes',
      packType: packTypeTag
        ? packTypeTag
        : packType
        ? `${packType}`
        : 'All Pack Types',
      plu: plu ? (plu === 'true' ? 'PLU' : 'No PLU') : 'All PLU',
      shipper: shipperData ? shipperData.shipperName : 'All Shippers',
      sizePackType,
    };

    const breadcrumbs: BreadcrumbProps[] = [
      {
        active: !species,
        text: `All Products`,
        to: `/sales/inventory?${restParams}`,
      },
      ...(categoryTypesArray
        ? categoryTypesArray.slice(0, -1).map((type, idx) => {
            const newCategoryTypesArray = categoryTypesArray.slice(0, idx + 2);
            const existingCategoriesParam = newCategoryTypesArray
              .slice(0, -1)
              .map((type) => {
                switch (type) {
                  case 'variety':
                    const varietyTagString = varietyTag
                      ? `&varietyTag=${varietyTag}`
                      : '';
                    return `variety=${variety}${varietyTagString}`;
                  case 'size':
                    const sizeTagString = sizeTag ? `&sizeTag=${sizeTag}` : '';
                    return `size=${size}${sizeTagString}`;
                  case 'packType':
                    const packTypeTagString = packTypeTag
                      ? `&packTypeTag=${packTypeTag}`
                      : '';
                    return `packType=${packType}${packTypeTagString}`;
                  case 'plu':
                    return `plu=${plu}`;
                  case 'shipper':
                    return `shipper=${shipper}`;
                  case 'sizePackType':
                    return `sizePackType=${sizePackType}`;
                  default:
                    const speciesTagString = speciesTag
                      ? `&speciesTag=${speciesTag}`
                      : '';
                    return `species=${species}${speciesTagString}`;
                }
              })
              .join('&');
            return {
              active: idx === categoryTypesArray.length - 2,
              text: categoryLoading ? '...' : breadcrumbText[type],
              to: `/sales/inventory?${restParamString}${existingCategoriesParam}&categoryTypes=${newCategoryTypesArray.join(
                ',',
              )}`,
            };
          })
        : []),
    ];

    return breadcrumbs;
  };

  const getDates = () =>
    times((weekIdx) => {
      const currentStartOfWeek = startOfISOWeek(
        add(new Date(startDate.replace(/-/g, '/')), {
          weeks: weekIdx,
        }),
      );
      const isCurrentWeekVal = isCurrentWeek(selectedWeekNumber + weekIdx);

      switch (weekIdx) {
        case 0:
          return times((dayIdx) => {
            const currentDate = add(currentStartOfWeek, {
              days: dayIdx,
            });
            const isToday =
              format(currentDate, 'yyyy-MM-dd') ===
              format(new Date(), 'yyyy-MM-dd');
            return (
              <l.Div
                bg={
                  isCurrentWeekVal
                    ? isToday
                      ? th.colors.brand.containerBackgroundAccent
                      : th.colors.brand.containerBackground
                    : undefined
                }
                borderTop={th.borders.disabled}
                borderLeft={dayIdx === 0 ? th.borders.disabled : 0}
                borderRight={dayIdx < 7 ? th.borders.disabled : 0}
                borderBottom={th.borders.disabled}
                key={`${weekIdx}-${dayIdx}`}
                py={th.spacing.xs}
              >
                <ty.SmallText bold={isToday} textAlign="center">
                  {format(currentDate, dayIdx === 0 ? 'M/d' : 'd')}
                </ty.SmallText>
              </l.Div>
            );
          }, 7);
        case 1:
          const rangeOneEnd = add(currentStartOfWeek, { days: 2 });
          const rangeTwoStart = add(currentStartOfWeek, { days: 3 });
          const rangeTwoEnd = endOfISOWeek(currentStartOfWeek);
          const isRangeOne =
            isDateGreaterThanOrEqualTo(new Date(), currentStartOfWeek) &&
            isDateLessThanOrEqualTo(new Date(), rangeOneEnd);
          const isRangeTwo =
            isDateGreaterThanOrEqualTo(new Date(), rangeTwoStart) &&
            isDateLessThanOrEqualTo(new Date(), rangeTwoEnd);
          return (
            <Fragment key={weekIdx}>
              <l.Div
                bg={
                  isCurrentWeekVal
                    ? isRangeOne
                      ? th.colors.brand.containerBackgroundAccent
                      : th.colors.brand.containerBackground
                    : undefined
                }
                borderBottom={th.borders.disabled}
                borderRight={th.borders.disabled}
                borderTop={th.borders.disabled}
                height={`calc(${th.sizes.fill} - 2px)`}
              >
                <l.Flex alignCenter justifyCenter height={th.sizes.fill}>
                  <ty.SmallText bold={isRangeOne} secondary textAlign="center">
                    {format(currentStartOfWeek, 'M/d')} -{' '}
                    {format(rangeOneEnd, 'M/d')}
                  </ty.SmallText>
                </l.Flex>
              </l.Div>
              <l.Div
                bg={
                  isCurrentWeekVal
                    ? isRangeTwo
                      ? th.colors.brand.containerBackgroundAccent
                      : th.colors.brand.containerBackground
                    : undefined
                }
                borderBottom={th.borders.disabled}
                borderTop={th.borders.disabled}
                borderRight={th.borders.disabled}
                height={`calc(${th.sizes.fill} - 2px)`}
              >
                <l.Flex alignCenter justifyCenter height={th.sizes.fill}>
                  <ty.SmallText bold={isRangeTwo} secondary textAlign="center">
                    {format(add(currentStartOfWeek, { days: 3 }), 'M/d')} -{' '}
                    {format(endOfISOWeek(currentStartOfWeek), 'M/d')}
                  </ty.SmallText>
                </l.Flex>
              </l.Div>
            </Fragment>
          );
        default:
          const isToday =
            isDateGreaterThanOrEqualTo(new Date(), currentStartOfWeek) &&
            isDateLessThanOrEqualTo(
              new Date(),
              endOfISOWeek(currentStartOfWeek),
            );
          return (
            <l.Div
              bg={
                isCurrentWeekVal
                  ? th.colors.brand.containerBackground
                  : undefined
              }
              borderRight={th.borders.disabled}
              borderBottom={th.borders.disabled}
              borderTop={th.borders.disabled}
              height={`calc(${th.sizes.fill} - 2px)`}
              key={weekIdx}
            >
              <l.Flex alignCenter justifyCenter height={th.sizes.fill}>
                <ty.SmallText bold={isToday} secondary textAlign="center">
                  {format(currentStartOfWeek, 'M/d')} -{' '}
                  {format(endOfISOWeek(currentStartOfWeek), 'M/d')}
                </ty.SmallText>
              </l.Flex>
            </l.Div>
          );
      }
    }, 5);

  const itemColumnLabels = useColumns<InventoryItem>(
    'vessel',
    SORT_ORDER.ASC,
    indexListLabels({ shipper }),
    'product',
    'inventory_item',
  );

  const getCategoryOptions = () => {
    const options = [];
    if (!species) {
      options.push({ text: 'Species', value: 'species' });
    }
    if (!!species) {
      if (!variety) {
        options.push({ text: 'Varieties', value: 'variety' });
      }
      if (!size) {
        options.push({ text: 'Sizes', value: 'size' });
      }
      if (!packType) {
        options.push({ text: 'Pack Types', value: 'packType' });
      }
      if (!plu) {
        options.push({ text: 'PLU', value: 'plu' });
      }
      if (!shipper) {
        options.push({ text: 'Shipper', value: 'shipper' });
      }
      if (!sizePackType) {
        options.push({ text: 'Size & Pack Type', value: 'sizePackType' });
      }
    }
    return options;
  };

  const handleCategoryTypesChange = useCallback(
    (newCategoryTypes: string) => {
      setCategoryTypes(newCategoryTypes, 'replaceIn');
    },
    [setCategoryTypes],
  );

  useEffect(() => {
    if (!categoryTypes) {
      handleCategoryTypesChange('species');
    }
  }, [categoryTypes, handleCategoryTypesChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <>
      <l.Flex
        alignCenter
        height={12}
        justifyBetween
        mb={th.spacing.lg}
        mt={th.spacing.lg}
      >
        <l.Flex alignCenter>
          <Breadcrumbs
            breadcrumbs={getBreadcrumbs()}
            customStyles={{ text: { fontSize: th.fontSizes.body } }}
          />
          {!detailItems && (
            <>
              <Chevron height={10} />
              <Select
                ml={th.spacing.md}
                onChange={(e) => {
                  setCategoryTypes(
                    `${
                      categoryTypes
                        ? categoryTypes
                            .split(',')
                            .slice(0, categoryTypes.split(',').length - 1)
                            .join(',') + ','
                        : ''
                    }${e.target.value}`,
                  );
                }}
                value={categoryType || ''}
                width={150}
              >
                {getCategoryOptions().map(({ text, value }) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </Select>
            </>
          )}
        </l.Flex>
        {detailItems ? (
          <InventoryListTotals items={detailItems} loading={loading} />
        ) : (
          <l.Flex column alignEnd>
            <ty.SmallText
              bold
              color={th.colors.status.successAlt}
              mb={th.spacing.xs}
            >
              Pallets Available
            </ty.SmallText>
            <ty.SmallText bold color={th.colors.brand.primaryAccent}>
              Pallets On Hand
            </ty.SmallText>
          </l.Flex>
        )}
      </l.Flex>
      {detailItems ? (
        <l.Grid
          gridTemplateColumns={listGridTemplateColumns(!!shipper)}
          mb={th.spacing.sm}
          pl={th.spacing.sm}
          pr={detailItems.length > 12 ? th.spacing.md : 0}
        >
          {itemColumnLabels}
        </l.Grid>
      ) : (
        <l.Grid
          alignCenter
          gridTemplateColumns={gridTemplateColumns}
          mt={th.sizes.icon}
        >
          <l.Flex
            borderLeft={th.borders.disabled}
            borderTop={th.borders.disabled}
            height={th.sizes.fill}
            justifyCenter
            width={th.sizes.fill}
          >
            <ty.BodyText bold transform={`translateY(${th.spacing.md})`}>
              {`${rest.coast === 'EC' ? 'East' : 'West'} Coast`}
            </ty.BodyText>
          </l.Flex>
          <l.Div
            bg={th.colors.brand.containerBackground}
            borderLeft={th.borders.disabled}
            borderBottom={th.borders.disabled}
            borderTop={th.borders.disabled}
            gridColumn={2}
            gridRow="1 / 3"
            height={`calc(${th.sizes.fill} - 2px)`}
          >
            <l.Flex alignCenter justifyCenter height={th.sizes.fill}>
              <ty.SmallText center>Storage</ty.SmallText>
            </l.Flex>
          </l.Div>
          {times((weekIdx) => {
            const isFirst = weekIdx === 0;
            const isCurrentWeekVal = isCurrentWeek(
              selectedWeekNumber + weekIdx,
            );
            return (
              <l.Flex
                alignCenter
                bg={
                  isCurrentWeekVal
                    ? th.colors.brand.containerBackground
                    : undefined
                }
                borderLeft={isFirst ? th.borders.disabled : undefined}
                borderRight={th.borders.disabled}
                borderTop={th.borders.disabled}
                column
                gridColumnStart={gridColumnSpans[weekIdx].start}
                gridColumnEnd={gridColumnSpans[weekIdx].end}
                justifyCenter
                key={weekIdx + 1}
                py={th.spacing.xs}
              >
                <ty.BodyText nowrap>
                  {isFirst ? 'Week ' : ''}
                  {selectedWeekNumber + weekIdx}
                </ty.BodyText>
              </l.Flex>
            );
          }, 5)}
          <l.Div
            bg={th.colors.brand.containerBackgroundAccent}
            borderRight={th.borders.disabled}
            borderBottom={th.borders.disabled}
            borderTop={th.borders.disabled}
            gridColumn={15}
            gridRow="1 / 3"
            height={`calc(${th.sizes.fill} - 2px)`}
          >
            <l.Flex alignCenter justifyCenter height={th.sizes.fill}>
              <ty.SmallText bold center>
                Grand Total
              </ty.SmallText>
            </l.Flex>
          </l.Div>
          <l.Div
            borderBottom={th.borders.disabled}
            borderLeft={th.borders.disabled}
            height={`calc(${th.sizes.fill} - 1px)`}
            width={th.sizes.fill}
          />
          {getDates()}
        </l.Grid>
      )}
    </>
  );
};

export default Header;
