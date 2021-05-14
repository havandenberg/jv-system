import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { StringParam } from 'use-query-params';

const WAREHOUSE_DETAILS_QUERY = loader('./details.gql');
const WAREHOUSE_LIST_QUERY = loader('./list.gql');

export const useWarehouses = () => {
  const [search = ''] = useSearchQueryParam();
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
      search,
    },
  });

  return {
    data: data ? data.warehouses : undefined,
    error,
    loading,
  };
};

export const useWarehouse = (id: string) => {
  const { data, error, loading } = useQuery<Query>(WAREHOUSE_DETAILS_QUERY, {
    variables: { id },
  });
  return {
    data: data ? data.warehouse : undefined,
    error,
    loading,
  };
};
