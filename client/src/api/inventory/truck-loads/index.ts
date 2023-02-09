import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { VENDOR_DISTINCT_VALUES_QUERY } from 'api/directory/vendor';
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
import { Query } from 'types';

const TRUCK_LOAD_DETAILS_QUERY = loader('./details.gql');
const TRUCK_LOAD_LIST_QUERY = loader('./list.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'shipDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ vendorId }] = useTruckLoadsQueryParams();
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

  const filteredVendorValues = useFilteredQueryValues(
    vendorId,
    { vendorType: 'FR' },
    VENDOR_DISTINCT_VALUES_QUERY,
    'vendorDistinctValues',
  );

  return {
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    vendorId: [
      '55555',
      ...filteredVendorValues.map((val) =>
        val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
      ),
    ],
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
