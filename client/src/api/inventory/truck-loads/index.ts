import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { WAREHOUSE_DISTINCT_VALUES_QUERY } from 'api/directory/warehouse';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
  useTruckLoadsQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';
import { VENDOR_DISTINCT_VALUES_QUERY } from 'api/directory/vendor';

const TRUCK_LOAD_DETAILS_QUERY = loader('./details.gql');
const TRUCK_LOAD_LIST_QUERY = loader('./list.gql');
const TRUCK_LOAD_CREATE_QUERY = loader('./create.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'shipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ warehouseId }] = useTruckLoadsQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate =
    startDate &&
    formatDate(
      add(new Date(startDate.replace(/-/g, '/')), {
        weeks: startDate === endDate ? -8 : 0,
      }),
    );
  const formattedEndDate =
    endDate && formatDate(new Date(endDate.replace(/-/g, '/')));

  const filteredWarehouseValues = useFilteredQueryValues(
    warehouseId,
    {},
    WAREHOUSE_DISTINCT_VALUES_QUERY,
    'warehouseDistinctValues',
  );

  const filteredVendorValues = useFilteredQueryValues(
    warehouseId,
    {},
    VENDOR_DISTINCT_VALUES_QUERY,
    'vendorDistinctValues',
  );

  return {
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    warehouseId: filteredWarehouseValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    vendorId: filteredVendorValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
  };
};

export const useTruckLoads = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(TRUCK_LOAD_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.truckLoads : undefined,
    error,
    loading,
  };
};

export const useTruckLoad = (truckLoadId: string) => {
  const { data, error, loading } = useQuery<Query>(TRUCK_LOAD_DETAILS_QUERY, {
    variables: {
      truckLoadId,
    },
  });
  return {
    data: data ? data.truckLoads : undefined,
    error,
    loading,
  };
};

export const useCreateTruckLoad = () => {
  const variables = useVariables();

  return useMutation<Mutation>(TRUCK_LOAD_CREATE_QUERY, {
    refetchQueries: [
      {
        query: TRUCK_LOAD_LIST_QUERY,
        variables,
      },
    ],
  });
};
export const useNextTruckLoadId = () => {
  // const { data, error, loading } = useQuery<Query>(NEXT_TRUCK_LOAD_ID_QUERY);
  return {
    // data: data ? data.vessels?.nodes[0]?.preVesselCode : undefined,
    // error,
    // loading,
    data: '12345',
    error: null,
    loading: false,
  };
};
