import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { VENDOR_DISTINCT_VALUES_QUERY } from 'api/directory/vendor';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSortQueryParams,
  useTruckLoadsQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const TRUCK_RATE_DETAILS_QUERY = loader('./details.gql');
const TRUCK_RATE_LIST_QUERY = loader('./list.gql');
const TRUCK_RATE_CREATE_QUERY = loader('./create.gql');
const TRUCK_RATE_UPDATE_QUERY = loader('./update.gql');

const useVariables = (orderByOverride?: string) => {
  const [{ sortBy = 'vendorId', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const [{ vendorId }] = useTruckLoadsQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const filteredVendorValues = useFilteredQueryValues(
    vendorId,
    { vendorType: 'FR' },
    VENDOR_DISTINCT_VALUES_QUERY,
    'vendorDistinctValues',
  );

  return {
    orderBy: orderByOverride || orderBy,
    vendorId: filteredVendorValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
  };
};

export const useTruckRates = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(TRUCK_RATE_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.truckRates : undefined,
    error,
    loading,
  };
};

export const useTruckRate = (id: string) => {
  const { data, error, loading } = useQuery<Query>(TRUCK_RATE_DETAILS_QUERY, {
    variables: {
      id,
    },
  });
  return {
    data: data ? data.truckRate : undefined,
    error,
    loading,
  };
};

export const useCreateTruckRate = () => {
  const variables = useVariables();

  return useMutation<Mutation>(TRUCK_RATE_CREATE_QUERY, {
    refetchQueries: [
      {
        query: TRUCK_RATE_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateTruckRate = (id: string) =>
  useMutation<Mutation>(TRUCK_RATE_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: TRUCK_RATE_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
