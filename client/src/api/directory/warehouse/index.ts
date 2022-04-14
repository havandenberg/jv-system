import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useQuerySet,
  useQueryValue,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

export const WAREHOUSE_DETAILS_QUERY = loader('./details.gql');
const WAREHOUSE_LIST_QUERY = loader('./list.gql');
const WAREHOUSE_UPDATE = loader('./update.gql');

export const useWarehouses = () => {
  const [search = ''] = useSearchQueryParam();
  const [warehouseSearch = ''] = useQueryValue('warehouseSearch');
  const [{ sortBy = 'warehouseName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ city, postalState }] = useQuerySet({
    city: StringParam,
    postalState: StringParam,
  });

  const filteredCityValues = useFilteredQueryValues(city, {
    columnName: 'city',
    tableName: 'warehouse',
    schemaName: 'directory',
  });

  const filteredPostalStateValues = useFilteredQueryValues(postalState, {
    columnName: 'postal_state',
    tableName: 'warehouse',
    schemaName: 'directory',
  });

  const { data, error, loading } = useQuery<Query>(WAREHOUSE_LIST_QUERY, {
    variables: {
      city: filteredCityValues,
      postalState: filteredPostalStateValues,
      orderBy,
      search: getSearchArray(search || warehouseSearch),
    },
  });

  return {
    data: data ? data.warehouses : undefined,
    error,
    loading,
  };
};

export const useWarehouse = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(WAREHOUSE_DETAILS_QUERY, {
    variables: { id, orderBy },
  });
  return {
    data: data ? data.warehouse : undefined,
    error,
    loading,
  };
};

export const useUpdateWarehouse = (id: string) => {
  return useMutation<Mutation>(WAREHOUSE_UPDATE, {
    refetchQueries: [
      {
        query: WAREHOUSE_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
};
