import React from 'react';
import styled from '@emotion/styled';
import { isBefore, startOfISOWeek } from 'date-fns';
import { mapObjIndexed, times, values } from 'ramda';
import { useHistory } from 'react-router-dom';

import TagImg from 'assets/images/tag';
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
import {
  getFilteredItems,
  InventoryItemPalletData,
  reducePalletData,
} from './utils';

const ItemWrapper = styled(l.Flex)(
  ({
    hasItems,
    isTotal,
    isOnHand,
  }: {
    hasItems: boolean;
    isOnHand: boolean;
    isTotal: boolean;
  }) => ({
    alignItems: 'center',
    borderTop: isOnHand
      ? 'none'
      : isTotal
      ? th.borders.primary
      : th.borders.disabled,
    cursor: hasItems ? 'pointer' : undefined,
    flexDirection: 'column',
    height: 18,
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
  availableTo = '#',
  onHandTo = '#',
}: {
  index: number;
  isTotal: boolean;
  palletsAvailable: InventoryItemPalletData;
  palletsOnHand: InventoryItemPalletData;
  availableTo: string;
  onHandTo: string;
}) => {
  const showPreInventory = index < 14;
  const palletsAvailableCount =
    palletsAvailable.real + (showPreInventory ? 0 : palletsAvailable.pre);

  const wrapperProps = {
    borderLeft: index <= 1 ? th.borders.disabled : 0,
    borderRight: index <= 14 && index > 0 ? th.borders.disabled : 0,
    isTotal: isTotal,
    paddingTop: th.spacing.xs,
  };

  const availableCell = (
    <ItemWrapper
      hasItems={availableTo !== '#'}
      isOnHand={false}
      {...wrapperProps}
    >
      <ty.SmallText bold center color={th.colors.status.successAlt}>
        {palletsAvailableCount || '-'}
        {showPreInventory && !!palletsAvailable.pre && (
          <>
            <ty.Span
              color={th.colors.status.warningSecondary}
              ml={th.spacing.sm}
            >
              {palletsAvailable.pre}
            </ty.Span>
          </>
        )}
      </ty.SmallText>
    </ItemWrapper>
  );

  const onHandCell = (
    <ItemWrapper hasItems={onHandTo !== '#'} isOnHand={true} {...wrapperProps}>
      <ty.SmallText bold center color={th.colors.brand.primaryAccent}>
        {palletsOnHand.real || '-'}
      </ty.SmallText>
    </ItemWrapper>
  );

  return (
    <l.Div key={index}>
      {availableTo === '#' ? (
        availableCell
      ) : (
        <l.AreaLink to={availableTo}>{availableCell}</l.AreaLink>
      )}
      {onHandTo === '#' ? (
        onHandCell
      ) : (
        <l.AreaLink to={onHandTo}>{onHandCell}</l.AreaLink>
      )}
    </l.Div>
  );
};

const CategoryWrapper = styled(l.Flex)(
  ({
    isSelectedTag,
    isTotal,
    showHover,
  }: {
    isSelectedTag: boolean;
    isTotal: boolean;
    showHover: boolean;
  }) => ({
    alignItems: 'center',
    background: isSelectedTag
      ? th.colors.brand.containerBackgroundAccent
      : undefined,
    borderLeft: th.borders.disabled,
    borderTop: isTotal ? th.borders.primary : th.borders.disabled,
    height: th.sizes.fill,
    paddingLeft: th.spacing.md,
    position: 'relative',
    transition: th.transitions.default,
    ':hover': {
      background:
        isSelectedTag || (showHover && !isTotal)
          ? th.colors.brand.containerBackgroundAccent
          : undefined,
    },
  }),
);

interface Props {
  categoryId?: string;
  categoryLink?: string;
  categoryText: string;
  defaultInvSortKey?: string;
  tagLink?: string;
  tagText?: string;
  index: number;
  items: InventoryItem[];
}

const InventoryRow = ({
  categoryId,
  categoryLink,
  categoryText,
  defaultInvSortKey,
  index,
  items = [],
  tagLink,
  tagText,
}: Props) => {
  const history = useHistory();
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
      sizePackType,
      categoryTypes,
      ...rest
    },
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
    hasRealPallets: boolean,
    hasPrePallets: boolean,
    newValue?: string,
  ) => {
    if (!categoryId || (!hasRealPallets && !hasPrePallets)) {
      return '#';
    }

    const restParams = values(
      mapObjIndexed((value, key) => (value ? `${key}=${value}` : ''), rest),
    )
      .filter((value) => value)
      .join('&');
    const restQueryString = restParams
      ? `${restParams}${hasRealPallets || hasPrePallets ? '&' : ''}`
      : '';

    const detailsQueryString = `detailsIndex=${detailsIndex}&`;

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
          case 'sizePackType':
            return !!sizePackType;
          default:
            return !!species;
        }
      })
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
    const existingCategoriesParamString = existingCategoriesParam
      ? `${existingCategoriesParam}&`
      : '';

    const nextCategoryType =
      defaultInvSortKey ||
      categoryTypeOrder
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
            case 'sizePackType':
              return !sizePackType;
            default:
              return !species;
          }
        });

    const getNextTagString = () => {
      switch (categoryType) {
        case 'variety':
          return tagText ? `&varietyTag=${tagText}` : '';
        case 'size':
          return tagText ? `&sizeTag=${tagText}` : '';
        case 'packType':
          return tagText ? `&packTypeTag=${tagText}` : '';
        case 'species':
          return tagText ? `&speciesTag=${tagText}` : '';
        default:
          return '';
      }
    };

    return `/sales/inventory?${restQueryString}${detailsQueryString}${existingCategoriesParamString}${categoryType}=${newValue}&categoryTypes=${categoryTypes},${nextCategoryType}${getNextTagString()}`;
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
  const storageItemsReal = storageItemsAvailable.real + storageItemsOnHand.real;
  const storageItemsPre = storageItemsAvailable.pre + storageItemsOnHand.pre;
  const totalItemsAvailable = reducePalletData(items, 'palletsAvailable');
  const totalItemsOnHand = reducePalletData(items, 'palletsOnHand');
  const totalItemsReal = totalItemsAvailable.real + totalItemsOnHand.real;
  const totalItemsPre = totalItemsAvailable.pre + totalItemsOnHand.pre;

  const isTotal = categoryText === 'Total';

  const isSelectedTag = () => {
    switch (categoryType) {
      case 'species':
        return speciesTag === categoryText;
      case 'variety':
        return varietyTag === categoryText;
      case 'size':
        return sizeTag === categoryText;
      case 'packType':
        return packTypeTag === categoryText;
      default:
        return false;
    }
  };

  const categoryCell = (
    <CategoryWrapper
      isSelectedTag={isSelectedTag()}
      isTotal={isTotal}
      showHover={!!categoryLink}
    >
      {tagLink && (
        <l.HoverButton
          active={isSelectedTag()}
          left={12}
          mr={th.spacing.sm}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            history.push(tagLink);
          }}
          position="absolute"
          top={14}
        >
          <TagImg fill={th.colors.brand.primaryAccent} height={18} width={18} />
        </l.HoverButton>
      )}
      <ty.CaptionText
        bold
        color={isTotal ? th.colors.text.default : th.colors.brand.primaryAccent}
        ml={tagLink ? 22 : 0}
        transition="none"
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
          availableTo="#"
          index={0}
          isTotal={isTotal}
          palletsAvailable={storageItemsAvailable}
          palletsOnHand={storageItemsOnHand}
          onHandTo={getItemsLink(
            13,
            !!storageItemsReal,
            !!storageItemsPre,
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
        const hasRealPallets = !!(palletsAvailable.real + palletsOnHand.real);
        const hasPrePallets = !!(palletsAvailable.pre + palletsOnHand.pre);

        return (
          <InventoryCell
            availableTo="#"
            index={idx + 1}
            isTotal={isTotal}
            key={idx}
            palletsAvailable={palletsAvailable}
            palletsOnHand={palletsOnHand}
            onHandTo={getItemsLink(
              idx,
              hasRealPallets,
              hasPrePallets,
              categoryId,
            )}
          />
        );
      }, 12)}
      <l.Div height={th.sizes.fill} width={th.sizes.fill}>
        <InventoryCell
          availableTo="#"
          index={14}
          isTotal={isTotal}
          palletsAvailable={totalItemsAvailable}
          palletsOnHand={totalItemsOnHand}
          onHandTo={getItemsLink(
            14,
            !!totalItemsReal,
            !!totalItemsPre,
            categoryId,
          )}
        />
      </l.Div>
    </l.Grid>
  );
};

export default InventoryRow;
