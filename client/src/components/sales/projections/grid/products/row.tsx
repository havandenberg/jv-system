import React, { ChangeEvent } from 'react';
import { ApolloError } from '@apollo/client';
import styled from '@emotion/styled';
import { pascalCase } from 'change-case';
import { equals, pick, sortBy, sum, uniqBy } from 'ramda';

import PlusInCircle from 'assets/images/plus-in-circle';
import EditableCell from 'components/editable-cell';
import useItemSelector from 'components/item-selector';
import ItemLinkRow, { ItemLink } from 'components/item-selector/link';
import { BasicModal } from 'components/modal';
import {
  CommonSpecies,
  Maybe,
  Shipper,
  ShipperProjectionProduct,
  ShipperProjectionVesselInfo,
} from 'types';
import l, { divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { getProductIdentifier } from '../../utils';
import {
  ShipperProjectionProductWithEntries,
  ShipperProjectionGridProps,
  ProductUpdate,
} from '../types';

const ProductWrapper = styled(l.Grid)(
  {
    alignItems: 'center',
    height: 24,
    zIndex: 2,
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
      <ty.CaptionText textAlign="right">
        {species === 'Grand' ? 'Grand ' : ''}Total:
      </ty.CaptionText>
      <ty.CaptionText
        bold
        ml={th.spacing.lg}
        mr={th.spacing.md}
        width={th.spacing.lg}
      >
        ({sum(productTotals.filter((x) => x > 0))})
      </ty.CaptionText>
    </l.Flex>
    {productTotals.map((total, idx) => (
      <l.Flex alignCenter justifyCenter key={idx}>
        <ty.CaptionText center mr={th.spacing.md}>
          {total < 0 ? '' : total}
        </ty.CaptionText>
      </l.Flex>
    ))}
  </ProductWrapper>
);

const Cell = styled(l.Flex)(
  ({
    error,
    isEvenRow,
    warning,
  }: {
    error: boolean;
    isEvenRow: boolean;
    warning: boolean;
  }) => ({
    alignItems: 'center',
    background: isEvenRow
      ? th.colors.background
      : th.colors.brand.containerBackground,
    border: error
      ? th.borders.error
      : warning
      ? th.borders.warning
      : th.borders.disabled,
    height: 20,
    padding: `0 ${th.spacing.tn}`,
    position: 'relative',
    width: `calc(${th.sizes.fill} - ${th.spacing.sm} - 2px)`,
  }),
);

const ProductRow = (
  props: {
    allProducts: ShipperProjectionProduct[];
    error?: ApolloError;
    isPortal: boolean;
    isAllProjections: boolean;
    loading: boolean;
    commonSpecieses: CommonSpecies[];
    duplicateProductIds: number[];
    gridTemplateColumns: string;
    index: number;
    isEvenRow: boolean;
    previousProduct?: ShipperProjectionProductWithEntries;
    product: ShipperProjectionProductWithEntries;
    showOnlyCommonNames: boolean;
    showSpecies: boolean;
    showVariety: boolean;
    selectedShipper?: Maybe<Shipper>;
    showErrors: boolean;
    vessels: ShipperProjectionVesselInfo[];
  } & ShipperProjectionGridProps,
) => {
  const {
    commonSpecieses,
    changeHandlers: { handleEntryChange, handleProductChange },
    newItemHandlers: { handleNewProduct },
    removeItemHandlers: { handleRemoveProduct },
    valueGetters: { getEntryValue, getProductValue },
    allProducts,
    error,
    isAllProjections,
    isPortal,
    duplicateProductIds,
    gridTemplateColumns,
    isEvenRow,
    loading,
    previousProduct,
    product,
    selectedShipper,
    showOnlyCommonNames,
    showSpecies,
    showVariety,
    showErrors,
    vessels,
  } = props;
  const { id } = product;

  const isDuplicate = duplicateProductIds.includes(parseInt(id, 10));

  const updatedProduct = {
    id: product.id,
    shipperId: product.shipperId,
    species: getProductValue(product, 'species').value,
    variety: getProductValue(product, 'variety').value,
    size: getProductValue(product, 'size').value,
    packType: getProductValue(product, 'packType').value,
    plu: getProductValue(product, 'plu').value,
    commonSpeciesId: getProductValue(product, 'commonSpeciesId').value,
    commonVarietyId: getProductValue(product, 'commonVarietyId').value,
    commonSizeId: getProductValue(product, 'commonSizeId').value,
    commonPackTypeId: getProductValue(product, 'commonPackTypeId').value,
  };
  const {
    species,
    variety,
    size,
    packType,
    plu,
    commonSpeciesId,
    commonVarietyId,
    commonSizeId,
    commonPackTypeId,
  } = updatedProduct;

  const commonSpecies = commonSpecieses.find((sp) => sp.id === commonSpeciesId);
  const commonVariety = commonSpecies?.commonVarieties.nodes.find(
    (v) => v && v.id === commonVarietyId,
  );
  const commonSize = commonSpecies?.commonSizes.nodes.find(
    (sz) => sz && sz.id === commonSizeId,
  );
  const commonPackType = commonSpecies?.commonPackTypes.nodes.find(
    (pt) => pt && pt.id === commonPackTypeId,
  );

  const handleChange = (
    key: keyof ShipperProjectionProduct,
    value: string | null,
  ) => {
    handleProductChange(
      {
        ...updatedProduct,
        [key]: value,
      },
      key as keyof ProductUpdate,
    );
  };

  const commonSelectorProps = {
    closeOnSelect: true,
    error,
    height: 150,
    loading,
    panelGap: 0,
    width: 250,
  };

  const getSelectorValue = (type: keyof ShipperProjectionProduct) => {
    switch (type) {
      case 'species':
        return showOnlyCommonNames
          ? commonSpecies?.speciesName || species
          : species;
      case 'variety':
        return showOnlyCommonNames
          ? commonVariety?.varietyName || variety
          : variety;
      case 'size':
        return showOnlyCommonNames ? commonSize?.sizeName || size : size;
      case 'packType':
        return showOnlyCommonNames
          ? commonPackType?.packTypeName || packType
          : packType;
      default:
        return '';
    }
  };

  const isValueDirty = (type: keyof ShipperProjectionProduct) => {
    switch (type) {
      case 'species':
        return commonSpecies?.speciesName !== species;
      case 'variety':
        return commonVariety?.varietyName !== variety;
      case 'size':
        return commonSize?.sizeName !== size;
      case 'packType':
        return commonPackType?.packTypeName !== packType;
      default:
        return true;
    }
  };

  const getValueSelectorProps = (type: keyof ShipperProjectionProduct) => {
    const value = getSelectorValue(type);

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

    const getItemContent = (item: ShipperProjectionProduct) => (
      <ty.CaptionText pl={th.spacing.sm}>{item[type]}</ty.CaptionText>
    );

    const selectItem = (p: ShipperProjectionProduct) => {
      handleChange(type, p[type] || '');
    };

    return {
      ...commonSelectorProps,
      allItems,
      editableCellProps: {
        content: { dirty: false, value },
        defaultChildren: null,
        editing: true,
        error: showErrors && (!value || isDuplicate),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(type, e.target.value);
        },
      },
      getItemContent,
      nameKey: type,
      selectItem,
    };
  };

  const getLinkSelectorProps = (
    type: 'species' | 'variety' | 'size' | 'packType',
  ) => {
    const value = getSelectorValue(type);
    const isDirty = isValueDirty(type);

    const allItems = sortBy(
      (p) => p.text,
      commonSpecieses
        .map((s) => {
          const speciesIsValid = s.id === commonSpeciesId;
          switch (type) {
            case 'variety':
              return (
                speciesIsValid &&
                s.commonVarieties.nodes.map(
                  (v) =>
                    v && {
                      color: v.uiColor,
                      id: v.id,
                      text: v.varietyName || '',
                    },
                )
              );
            case 'size':
              return (
                speciesIsValid &&
                s.commonSizes.nodes.map(
                  (sz) =>
                    sz && {
                      id: sz.id,
                      text: sz.sizeName || '',
                    },
                )
              );
            case 'packType':
              return (
                speciesIsValid &&
                s.commonPackTypes.nodes.map(
                  (pt) =>
                    pt && {
                      id: pt.id,
                      text: pt.packTypeName || '',
                    },
                )
              );
            default:
              return {
                color: s.uiColor,
                id: s.id,
                text: s.speciesName || '',
              };
          }
        })
        .flat()
        .filter((link) => !!link) as ItemLink[],
    );

    const commonProductId =
      updatedProduct[`common${pascalCase(type)}Id` as keyof ProductUpdate];

    const getItemContent = (link: ItemLink) => (
      <ItemLinkRow active={link.id === commonProductId} link={link} />
    );

    const selectItem = ({ id }: ItemLink) => {
      handleChange(
        `common${pascalCase(type)}Id` as keyof ProductUpdate,
        id === '-1' ? null : id,
      );
    };

    if (commonProductId) {
      allItems.push({ id: '-1', text: 'Clear linked product' });
    }

    return {
      ...commonSelectorProps,
      allItems,
      editableCellProps: {
        content: { dirty: false, value },
        defaultChildren: null,
        editing: true,
        error: !commonProductId || (showErrors && (!value || isDuplicate)),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          handleChange(type, e.target.value);
        },
        warning: isDirty,
      },
      getItemContent,
      nameKey: 'text' as keyof ItemLink,
      selectItem,
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

  const speciesLinkSelectorProps = getLinkSelectorProps('species');
  const varietyLinkSelectorProps = getLinkSelectorProps('variety');
  const sizeLinkSelectorProps = getLinkSelectorProps('size');
  const packTypeLinkSelectorProps = getLinkSelectorProps('packType');

  const { ItemSelector: SpeciesLinkSelector } = useItemSelector({
    errorLabel: 'species',
    ...speciesLinkSelectorProps,
  });

  const { ItemSelector: VarietyLinkSelector } = useItemSelector({
    errorLabel: 'varieties',
    ...varietyLinkSelectorProps,
  });

  const { ItemSelector: SizeLinkSelector } = useItemSelector({
    errorLabel: 'sizes',
    ...sizeLinkSelectorProps,
  });

  const { ItemSelector: PackTypeLinkSelector } = useItemSelector({
    errorLabel: 'pack types',
    ...packTypeLinkSelectorProps,
  });

  const SpeciesSelector = isPortal ? SpeciesItemSelector : SpeciesLinkSelector;
  const VarietySelector = isPortal ? VarietyItemSelector : VarietyLinkSelector;
  const SizeSelector = isPortal ? SizeItemSelector : SizeLinkSelector;
  const PackTypeSelector = isPortal
    ? PackTypeItemSelector
    : PackTypeLinkSelector;

  const isDifferentVariety =
    previousProduct &&
    !equals(
      updatedProduct.variety,
      getProductValue(previousProduct, 'variety').value,
    );

  const productEditable =
    selectedShipper && (isPortal ? isAllProjections : !isAllProjections);
  const shipperEditable = selectedShipper && isPortal && isAllProjections;

  return (
    <ProductWrapper
      gridColumnGap={th.spacing.md}
      gridTemplateColumns={gridTemplateColumns}
      mt={isDifferentVariety ? th.spacing.md : undefined}
    >
      <l.Grid
        alignCenter
        key={product.id}
        gridColumnGap={th.spacing.xs}
        gridTemplateColumns="repeat(2, 1fr) repeat(3, 0.7fr)"
        ml={52}
        relative
      >
        {shipperEditable && (
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
              triggerProps={{
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
        {productEditable ? (
          SpeciesSelector
        ) : showSpecies ? (
          <Cell
            {...pick(
              ['error', 'warning'],
              speciesLinkSelectorProps.editableCellProps,
            )}
            isEvenRow={isEvenRow}
            width={89}
          >
            <ty.CaptionText bold ellipsis title={product.species}>
              {product.species}
            </ty.CaptionText>
          </Cell>
        ) : (
          <div />
        )}
        {species && (
          <>
            {productEditable ? (
              VarietySelector
            ) : showVariety ? (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  varietyLinkSelectorProps.editableCellProps,
                )}
                isEvenRow={isEvenRow}
                width={89}
              >
                <ty.CaptionText ellipsis title={product.variety}>
                  {product.variety}
                </ty.CaptionText>
              </Cell>
            ) : (
              <div />
            )}
            {productEditable ? (
              SizeSelector
            ) : (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  sizeLinkSelectorProps.editableCellProps,
                )}
                isEvenRow={isEvenRow}
                width={58}
              >
                <ty.CaptionText ellipsis title={product.size}>
                  {product.size}
                </ty.CaptionText>
              </Cell>
            )}
            {productEditable ? (
              PackTypeSelector
            ) : (
              <Cell
                {...pick(
                  ['error', 'warning'],
                  packTypeLinkSelectorProps.editableCellProps,
                )}
                isEvenRow={isEvenRow}
                width={58}
              >
                <ty.CaptionText ellipsis title={product.packType}>
                  {product.packType}
                </ty.CaptionText>
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
                  <ty.CaptionText>{plu}</ty.CaptionText>
                </l.Flex>
              }
              editing={!!productEditable}
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
        const entries =
          vessel.shipperProjectionEntriesByVesselInfoId?.nodes.filter(
            (e) =>
              e?.product &&
              getProductIdentifier(e.product, !!selectedShipper) ===
                getProductIdentifier(product, !!selectedShipper),
          );
        const firstEntry = entries?.[0];

        const palletCountCurrentValue = `${entries?.reduce(
          (acc, entry) =>
            acc + parseInt(getEntryValue(entry, 'palletCount').value, 10) || 0,
          0,
        )}`;
        const palletCountInputValue =
          !!palletCountCurrentValue && palletCountCurrentValue !== '0'
            ? palletCountCurrentValue
            : '-';
        const palletCountValue =
          entries?.reduce(
            (acc, entry) =>
              acc +
              (entry && !!entry.palletCount
                ? parseInt(entry.palletCount, 10)
                : 0),
            0,
          ) || '-';

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
            height={`calc(${th.sizes.fill} - 6px)`}
            justifyCenter
            key={idx}
            mx={th.spacing.sm}
          >
            {firstEntry ? (
              shipperEditable ? (
                <EditableCell
                  content={{ dirty: false, value: palletCountInputValue }}
                  defaultChildren={null}
                  editing={true}
                  inputProps={{
                    min: 0,
                    textAlign: 'center',
                    type: 'number',
                  }}
                  onChange={(e) => {
                    handleEntryChange({
                      ...firstEntry,
                      palletCount: e.target.value,
                    });
                  }}
                />
              ) : (
                <ty.CaptionText center mr={th.spacing.md}>
                  {palletCountValue}
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
