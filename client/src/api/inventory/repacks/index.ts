import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { WAREHOUSE_DISTINCT_VALUES_QUERY } from 'api/directory/warehouse';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useRepackQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const REPACK_HEADER_DETAILS_QUERY = loader('./details.gql');
const REPACK_HEADER_LIST_QUERY = loader('./list.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'repackDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ warehouseId }] = useRepackQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? -8 : 0,
    }),
  );
  const formattedEndDate = formatDate(
    add(endDate ? new Date(endDate.replace(/-/g, '/')) : new Date(), {
      days: startDate === endDate ? 1 : 0,
    }),
  );

  const filteredWarehouseValues = useFilteredQueryValues(
    warehouseId,
    {},
    WAREHOUSE_DISTINCT_VALUES_QUERY,
    'warehouseDistinctValues',
  );

  return {
    warehouseId: filteredWarehouseValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useRepacks = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(REPACK_HEADER_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.repackHeaders : undefined,
    error,
    loading,
  };
};

export const useRepack = (repackCode: string) => {
  const { data, error, loading } = useQuery<Query>(
    REPACK_HEADER_DETAILS_QUERY,
    {
      variables: {
        repackCode,
      },
    },
  );
  return {
    data: data ? data.repackHeaders : undefined,
    error,
    loading,
  };
};
