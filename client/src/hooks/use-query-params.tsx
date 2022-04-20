import {
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
const sortParamSet = { sortBy: StringParam, sortOrder: StringParam };

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

export const useDateRangeQueryParams = (updateType?: UpdateType) =>
  useQuerySet(dateRangeParamSet, updateType);

export const useSearchQueryParam = (paramName?: string) =>
  useQueryValue(paramName || searchParam);

export const useIDQueryParam = () => useQueryValue(idParam);

export const useSortQueryParams = (updateType?: UpdateType) =>
  useQuerySet(sortParamSet, updateType);

export const useInventoryQueryParams = () =>
  useQuerySet({
    species: StringParam,
    variety: StringParam,
    size: StringParam,
    packType: StringParam,
    plu: StringParam,
    coast: StringParam,
    location: StringParam,
    shipper: StringParam,
    countryOfOrigin: StringParam,
    daysInStorage: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    detailsIndex: StringParam,
    categoryTypes: StringParam,
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
    view: StringParam,
    projectionId: StringParam,
  });

export const useProgramsQueryParams = () =>
  useQuerySet({
    commonSpeciesId: StringParam,
    commonVarietyId: StringParam,
    commonSizeId: StringParam,
    commonPackTypeId: StringParam,
    plu: StringParam,
    coast: StringParam,
    shipperId: StringParam,
    customerId: StringParam,
    startDate: StringParam,
    endDate: StringParam,
    view: StringParam,
  });
