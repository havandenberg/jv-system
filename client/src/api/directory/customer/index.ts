import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

export const CUSTOMER_DETAILS_QUERY = loader('./details.gql');
const CUSTOMER_LIST_QUERY = loader('./list.gql');
const CUSTOMER_UPDATE = loader('./update.gql');

export const useCustomers = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'customerName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ city, postalState }] = useQuerySet({
    city: StringParam,
    postalState: StringParam,
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
      orderBy,
      search,
    },
  });

  return {
    data: data ? data.customers : undefined,
    error,
    loading,
  };
};

export const useCustomer = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

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
