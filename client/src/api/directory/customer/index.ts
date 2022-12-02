import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { ArrayParam } from 'use-query-params';

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

export const CUSTOMER_DETAILS_QUERY = loader('./details.gql');
const CUSTOMER_LIST_QUERY = loader('./list.gql');
const CUSTOMER_UPDATE = loader('./update.gql');

export const CUSTOMER_DISTINCT_VALUES_QUERY = loader('./distinct-values.gql');

export const useCustomers = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [customerSearch = ''] = useQueryValue('customerSearch');
  const [{ sortBy = 'customerName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ city, postalState }] = useQuerySet({
    city: ArrayParam,
    postalState: ArrayParam,
  });

  const filteredCityValues = useFilteredQueryValues(city, {
    columnName: 'city',
    tableName: 'customer',
    schemaName: 'directory',
  });

  const filteredPostalStateValues = useFilteredQueryValues(postalState, {
    columnName: 'postal_state',
    tableName: 'customer',
    schemaName: 'directory',
  });

  const { data, error, loading } = useQuery<Query>(CUSTOMER_LIST_QUERY, {
    variables: {
      city: filteredCityValues,
      postalState: filteredPostalStateValues,
      orderBy: orderByOverride || orderBy,
      search: getSearchArray(search || customerSearch),
    },
  });

  return {
    data: data ? data.customers : undefined,
    error,
    loading,
  };
};

export const useCustomer = (id: string, orderByOverride?: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = orderByOverride || getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(CUSTOMER_DETAILS_QUERY, {
    variables: {
      id,
      orderBy,
    },
  });
  return {
    data: data ? data.customer : undefined,
    error,
    loading,
  };
};

export const useUpdateCustomer = (id: string) => {
  return useMutation<Mutation>(CUSTOMER_UPDATE, {
    refetchQueries: [
      {
        query: CUSTOMER_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
};
