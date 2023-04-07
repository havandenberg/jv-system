import {
  ArrayParam,
  BooleanParam,
  DecodedValueMap,
  QueryParamConfigMap,
  StringParam,
  UrlUpdateType,
  useQueryParam,
  useQueryParams,
} from 'use-query-params';

export type UpdateType = UrlUpdateType | undefined;

export const dateRangeParamSet = {
  startDate: StringParam,
  endDate: StringParam,
  date: StringParam,
};
export const idParam = 'id';
export const searchParam = 'search';
const sortParamSet = {
  sortBy: StringParam,
  sortOrder: StringParam,
  listScrollTop: StringParam,
};

export const useQuerySet = (
  paramSet: QueryParamConfigMap,
  defaultUpdateType: UpdateType = 'pushIn',
) => {
  const [query, setQuery] = useQueryParams(paramSet);

  const updateQuery = (
    newQuery: Partial<DecodedValueMap<QueryParamConfigMap>>,
    updateType: UpdateType = defaultUpdateType,
  ) => {
    setQuery(newQuery, updateType);
  };

  return [query, updateQuery] as const;
};

export const useQueryValue = (paramName: string) => {
  const [query, setQuery] = useQueryParam(paramName, StringParam);

  const updateQuery = (
    value: string | undefined,
    updateType: UpdateType = 'pushIn',
  ) => setQuery(value, updateType);

  return [query, updateQuery] as const;
};

export const useQueryArrayValue = (paramName: string) =>
  useQueryParam(paramName, ArrayParam);

export const useDateRangeQueryParams = (updateType?: UpdateType) =>
  useQuerySet(dateRangeParamSet, updateType);

export const useSearchQueryParam = (paramName?: string) =>
  useQueryValue(paramName || searchParam);

export const useIDQueryParam = () => useQueryValue(idParam);

export const useSortQueryParams = (updateType?: UpdateType) =>
  useQuerySet(sortParamSet, updateType);

export const usePsaInspectionQueryParams = () =>
  useQuerySet({
    exporterName: ArrayParam,
    arrivalCode: ArrayParam,
    coast: ArrayParam,
  });

export const useVesselsQueryParams = () =>
  useQuerySet({
    vesselCode: ArrayParam,
    countryId: ArrayParam,
    arrivalPort: ArrayParam,
    coast: StringParam,
  });

export const useInventoryQueryParams = () =>
  useQuerySet({
    species: StringParam,
    variety: StringParam,
    size: StringParam,
    label: StringParam,
    packType: StringParam,
    speciesTag: StringParam,
    varietyTag: StringParam,
    sizeTag: StringParam,
    packTypeTag: StringParam,
    sizePackType: StringParam,
    plu: StringParam,
    coast: StringParam,
    location: StringParam,
    shipper: StringParam,
    countryOfOrigin: StringParam,
    daysInStorage: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    detailsIndex: StringParam,
    secondaryDetailsIndex: StringParam,
    categoryTypes: StringParam,
    program: StringParam,
  });

export const useProjectionsQueryParams = () =>
  useQuerySet({
    species: StringParam,
    variety: StringParam,
    size: StringParam,
    packType: StringParam,
    plu: StringParam,
    coast: StringParam,
    shipperId: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    graphView: StringParam,
    projectionsView: StringParam,
    projectionId: StringParam,
    vesselId: StringParam,
  });

export const useProgramsQueryParams = () =>
  useQuerySet({
    commonSpeciesId: ArrayParam,
    commonVarietyId: ArrayParam,
    commonSizeId: ArrayParam,
    commonPackTypeId: ArrayParam,
    plu: StringParam,
    customerIdFilter: ArrayParam,
    coast: StringParam,
    shipperId: StringParam,
    customerId: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    programsView: StringParam,
    customerAllocateSearch: StringParam,
    shipperAllocateSearch: StringParam,
  });

export const useOrdersQueryParams = () =>
  useQuerySet({
    species: StringParam,
    variety: StringParam,
    size: StringParam,
    label: StringParam,
    packType: StringParam,
    speciesTag: StringParam,
    varietyTag: StringParam,
    sizeTag: StringParam,
    packTypeTag: StringParam,
    sizePackType: StringParam,
    plu: StringParam,
    coast: StringParam,
    location: StringParam,
    shipper: StringParam,
    countryOfOrigin: StringParam,
    daysInStorage: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    detailsIndex: StringParam,
    backOrderId: StringParam,
    lineId: StringParam,
    view: StringParam,
    orderView: StringParam,
    billingCustomerId: ArrayParam,
    salesUserCode: ArrayParam,
  });

export const useTruckLoadsQueryParams = () =>
  useQuerySet({
    coast: StringParam,
    location: StringParam,
    truckLoadView: StringParam,
    fob: StringParam,
    customerId: ArrayParam,
    warehouseId: ArrayParam,
    vendorId: ArrayParam,
  });

export const useExpensesQueryParams = () =>
  useQuerySet({
    expenseCode: ArrayParam,
    vesselCode: ArrayParam,
  });

export const useVesselControlQueryParams = () =>
  useQuerySet({
    liquidatedStatus: StringParam,
    inStatus: StringParam,
    outStatus: StringParam,
    vessel: ArrayParam,
    shipper: ArrayParam,
    arrivalLocation: ArrayParam,
    vesselControlView: StringParam,
  });

export const useUnpaidsQueryParams = () =>
  useQuerySet({
    salesUserCode: StringParam,
    showLiq: BooleanParam,
    status: StringParam,
    vesselCode: ArrayParam,
    loadId: ArrayParam,
    invoiceId: ArrayParam,
    customer: ArrayParam,
    shipper: ArrayParam,
  });

export const useRepackQueryParams = () =>
  useQuerySet({
    repackView: StringParam,
    runNumber: StringParam,
    repackStyleId: ArrayParam,
    warehouseId: ArrayParam,
    vessel: ArrayParam,
    shipper: ArrayParam,
  });

export const useRepackQueueQueryParams = () =>
  useQuerySet({
    showShipped: BooleanParam,
    showNew: BooleanParam,
    warehouse: StringParam,
  });
