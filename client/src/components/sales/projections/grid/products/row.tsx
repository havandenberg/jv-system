import React, { ChangeEvent } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { equals, sortBy, uniqBy } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell, {
  EDITABLE_CELL_HEIGHT,
  Input,
} from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import { BasicModal } from 'components/modal';
import { ShipperProjectionProduct, ShipperProjectionVessel } from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  ShipperProjectionProductWithEntries,
  ShipperProjectionGridProps,
} from '../types';

const ProductWrapper = styled(l.Grid)(
  {
    alignItems: 'center',
    height: EDITABLE_CELL_HEIGHT,
  },
  divPropsSet,
);

export const NewProductRow = ({
  newItemHandlers: { handleNewProduct },
  hasProducts,
}: ShipperProjectionGridProps & { hasProducts: boolean }) => {
  const newProduct = {
    id: -1,
    species: '',
    variety: '',
    size: '',
    packType: '',
    plu: '',
  };

  return (
    <ProductWrapper mt={hasProducts ? th.spacing.xs : th.spacing.md}>
      <l.Flex
        border={th.borders.transparent}
        alignCenter
        marginLeft={52}
        relative
      >
        <l.HoverButton
          onClick={() => {
            handleNewProduct(newProduct);
          }}
          position="absolute"
          left={-23}
        >
          <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
      </l.Flex>
    </ProductWrapper>
  );
};

export const ProductTotalRow = ({
  gridTemplateColumns,
  productTotals,
  species,
}: {
  gridTemplateColumns: string;
  productTotals: number[];
  species: string;
}) => (
  <ProductWrapper
    gridColumnGap={th.spacing.md}
    gridTemplateColumns={gridTemplateColumns}
    mt={species === 'Grand' ? `-${th.spacing.sm}` : th.spacing.xs}
    py={th.spacing.md}
    relative
  >
    <l.Flex alignCenter justifyEnd ml={52}>
      <ty.CaptionText bold textAlign="right">
        {species === 'Grand' ? 'Grand ' : ''}Total Pallets:
      </ty.CaptionText>
    </l.Flex>
    {productTotals.map((total, idx) => (
      <l.Flex alignCenter justifyCenter key={idx}>
        <ty.CaptionText bold center mr={th.spacing.md}>
          {total < 0 ? '' : total}
        </ty.CaptionText>
      </l.Flex>
    ))}
  </ProductWrapper>
);

const Cell = styled(l.Flex)(({ isEvenRow }: { isEvenRow: boolean }) => ({
  alignItems: 'center',
  background: isEvenRow
    ? th.colors.background
    : th.colors.brand.containerBackground,
  height: 22,
  padding: `0 ${th.spacing.sm}`,
  width: `calc(${th.sizes.fill} - ${th.spacing.sm}`,
}));

const ProductRow = (
  props: {
    allProducts: ShipperProjectionProduct[];
    allProductsError?: ApolloError;
    allProductsLoading: boolean;
    duplicateProductIds: number[];
    gridTemplateColumns: string;
    index: number;
    isEvenRow: boolean;
    product: ShipperProjectionProductWithEntries;
    showSpecies: boolean;
    showVariety: boolean;
    selectedShipper?: string;
    showErrors: boolean;
    vessels: ShipperProjectionVessel[];
  } & ShipperProjectionGridProps,
) => {
  const {
    changeHandlers: { handleEntryChange, handleProductChange },
    newItemHandlers: { handleNewProduct },
    removeItemHandlers: { handleRemoveProduct },
    valueGetters: { getEntryValue, getProductValue },
    allProducts,
    allProductsError,
    allProductsLoading,
    duplicateProductIds,
    gridTemplateColumns,
    isEvenRow,
    product,
    selectedShipper,
    showSpecies,
    showVariety,
    showErrors,
    vessels,
  } = props;
  const { entries, id } = product;

  const isDuplicate = duplicateProductIds.includes(parseInt(id, 10));

  const updatedProduct = {
    id: product.id,
    shipperId: product.shipperId,
    species: getProductValue(product, 'species').value,
    variety: getProductValue(product, 'variety').value,
    size: getProductValue(product, 'size').value,
    packType: getProductValue(product, 'packType').value,
    plu: getProductValue(product, 'plu').value,
  };
  const { species, variety, size, packType, plu } = updatedProduct;

  const handleChange = (key: keyof ShipperProjectionProduct, value: string) => {
    handleProductChange({
      ...updatedProduct,
      [key]: value,
    });
  };

  const getValueSelectorProps = (type: keyof ShipperProjectionProduct) => {
    const getValue = () => {
      switch (type) {
        case 'species':
          return species;
        case 'variety':
          return variety;
        case 'size':
          return size;
        case 'packType':
          return packType;
        default:
          return '';
      }
    };
    const value = getValue();

    const allItems = sortBy(
      (p) => p[type],
      uniqBy(
        (p) => p[type],
        allProducts.filter((p) => {
          const speciesIsValid = !species || p.species === species;
          const varietyIsValid = !variety || p.variety === variety;
          const sizeIsValid = !size || p.size === size;
          switch (type) {
            case 'variety':
              return speciesIsValid;
            case 'size':
              return speciesIsValid && varietyIsValid;
            case 'packType':
              return speciesIsValid && varietyIsValid && sizeIsValid;
            default:
              return true;
          }
        }),
      ) as ShipperProjectionProduct[],
    );

    return {
      allItems,
      closeOnSelect: true,
      editableCellProps: {
        content: { dirty: false, value },
        defaultChildren: null,
        editing: true,
        error: showErrors && (!value || isDuplicate),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(type, e.target.value);
        },
        warning: !equals(product[type], value),
      },
      error: allProductsError,
      excludedItems: [],
      getItemContent: (item: ShipperProjectionProduct) => (
        <ty.CaptionText pl={th.spacing.sm}>{item[type]}</ty.CaptionText>
      ),
      height: 150,
      loading: allProductsLoading,
      nameKey: type,
      selectItem: (p: ShipperProjectionProduct) => {
        handleChange(type, p[type] || '');
      },
      width: 250,
    };
  };

  const { ItemSelector: SpeciesItemSelector } = useItemSelector({
    errorLabel: 'species',
    ...getValueSelectorProps('species'),
  });

  const { ItemSelector: VarietyItemSelector } = useItemSelector({
    errorLabel: 'varieties',
    ...getValueSelectorProps('variety'),
  });

  const { ItemSelector: SizeItemSelector } = useItemSelector({
    errorLabel: 'sizes',
    ...getValueSelectorProps('size'),
  });

  const { ItemSelector: PackTypeItemSelector } = useItemSelector({
    errorLabel: 'pack types',
    ...getValueSelectorProps('packType'),
  });

  return (
    <ProductWrapper
      gridColumnGap={th.spacing.md}
      gridTemplateColumns={gridTemplateColumns}
    >
      <l.Grid
        alignCenter
        key={product.id}
        gridColumnGap={th.spacing.xs}
        gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
        ml={52}
        relative
      >
        {selectedShipper && (
          <>
            <BasicModal
              title="Confirm Remove Product"
              content={
                <ty.BodyText mb={th.spacing.md}>
                  Are you sure you want to remove this product? This action
                  cannot be undone.
                </ty.BodyText>
              }
              handleConfirm={() => {
                handleRemoveProduct(id);
              }}
              shouldConfirm={product.id >= 0}
              triggerStyles={{
                position: 'absolute',
                left: -45,
              }}
              triggerType="remove-icon"
            />
            <l.HoverButton
              onClick={() => {
                handleNewProduct(updatedProduct);
              }}
              position="absolute"
              left={-22}
            >
              <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
            </l.HoverButton>
          </>
        )}
        {selectedShipper ? (
          SpeciesItemSelector
        ) : showSpecies ? (
          <Cell isEvenRow={isEvenRow}>
            <ty.CaptionText bold>{product.species}</ty.CaptionText>
          </Cell>
        ) : (
          <div />
        )}
        {species && (
          <>
            {selectedShipper ? (
              VarietyItemSelector
            ) : showVariety ? (
              <Cell isEvenRow={isEvenRow}>
                <ty.CaptionText>{product.variety}</ty.CaptionText>
              </Cell>
            ) : (
              <div />
            )}
            {selectedShipper ? (
              SizeItemSelector
            ) : (
              <Cell isEvenRow={isEvenRow}>
                <ty.CaptionText>{product.size}</ty.CaptionText>
              </Cell>
            )}
            {selectedShipper ? (
              PackTypeItemSelector
            ) : (
              <Cell isEvenRow={isEvenRow}>
                <ty.CaptionText>{product.packType}</ty.CaptionText>
              </Cell>
            )}
            <EditableCell
              content={{ dirty: false, value: plu || '' }}
              defaultChildren={
                <l.Flex
                  alignCenter
                  bg={
                    isEvenRow
                      ? th.colors.background
                      : th.colors.brand.containerBackground
                  }
                  height={22}
                  px={th.spacing.tn}
                  width={th.sizes.fill}
                >
                  <ty.CaptionText>{plu || '-'}</ty.CaptionText>
                </l.Flex>
              }
              editing={!!selectedShipper}
              error={showErrors && isDuplicate}
              onChange={(e) => {
                handleChange('plu', e.target.value);
              }}
              showBorder={false}
            />
          </>
        )}
      </l.Grid>
      {vessels.map((vessel, idx) => {
        const entry = entries.find((entry) => entry.vesselId === vessel.id);
        return (
          <l.Flex
            alignCenter
            bg={
              selectedShipper
                ? undefined
                : isEvenRow
                ? th.colors.background
                : th.colors.brand.containerBackground
            }
            height={th.sizes.fill}
            justifyCenter
            key={idx}
            mx={th.spacing.sm}
          >
            {entry ? (
              selectedShipper ? (
                <Input
                  dirty={false}
                  editing={true}
                  type="number"
                  min={0}
                  onChange={(e) => {
                    handleEntryChange({
                      ...entry,
                      palletCount: e.target.value,
                    });
                  }}
                  textAlign="center"
                  value={getEntryValue(entry, 'palletCount').value}
                />
              ) : (
                <ty.CaptionText center mr={th.spacing.md}>
                  {entry.palletCount}
                </ty.CaptionText>
              )
            ) : (
              <ty.CaptionText center mr={th.spacing.md}>
                {vessel.id === 0 ? '' : '-'}
              </ty.CaptionText>
            )}
          </l.Flex>
        );
      })}
    </ProductWrapper>
  );
};

export default ProductRow;
