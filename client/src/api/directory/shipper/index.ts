import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

export const SHIPPER_DETAILS_QUERY = loader('./details.gql');
const SHIPPER_LIST_QUERY = loader('./list.gql');
const SHIPPER_UPDATE = loader('./update.gql');

export const useShippers = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'shipperName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ countryId }] = useQuerySet({
    countryId: StringParam,
  });

  const filteredCountryValues = useFilteredQueryValues(countryId, {
    columnName: 'country_id',
    tableName: 'shipper',
    schemaName: 'directory',
  });

  const { data, error, loading } = useQuery<Query>(SHIPPER_LIST_QUERY, {
    variables: {
      country: filteredCountryValues,
      orderBy: orderByOverride || orderBy,
      search: getSearchArray(search),
    },
  });

  return {
    data: data ? data.shippers : undefined,
    error,
    loading,
  };
};

export const useShipper = (id: string, orderByOverride?: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(SHIPPER_DETAILS_QUERY, {
    variables: {
      id,
      orderBy: orderByOverride || orderBy,
    },
  });
  return {
    data: data ? data.shipper : undefined,
    error,
    loading,
  };
};

export const useUpdateShipper = (id: string) => {
  return useMutation<Mutation>(SHIPPER_UPDATE, {
    refetchQueries: [
      {
        query: SHIPPER_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
};
