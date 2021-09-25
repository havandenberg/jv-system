import React, { ChangeEvent } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { sortBy, uniqBy } from 'ramda';

import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell, {
  EDITABLE_CELL_HEIGHT,
  Input,
} from 'components/editable-cell';
import ItemSelector from 'components/item-selector';
import { ShipperProjectionProduct, ShipperProjectionVessel } from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  ShipperProjectionProductWithEntries,
  ShipperProjectionProps,
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
}: ShipperProjectionProps & { hasProducts: boolean }) => {
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
    relative
  >
    <l.Flex
      alignCenter
      justifyEnd
      width={`calc(${th.sizes.fill} - ${th.spacing.sm})`}
    >
      <ty.CaptionText bold={species === 'Grand'} secondary>
        {species} Total Pallets
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

const ProductRow = (
  props: {
    allProducts: ShipperProjectionProduct[];
    allProductsError?: ApolloError;
    allProductsLoading: boolean;
    duplicateProductIds: number[];
    gridTemplateColumns: string;
    product: ShipperProjectionProductWithEntries;
    showErrors: boolean;
    vessels: ShipperProjectionVessel[];
  } & ShipperProjectionProps,
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
    product,
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
        <l.HoverButton
          onClick={() => {
            handleRemoveProduct(id);
          }}
          position="absolute"
          left={-45}
        >
          <MinusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
        <l.HoverButton
          onClick={() => {
            handleNewProduct(updatedProduct);
          }}
          position="absolute"
          left={-22}
        >
          <PlusInCircle height={th.sizes.xs} width={th.sizes.xs} />
        </l.HoverButton>
        <ItemSelector
          errorLabel="Species"
          {...getValueSelectorProps('species')}
        />
        {species && (
          <>
            <ItemSelector
              errorLabel="Varieties"
              {...getValueSelectorProps('variety')}
            />
            <ItemSelector
              errorLabel="Sizes"
              {...getValueSelectorProps('size')}
            />
            <ItemSelector
              errorLabel="Pack Types"
              {...getValueSelectorProps('packType')}
            />
            <EditableCell
              content={{ dirty: false, value: plu || '' }}
              defaultChildren={null}
              editing={true}
              error={showErrors && isDuplicate}
              onChange={(e) => {
                handleChange('plu', e.target.value);
              }}
            />
          </>
        )}
      </l.Grid>
      {vessels.map((vessel, idx) => {
        const entry = entries.find((entry) => entry.vesselId === vessel.id);
        return entry ? (
          <l.Flex justifyCenter key={idx} mx={th.spacing.sm}>
            <Input
              dirty={false}
              editing={true}
              type="number"
              min={0}
              onChange={(e) => {
                handleEntryChange({ ...entry, palletCount: e.target.value });
              }}
              textAlign="center"
              value={getEntryValue(entry, 'palletCount').value}
            />
          </l.Flex>
        ) : (
          <ty.CaptionText key={idx} center mr={th.spacing.md}>
            {vessel.id === 0 ? '' : '-'}
          </ty.CaptionText>
        );
      })}
    </ProductWrapper>
  );
};

export default ProductRow;
