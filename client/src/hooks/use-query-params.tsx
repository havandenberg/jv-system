import {
  DecodedValueMap,
  QueryParamConfigMap,
  StringParam,
  UrlUpdateType,
  useQueryParam,
  useQueryParams,
} from 'use-query-params';

type UpdateType = UrlUpdateType | undefined;

export const dateRangeParamSet = {
  startDate: StringParam,
  endDate: StringParam,
};
export const searchParam = 'search';
const sortParamSet = { sortBy: StringParam, sortOrder: StringParam };

const useQuerySet = (
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

export const useSearchQueryParam = () => useQueryValue(searchParam);

export const useSortQueryParams = (updateType?: UpdateType) =>
  useQuerySet(sortParamSet, updateType);
