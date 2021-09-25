import React from 'react';
import { groupBy, mapObjIndexed, pluck, values } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import { ShipperProjectionProduct, ShipperProjectionVessel } from 'types';
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
  hasVessels: boolean;
  products: ShipperProjectionProductWithEntries[];
  showErrors: boolean;
  vessels: ShipperProjectionVessel[];
}

const Products = ({
  gridTemplateColumns,
  hasVessels,
  products,
  vessels,
  ...rest
}: Props) => {
  const {
    data: allProductsData,
    loading: allProductsLoading,
    error: allProductsError,
  } = api.useShipperProjectionProducts();
  const allProducts = (
    allProductsData ? allProductsData.nodes : []
  ) as ShipperProjectionProduct[];

  const { getProductValue } = rest.valueGetters;
  const groupedProducts = groupBy(
    (product) => getProductValue(product, 'species').value,
    products,
  );

  const getProductTotals = (products: ShipperProjectionProductWithEntries[]) =>
    vessels.map((vessel) =>
      vessel.id === 0
        ? -1
        : pluck('entries', products)
            .flat()
            .filter((entry) => entry.vesselId === vessel.id)
            .reduce((acc, entry) => acc + +entry.palletCount, 0),
    );

  const hasProducts = products.length > 0;

  const productTotals = mapObjIndexed(
    (products) => getProductTotals(products),
    groupedProducts,
  );

  const grandProductTotals = getProductTotals(products);

  return (
    <l.Div mb={!hasVessels ? 0 : th.spacing.xxl} relative>
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
          relative
        >
          <ty.CaptionText secondary>Species</ty.CaptionText>
          <ty.CaptionText secondary>Variety</ty.CaptionText>
          <ty.CaptionText secondary>Size</ty.CaptionText>
          <ty.CaptionText secondary>Pack Type</ty.CaptionText>
          <ty.CaptionText secondary>PLU/GTIN</ty.CaptionText>
          {hasVessels && (
            <l.Div
              borderTop={th.borders.secondary}
              position="absolute"
              left={-52}
              bottom={`-${th.spacing.sm}`}
              width={`calc(${th.sizes.fill} + ${vessels.length - 3} * 156px - ${
                th.sizes.icon
              } + 544px)`}
            />
          )}
        </l.Grid>
      </l.Grid>
      {values(
        mapObjIndexed(
          (products, key, object) => (
            <l.Div key={key} my={th.spacing.md} relative>
              <l.Div>
                {products.map((product, idx) => (
                  <ProductRow
                    {...rest}
                    allProducts={allProducts}
                    allProductsError={allProductsError}
                    allProductsLoading={allProductsLoading}
                    gridTemplateColumns={gridTemplateColumns}
                    key={idx}
                    product={product}
                    vessels={vessels}
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
                borderBottom={th.borders.secondary}
                position="absolute"
                top={`-${th.spacing.sm}`}
                left={`-${th.spacing.sm}`}
                height={`calc(${th.sizes.fill} + ${th.spacing.md})`}
                width={`calc(${th.sizes.fill} + ${
                  vessels.length - 3
                } * 156px - ${th.sizes.md})`}
                zIndex={-1}
              />
            </l.Div>
          ),
          groupedProducts,
        ),
      )}
      {hasVessels && !groupedProducts[''] && (
        <NewProductRow hasProducts={hasProducts} {...rest} />
      )}
      {hasVessels ? (
        <>
          <ProductTotalRow
            gridTemplateColumns={gridTemplateColumns}
            productTotals={grandProductTotals}
            species="Grand"
          />
          <l.Div
            borderLeft={th.borders.secondary}
            position="absolute"
            top={27}
            bottom={0}
          />
          <l.Div
            borderRight={th.borders.secondary}
            position="absolute"
            top={26}
            left={`calc(${th.sizes.fill} + ${
              vessels.length - 3
            } * 156px - 57px)`}
            bottom={0}
          />
          <l.Div
            borderBottom={th.borders.secondary}
            position="absolute"
            left={-52}
            bottom={0}
            width={`calc(${th.sizes.fill} + ${vessels.length - 3} * 156px - ${
              th.spacing.xs
            })`}
          />
        </>
      ) : (
        <DataMessage
          data={[]}
          emptyProps={{
            header: 'No Products Found',
            wrapperStyles: {
              width: `calc(${th.sizes.fill} + ${vessels.length - 3} * 156px - ${
                th.sizes.md
              })`,
            },
          }}
          error={null}
          loading={false}
        />
      )}
    </l.Div>
  );
};

export default Products;
