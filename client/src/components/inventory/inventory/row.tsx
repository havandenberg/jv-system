import React from 'react';
import styled from '@emotion/styled';
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
  getInventoryStartDayIndex,
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
    title?: string;
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
  startDate,
  showPre,
}: {
  index: number;
  isTotal: boolean;
  palletsAvailable: InventoryItemPalletData;
  palletsOnHand: InventoryItemPalletData;
  availableTo: string;
  onHandTo: string;
  showPre: boolean;
  startDate: string;
}) => {
  const showPreInventory = index < 14 - getInventoryStartDayIndex(startDate);
  const palletsAvailableCount =
    palletsAvailable.real + (showPreInventory ? 0 : palletsAvailable.pre);

  const wrapperProps = {
    borderLeft: index <= 1 ? th.borders.disabled : 0,
    borderRight:
      index <= 14 - getInventoryStartDayIndex(startDate) && index > 0
        ? th.borders.disabled
        : 0,
    isTotal: isTotal,
    paddingTop: th.spacing.xs,
  };

  const availableCell = (
    <ItemWrapper
      hasItems={availableTo !== '#'}
      isOnHand={false}
      title={
        palletsAvailableCount || palletsAvailable.pre
          ? `Real: ${palletsAvailable.real}    Pre: ${palletsAvailable.pre}`
          : undefined
      }
      {...wrapperProps}
    >
      <l.Flex alignItems="center">
        <ty.SmallText
          bold
          center
          color={
            (palletsAvailableCount || 0) < 0
              ? th.colors.status.errorAlt
              : th.colors.status.successAlt
          }
        >
          {palletsAvailableCount +
            (showPreInventory && !showPre && !!palletsAvailable.pre
              ? palletsAvailable.pre
              : 0) || '-'}
        </ty.SmallText>
        {showPreInventory && showPre && !!palletsAvailable.pre && (
          <ty.SmallText
            bold
            center
            color={
              (palletsAvailable.pre || 0) < 0
                ? th.colors.status.warningSecondary
                : th.colors.status.warningAlt
            }
            ml={th.spacing.sm}
          >
            {palletsAvailable.pre}
          </ty.SmallText>
        )}
      </l.Flex>
    </ItemWrapper>
  );

  const onHandCell = (
    <ItemWrapper hasItems={onHandTo !== '#'} isOnHand={true} {...wrapperProps}>
      <ty.SmallText bold center color={th.colors.brand.primaryAccent}>
        {palletsOnHand.total || '-'}
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
  showPre: boolean;
  tagLink?: string;
  tagText?: string;
  index: number;
  itemsByDateRange: { [key: number]: InventoryItem[] };
}

const InventoryRow = ({
  categoryId,
  categoryLink,
  categoryText,
  defaultInvSortKey,
  index,
  itemsByDateRange = {},
  showPre,
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
      label,
      packType,
      packTypeTag,
      plu,
      shipper,
      countryOfOrigin,
      sizePackType,
      categoryTypes,
      ...rest
    },
  ] = useInventoryQueryParams();
  const [{ startDate = formatDate(new Date()) }] = useDateRangeQueryParams();

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
      return { available: '#', onHand: '#' };
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
          case 'label':
            return !!label;
          case 'packType':
            return !!packType;
          case 'plu':
            return !!plu;
          case 'shipper':
            return !!shipper;
          case 'countryOfOrigin':
            return !!countryOfOrigin;
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
          case 'label':
            return `label=${label}`;
          case 'packType':
            const packTypeTagString = packTypeTag
              ? `&packTypeTag=${packTypeTag}`
              : '';
            return `packType=${packType}${packTypeTagString}`;
          case 'plu':
            return `plu=${plu}`;
          case 'shipper':
            return `shipper=${shipper}`;
          case 'countryOfOrigin':
            return `countryOfOrigin=${countryOfOrigin}`;
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
            case 'label':
              return !label;
            case 'packType':
              return !packType;
            case 'plu':
              return !plu;
            case 'shipper':
              return !shipper;
            case 'countryOfOrigin':
              return !countryOfOrigin;
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

    const slug = `?${restQueryString}${detailsQueryString}${existingCategoriesParamString}${categoryType}=${newValue}&categoryTypes=${categoryTypes},${nextCategoryType}${getNextTagString()}`;

    return {
      available: `/inventory/orders${slug}`,
      onHand: `/inventory/index${slug}`,
    };
  };

  const storageItems = itemsByDateRange[-1] || [];
  const storageItemsPalletData = reducePalletData(storageItems);

  const storageItemsAvailable = storageItemsPalletData.palletsAvailable;
  const storageItemsOnHand = storageItemsPalletData.palletsOnHand;
  const storageItemsReal = storageItemsAvailable.real + storageItemsOnHand.real;
  const storageItemsPre = storageItemsAvailable.pre + storageItemsOnHand.pre;

  const totalItemsPalletData = reducePalletData(
    Object.values(itemsByDateRange).flat(),
  );
  const totalItemsAvailable = totalItemsPalletData.palletsAvailable;
  const totalItemsOnHand = totalItemsPalletData.palletsOnHand;
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

  const storageItemsLink = getItemsLink(
    13 - getInventoryStartDayIndex(startDate),
    !!storageItemsReal,
    !!storageItemsPre,
    categoryId,
  );

  const totalItemsLink = getItemsLink(
    14 - getInventoryStartDayIndex(startDate),
    !!totalItemsReal,
    !!totalItemsPre,
    categoryId,
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
      gridTemplateColumns={gridTemplateColumns(startDate)}
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
          availableTo={storageItemsLink.available}
          index={0}
          isTotal={isTotal}
          palletsAvailable={storageItemsAvailable}
          palletsOnHand={storageItemsOnHand}
          onHandTo={storageItemsLink.onHand}
          showPre={showPre}
          startDate={startDate}
        />
      </l.Div>
      {times((idx) => {
        const filteredItems = (itemsByDateRange[idx] || []) as InventoryItem[];
        const palletData = reducePalletData(filteredItems);
        const palletsAvailable = palletData.palletsAvailable;
        const palletsOnHand = palletData.palletsOnHand;
        const hasRealPallets = !!(palletsAvailable.real + palletsOnHand.real);
        const hasPrePallets = !!(palletsAvailable.pre + palletsOnHand.pre);

        const itemsLink = getItemsLink(
          idx,
          hasRealPallets,
          hasPrePallets,
          categoryId,
        );

        return (
          <InventoryCell
            availableTo={itemsLink.available}
            index={idx + 1}
            isTotal={isTotal}
            key={`${idx}`}
            palletsAvailable={palletsAvailable}
            palletsOnHand={palletsOnHand}
            onHandTo={itemsLink.onHand}
            showPre={showPre}
            startDate={startDate}
          />
        );
      }, 12 - getInventoryStartDayIndex(startDate))}
      <l.Div height={th.sizes.fill} width={th.sizes.fill}>
        <InventoryCell
          availableTo={totalItemsLink.available}
          index={14 - getInventoryStartDayIndex(startDate)}
          isTotal={isTotal}
          palletsAvailable={totalItemsAvailable}
          palletsOnHand={totalItemsOnHand}
          onHandTo={totalItemsLink.onHand}
          showPre={showPre}
          startDate={startDate}
        />
      </l.Div>
    </l.Grid>
  );
};

export default InventoryRow;
