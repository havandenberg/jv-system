import { ShipperProjectionProduct } from 'types';

export const hasCompleteCommonProduct = (product: ShipperProjectionProduct) =>
  product.commonSpeciesId &&
  product.commonVarietyId &&
  product.commonSizeId &&
  product.commonPackTypeId;

export const getProductIdentifier = (
  product: ShipperProjectionProduct,
  useIdOnly?: boolean,
) =>
  hasCompleteCommonProduct(product) && !useIdOnly
    ? `${product.commonSpeciesId} ${product.commonVarietyId} ${product.commonSizeId} ${product.commonPackTypeId} ${product.plu}`
    : product.id;
