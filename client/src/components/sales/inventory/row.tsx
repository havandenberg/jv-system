import React from 'react';
import styled from '@emotion/styled';
import { isBefore, startOfISOWeek } from 'date-fns';
import { mapObjIndexed, times, values } from 'ramda';

import { formatDate } from 'components/date-range-picker';
import {
  useDateRangeQueryParams,
  useInventoryQueryParams,
} from 'hooks/use-query-params';
import { InventoryItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { gridTemplateColumns } from '.';
import { categoryTypeOrder } from './header';
import { getFilteredItems, reducePalletData } from './utils';

const ItemWrapper = styled(l.Flex)(
  ({ hasItems, isTotal }: { hasItems: boolean; isTotal: boolean }) => ({
    alignItems: 'center',
    borderTop: isTotal ? th.borders.primary : th.borders.disabled,
    cursor: hasItems ? 'pointer' : 'default',
    flexDirection: 'column',
    height: th.sizes.fill,
    justifyItems: 'center',
    transition: th.transitions.default,
    ':hover': {
      background: hasItems
        ? th.colors.brand.containerBackgroundAccent
        : undefined,
    },
  }),
);

const InventoryCell = ({
  index,
  isTotal,
  palletsAvailable,
  palletsOnHand,
  to,
}: {
  index: number;
  isTotal: boolean;
  palletsAvailable: number;
  palletsOnHand: number;
  to: string;
}) => (
  <l.AreaLink key={index} to={to}>
    <ItemWrapper
      borderLeft={index <= 1 ? th.borders.disabled : 0}
      borderRight={index <= 14 && index > 0 ? th.borders.disabled : 0}
      hasItems={!!(palletsAvailable + palletsOnHand)}
      isTotal={isTotal}
    >
      <ty.SmallText
        bold
        center
        color={th.colors.status.successAlt}
        py={th.spacing.xs}
      >
        {palletsAvailable || '-'}
      </ty.SmallText>
      <ty.SmallText
        bold
        center
        color={th.colors.brand.primaryAccent}
        pb={th.spacing.xs}
      >
        {palletsOnHand || '-'}
      </ty.SmallText>
    </ItemWrapper>
  </l.AreaLink>
);

const CategoryWrapper = styled(l.Flex)(
  ({ isTotal, showHover }: { isTotal: boolean; showHover: boolean }) => ({
    alignItems: 'center',
    borderLeft: th.borders.disabled,
    borderTop: isTotal ? th.borders.primary : th.borders.disabled,
    height: th.sizes.fill,
    paddingLeft: th.spacing.md,
    transition: th.transitions.default,
    ':hover': {
      background:
        showHover && !isTotal
          ? th.colors.brand.containerBackgroundAccent
          : undefined,
    },
  }),
);

interface Props {
  categoryId?: string;
  categoryLink?: string;
  categoryText: string;
  index: number;
  items: InventoryItem[];
}

const InventoryRow = ({
  categoryId,
  categoryLink,
  categoryText,
  index,
  items,
}: Props) => {
  const [
    { species, variety, size, packType, plu, shipper, categoryTypes, ...rest },
  ] = useInventoryQueryParams();
  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();
  const currentStartOfWeek = startOfISOWeek(
    new Date(startDate.replace(/-/g, '/')),
  );

  const categoryTypesArray = categoryTypes ? categoryTypes.split(',') : [];
  const categoryType = categoryTypes
    ? categoryTypesArray[categoryTypesArray.length - 1]
    : '';

  const getItemsLink = (
    detailsIndex: number,
    hasPallets: boolean,
    newValue?: string,
  ) => {
    if (!categoryId) {
      return '#';
    }

    const restParams = values(
      mapObjIndexed((value, key) => (value ? `${key}=${value}` : ''), rest),
    )
      .filter((value) => value)
      .join('&');
    const restQueryString = restParams
      ? `${restParams}${hasPallets ? '&' : ''}`
      : '';

    const detailsQueryString = hasPallets
      ? `detailsIndex=${detailsIndex}&`
      : '';

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
          case 'shipper':
            return !!shipper;
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
          case 'shipper':
            return `shipper=${shipper}`;
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
          case 'shipper':
            return !shipper;
          default:
            return !species;
        }
      });

    return `/sales/inventory?${restQueryString}${detailsQueryString}${existingCategoriesParamString}${categoryType}=${newValue}&categoryTypes=${categoryTypes},${nextCategoryType}`;
  };

  const storageItems = items.filter(
    (item) =>
      item.vessel &&
      isBefore(
        new Date(item.vessel.dischargeDate.replace(/-/g, '/')),
        currentStartOfWeek,
      ),
  );

  const storageItemsAvailable = reducePalletData(
    storageItems,
    'palletsAvailable',
  );
  const storageItemsOnHand = reducePalletData(storageItems, 'palletsOnHand');
  const totalItemsAvailable = reducePalletData(items, 'palletsAvailable');
  const totalItemsOnHand = reducePalletData(items, 'palletsOnHand');

  const isTotal = categoryText === 'Total';

  const categoryCell = (
    <CategoryWrapper isTotal={isTotal} showHover={!!categoryLink}>
      <ty.CaptionText
        bold
        color={isTotal ? th.colors.text.default : th.colors.brand.primaryAccent}
      >
        {categoryText}
      </ty.CaptionText>
    </CategoryWrapper>
  );

  return (
    <l.Grid
      alignCenter
      background={
        isTotal
          ? th.colors.brand.containerBackground
          : index % 2 === 0
          ? th.colors.brand.containerBackground
          : undefined
      }
      gridTemplateColumns={gridTemplateColumns}
    >
      {categoryLink ? (
        <l.AreaLink height={th.sizes.fill} to={categoryLink}>
          {categoryCell}
        </l.AreaLink>
      ) : (
        categoryCell
      )}
      <l.Div height={th.sizes.fill} width={th.sizes.fill}>
        <InventoryCell
          index={0}
          isTotal={isTotal}
          palletsAvailable={storageItemsAvailable}
          palletsOnHand={storageItemsOnHand}
          to={getItemsLink(
            13,
            !!(storageItemsAvailable + storageItemsOnHand),
            categoryId,
          )}
        />
      </l.Div>
      {times((idx) => {
        const filteredItems = getFilteredItems(items, idx, currentStartOfWeek);
        const palletsAvailable = reducePalletData(
          filteredItems,
          'palletsAvailable',
        );
        const palletsOnHand = reducePalletData(filteredItems, 'palletsOnHand');
        const hasPallets = !!(palletsAvailable + palletsOnHand);
        return (
          <InventoryCell
            index={idx + 1}
            isTotal={isTotal}
            key={idx}
            palletsAvailable={palletsAvailable}
            palletsOnHand={palletsOnHand}
            to={getItemsLink(idx, hasPallets, categoryId)}
          />
        );
      }, 12)}
      <l.Div height={th.sizes.fill} width={th.sizes.fill}>
        <InventoryCell
          index={14}
          isTotal={isTotal}
          palletsAvailable={totalItemsAvailable}
          palletsOnHand={totalItemsOnHand}
          to={getItemsLink(
            14,
            !!(totalItemsAvailable + totalItemsOnHand),
            categoryId,
          )}
        />
      </l.Div>
    </l.Grid>
  );
};

export default InventoryRow;