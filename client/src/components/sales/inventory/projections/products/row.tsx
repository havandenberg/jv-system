import React from 'react';
import styled from '@emotion/styled';

import MinusInCircle from 'assets/images/minus-in-circle';
import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell, {
  EDITABLE_CELL_HEIGHT,
  Input,
} from 'components/editable-cell';
import { ShipperProjectionProduct } from 'types';
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
}: ShipperProjectionProps) => {
  const newProduct = {
    id: -1,
    species: '',
    variety: '',
    size: '',
    packType: '',
    plu: '',
  };
  return (
    <ProductWrapper>
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
    mt={th.spacing.xs}
  >
    <l.Flex
      alignCenter
      justifyEnd
      mr={th.spacing.md}
      width={`calc(${th.sizes.fill} - ${th.spacing.md})`}
    >
      <ty.CaptionText secondary>Total {species} Pallets</ty.CaptionText>
    </l.Flex>
    {productTotals.map((total, idx) => (
      <l.Flex alignCenter justifyCenter key={idx}>
        <ty.CaptionText bold center mr={th.spacing.md}>
          {total}
        </ty.CaptionText>
      </l.Flex>
    ))}
  </ProductWrapper>
);

const ProductRow = (
  props: {
    duplicateProductIds: number[];
    gridTemplateColumns: string;
    product: ShipperProjectionProductWithEntries;
    showErrors: boolean;
  } & ShipperProjectionProps,
) => {
  const {
    changeHandlers: { handleEntryChange, handleProductChange },
    newItemHandlers: { handleNewProduct },
    removeItemHandlers: { handleRemoveProduct },
    valueGetters: { getEntryValue, getProductValue },
    duplicateProductIds,
    gridTemplateColumns,
    product,
    showErrors,
  } = props;
  const { entries, id } = product;

  const isDuplicate = duplicateProductIds.includes(parseInt(id, 10));

  const updatedProduct = {
    id: product.id,
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
        position="relative"
      >
        <l.HoverButton
          onClick={() => {
            handleRemoveProduct(id);
          }}
          position="absolute"
          left={-46}
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
        <EditableCell
          content={{ dirty: false, value: species || '' }}
          defaultChildren={null}
          editing={true}
          error={showErrors && (!species || isDuplicate)}
          onChange={(e) => {
            handleChange('species', e.target.value);
          }}
        />
        <EditableCell
          content={{ dirty: false, value: variety || '' }}
          defaultChildren={null}
          editing={true}
          error={showErrors && (!variety || isDuplicate)}
          onChange={(e) => {
            handleChange('variety', e.target.value);
          }}
        />
        <EditableCell
          content={{ dirty: false, value: size || '' }}
          defaultChildren={null}
          editing={true}
          error={showErrors && (!size || isDuplicate)}
          onChange={(e) => {
            handleChange('size', e.target.value);
          }}
        />
        <EditableCell
          content={{ dirty: false, value: packType || '' }}
          defaultChildren={null}
          editing={true}
          error={showErrors && (!packType || isDuplicate)}
          onChange={(e) => {
            handleChange('packType', e.target.value);
          }}
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
      </l.Grid>
      {entries.map((entry, idx) => (
        <Input
          dirty={false}
          editing={true}
          key={idx}
          type="number"
          min={0}
          onChange={(e) => {
            handleEntryChange({ ...entry, palletCount: e.target.value });
          }}
          textAlign="center"
          value={getEntryValue(entry, 'palletCount').value}
        />
      ))}
    </ProductWrapper>
  );
};

export default ProductRow;
