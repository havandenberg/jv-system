import React from 'react';
import { equals, groupBy, mapObjIndexed, pluck, values } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import {
  CommonSpecies,
  Customer,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
  Vessel,
} from 'types';
import l from 'ui/layout';
import th from 'ui/theme';

import {
  ShipperProjectionProductWithEntries,
  ShipperProjectionGridProps,
} from '../types';
import ProductRow, { NewProductRow, ProductTotalRow } from './row';

interface Props extends ShipperProjectionGridProps {
  duplicateProductIds: number[];
  gridTemplateColumns: string;
  hasVessels: boolean;
  loading: boolean;
  parentVessels: Vessel[];
  products: ShipperProjectionProductWithEntries[];
  showErrors: boolean;
  showOnlyCommonNames: boolean;
  vessels: ShipperProjectionVesselInfo[];
}

const Products = ({
  currentProjection,
  gridTemplateColumns,
  hasVessels,
  loading: parentLoading,
  parentVessels,
  products,
  selectedShipper,
  selectedVessel,
  showParentVessels,
  vessels,
  ...rest
}: Props) => {
  const {
    data: speciesData,
    loading: speciesLoading,
    error: speciesError,
  } = api.useCommonSpecieses();
  const specieses = (speciesData ? speciesData.nodes : []) as CommonSpecies[];

  const {
    data: customersData,
    loading: customersLoading,
    error: customerError,
  } = api.useCustomers('CUSTOMER_NAME_ASC');
  const customers = (customersData ? customersData.nodes : []) as Customer[];

  const {
    data: allProductsData,
    loading: allProductsLoading,
    error: allProductsError,
  } = api.useShipperProjectionProducts();
  const allProducts = (
    allProductsData ? allProductsData.nodes : []
  ) as ShipperProjectionProduct[];

  const error = allProductsError || speciesError || customerError;
  const productsLoading =
    allProductsLoading || speciesLoading || customersLoading;
  const loading = parentLoading || productsLoading;

  const { getProductValue } = rest.valueGetters;
  const groupedProducts = groupBy(
    (product) => getProductValue(product, 'species').value,
    products,
  );

  const getProductTotals = (ps: ShipperProjectionProductWithEntries[]) =>
    (
      (showParentVessels ? parentVessels : vessels) as (
        | Vessel
        | ShipperProjectionVesselInfo
      )[]
    ).map((vessel) =>
      vessel.id === 0
        ? -1
        : pluck('entries', ps)
            .map((entries) =>
              entries
                .filter((entry) =>
                  showParentVessels
                    ? pluck(
                        'id',
                        vessels.filter((v) => v.vessel?.vesselId === vessel.id),
                      ).includes(entry.vesselInfoId)
                    : entry.vesselInfoId === vessel.id,
                )
                .reverse(),
            )
            .flat()
            .reduce((acc, entry) => acc + +entry.palletCount, 0),
    );

  const hasProducts = products.length > 0;

  const productTotals = mapObjIndexed(
    (ps) => getProductTotals(ps),
    groupedProducts,
  );

  const grandProductTotals = getProductTotals(products);

  const { isAllProjections, isPortal } = rest;

  const hasVesselsFromCurrentWeek =
    vessels.filter((v) => v.id !== 0).length > 0;

  const vesselCount = showParentVessels ? parentVessels.length : vessels.length;

  return (
    <l.Div
      pb={!hasVessels ? 0 : th.spacing.xxl}
      pt={!hasVessels ? 42 : 0}
      relative
    >
      {hasVessels && !loading ? (
        <>
          {values(
            mapObjIndexed((products, key, object) => {
              const isEvenRow =
                object && Object.keys(object).indexOf(key) % 2 === 0;
              return (
                <l.Div
                  key={key}
                  mb={th.spacing.md}
                  mt={
                    object && Object.keys(object).indexOf(key) === 0
                      ? th.spacing.sm
                      : th.spacing.md
                  }
                  relative
                >
                  <l.Div>
                    {
                      products.reduce<{
                        components: React.ReactNode[];
                        previousProduct?: ShipperProjectionProductWithEntries;
                      }>(
                        ({ components, previousProduct }, product, idx) => {
                          const showSpecies =
                            !previousProduct ||
                            !equals(product.species, previousProduct.species);
                          const showVariety =
                            !previousProduct ||
                            !equals(product.variety, previousProduct.variety);
                          return {
                            components: [
                              ...components,
                              <ProductRow
                                {...rest}
                                allProducts={allProducts}
                                error={error}
                                loading={loading}
                                commonSpecieses={specieses}
                                currentProjection={currentProjection}
                                customers={customers}
                                gridTemplateColumns={gridTemplateColumns}
                                hasVesselsFromCurrentWeek={
                                  hasVesselsFromCurrentWeek
                                }
                                index={idx}
                                isEvenRow={!!isEvenRow}
                                key={idx}
                                parentVessels={parentVessels}
                                product={product}
                                previousProduct={previousProduct}
                                showSpecies={showSpecies}
                                showParentVessels={showParentVessels}
                                showVariety={showVariety}
                                selectedShipper={selectedShipper}
                                selectedVessel={selectedVessel}
                                vessels={vessels}
                              />,
                            ],
                            previousProduct: product,
                          };
                        },
                        { components: [] },
                      ).components
                    }
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
                      isEvenRow
                        ? th.colors.brand.containerBackground
                        : 'transparent'
                    }
                    borderBottom={th.borders.secondary}
                    position="absolute"
                    top={`-${th.spacing.sm}`}
                    left={`-${th.spacing.sm}`}
                    height={`calc(${th.sizes.fill} + ${th.spacing.md})`}
                    width={`calc(${th.sizes.fill} + ${
                      vesselCount - 3
                    } * 156px - ${th.sizes.md} + 100px)`} // 100px added as difference from 500 to 600 in gridTemplateColumns
                    zIndex={-1}
                  />
                </l.Div>
              );
            }, groupedProducts),
          )}
          {!groupedProducts[''] &&
            selectedShipper &&
            isPortal &&
            isAllProjections &&
            hasVesselsFromCurrentWeek && (
              <NewProductRow
                hasProducts={hasProducts}
                showParentVessels={showParentVessels}
                {...rest}
              />
            )}
          <ProductTotalRow
            gridTemplateColumns={gridTemplateColumns}
            productTotals={grandProductTotals}
            species="Grand"
          />
          <l.Div
            borderLeft={th.borders.secondary}
            position="absolute"
            top={`-${th.spacing.sm}`}
            bottom={0}
          />
          <l.Div
            borderRight={th.borders.secondary}
            position="absolute"
            top={26}
            left={`calc(${th.sizes.fill} + ${vesselCount - 3} * 156px + 43px)`}
            bottom={0}
          />
          <l.Div
            borderBottom={th.borders.secondary}
            position="absolute"
            left={-52}
            bottom={0}
            width={`calc(${th.sizes.fill} + ${vesselCount - 3} * 156px - ${
              th.spacing.xs
            } + 100px)`}
          />
        </>
      ) : (
        <DataMessage
          data={products}
          emptyProps={{
            header: 'No projections found',
          }}
          error={null}
          loading={loading}
        />
      )}
    </l.Div>
  );
};

export default Products;
