import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

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
import { ArrayParam } from 'use-query-params';

export const VENDOR_DETAILS_QUERY = loader('./details.gql');
export const VENDOR_LIST_QUERY = loader('./list.gql');
const VENDOR_UPDATE = loader('./update.gql');

export const VENDOR_DISTINCT_VALUES_QUERY = loader('./distinct-values.gql');

export const useVendorsVariables = (
  orderByOverride?: string,
  searchOverride?: string,
) => {
  const [search = ''] = useSearchQueryParam();
  const [vendorSearch = ''] = useQueryValue('vendorSearch');
  const [{ sortBy = 'vendorName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ vendorType }] = useQuerySet({
    vendorType: ArrayParam,
  });

  const filteredVendorTypeValues = useFilteredQueryValues(vendorType, {
    columnName: 'vendor_type',
    tableName: 'vendor',
    schemaName: 'directory',
  });

  return {
    vendorType: filteredVendorTypeValues,
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(searchOverride || search || vendorSearch),
  };
};

export const useVendors = (
  orderByOverride?: string,
  searchOverride?: string,
) => {
  const variables = useVendorsVariables(orderByOverride, searchOverride);

  const { data, error, loading } = useQuery<Query>(VENDOR_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.vendors : undefined,
    error,
    loading,
  };
};

export const useVendor = (id: string, orderByOverride?: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  const variables = useVendorsVariables();

  const { data, error, loading } = useQuery<Query>(VENDOR_DETAILS_QUERY, {
    variables: {
      id,
      ...variables,
      orderBy: orderByOverride || orderBy,
    },
  });
  return {
    data: data ? data.vendor : undefined,
    error,
    loading,
  };
};

export const useUpdateVendor = (id: string, orderByOverride?: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  return useMutation<Mutation>(VENDOR_UPDATE, {
    refetchQueries: [
      {
        query: VENDOR_DETAILS_QUERY,
        variables: { id, orderBy: orderByOverride || orderBy },
      },
    ],
  });
};
