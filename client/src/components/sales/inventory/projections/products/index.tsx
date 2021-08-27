import React from 'react';
import { groupBy, isEmpty, mapObjIndexed, pluck, values } from 'ramda';

import { ShipperProjectionVessel } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import {
  ShipperProjectionProductWithEntries,
  ShipperProjectionProps,
} from '../types';
import ProductRow, { NewProductRow, ProductTotalRow } from './row';

interface Props extends ShipperProjectionProps {
  duplicateProductIds: number[];
  gridTemplateColumns: string;
  products: ShipperProjectionProductWithEntries[];
  showErrors: boolean;
  vessels: ShipperProjectionVessel[];
}

const Products = ({
  gridTemplateColumns,
  products,
  vessels,
  ...rest
}: Props) => {
  const { getProductValue } = rest.valueGetters;
  const groupedProducts = groupBy(
    (product) => getProductValue(product, 'species').value,
    products,
  );

  const productTotals = mapObjIndexed(
    (products) =>
      vessels.map((vessel) =>
        pluck('entries', products)
          .flat()
          .filter((entry) => entry.vesselId === vessel.id)
          .reduce((acc, entry) => acc + +entry.palletCount, 0),
      ),
    groupedProducts,
  );

  const showNewProductTrigger = !isEmpty(vessels) && !groupedProducts[''];

  return (
    <>
      <l.Grid
        gridColumnGap={th.spacing.sm}
        gridTemplateColumns={gridTemplateColumns}
        mb={th.spacing.sm}
        mt={th.spacing.md}
      >
        <l.Grid
          gridColumnGap={th.spacing.xs}
          gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
          marginLeft={52}
        >
          <ty.CaptionText secondary>Species</ty.CaptionText>
          <ty.CaptionText secondary>Variety</ty.CaptionText>
          <ty.CaptionText secondary>Size</ty.CaptionText>
          <ty.CaptionText secondary>Pack Type</ty.CaptionText>
          <ty.CaptionText secondary>PLU</ty.CaptionText>
        </l.Grid>
      </l.Grid>
      {values(
        mapObjIndexed(
          (products, key, object) => (
            <l.Div
              key={key}
              mb={th.sizes.icon}
              mt={th.spacing.md}
              position="relative"
            >
              <l.Div zIndex={2}>
                {products.map((product, idx) => (
                  <ProductRow
                    {...rest}
                    gridTemplateColumns={gridTemplateColumns}
                    key={idx}
                    product={product}
                  />
                ))}
                {key && (
                  <ProductTotalRow
                    gridTemplateColumns={gridTemplateColumns}
                    productTotals={productTotals[key]}
                    species={getProductValue(products[0], 'species').value}
                  />
                )}
              </l.Div>
              <l.Div
                background={
                  object && Object.keys(object).indexOf(key) % 2 === 0
                    ? th.colors.brand.containerBackground
                    : 'transparent'
                }
                position="absolute"
                top={`-${th.spacing.sm}`}
                left={`-${th.spacing.sm}`}
                height={`calc(${th.sizes.fill} + 12px)`}
                width={`calc(${th.sizes.fill} + ${
                  vessels.length - 3
                } * 156px - ${th.sizes.md} + ${th.spacing.sm})`}
                zIndex={-1}
              />
            </l.Div>
          ),
          groupedProducts,
        ),
      )}
      {showNewProductTrigger && <NewProductRow {...rest} />}
      <l.Div height={th.spacing.sm} />
    </>
  );
};

export default Products;
