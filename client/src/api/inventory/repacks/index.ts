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
  useRepackQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const REPACK_HEADER_DETAILS_QUERY = loader('./details.gql');
const REPACK_HEADER_LIST_QUERY = loader('./list.gql');
const REPACK_QUEUES_LIST_QUERY = loader('./queue/index.gql');
const NEW_REPACK_QUEUE_LIST_QUERY = loader('./queue/new-list.gql');
const REPACK_PACK_TYPE_LIST_QUERY = loader('./queue/pack-types.gql');
const REPACK_QUEUES_DELETE = loader('./queue/delete.gql');
const REPACK_QUEUES_UPSERT = loader('./queue/upsert.gql');

export const REPACK_STYLE_DISTINCT_VALUES_QUERY = loader(
  './distinct-values.gql',
);

const useVariables = (isNullRepackDate: boolean, orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam('repackQueueSearch');
  const [{ sortBy = 'repackDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ repackStyleId, warehouseId }] = useRepackQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? -8 : 0,
    }),
  );
  const formattedEndDate = formatDate(
    add(endDate ? new Date(endDate.replace(/-/g, '/')) : new Date(), {
      months: 1,
    }),
  );

  const filteredWarehouseValues = useFilteredQueryValues(
    warehouseId,
    {},
    WAREHOUSE_DISTINCT_VALUES_QUERY,
    'warehouseDistinctValues',
  );

  const filteredRepackStyleValues = useFilteredQueryValues(
    repackStyleId,
    {},
    REPACK_STYLE_DISTINCT_VALUES_QUERY,
    'repackStyleDistinctValues',
  );

  return {
    repackStyleId: filteredRepackStyleValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    warehouseId: filteredWarehouseValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    repackDate: isNullRepackDate
      ? { isNull: true }
      : {
          greaterThanOrEqualTo: formattedStartDate,
          lessThanOrEqualTo: formattedEndDate,
        },
  };
};

export const useRepacks = (orderByOverride?: string) => {
  const variables = useVariables(false, orderByOverride);

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

export const useRepackCommonPackTypes = () => {
  const { data, error, loading } = useQuery<Query>(REPACK_PACK_TYPE_LIST_QUERY);

  return {
    data: data ? data.commonPackTypes : undefined,
    error,
    loading,
  };
};

export const useRepackQueues = (
  isNullRepackDate: boolean,
  orderByOverride?: string,
) => {
  const variables = useVariables(isNullRepackDate, orderByOverride);

  const { data, error, loading } = useQuery<Query>(REPACK_QUEUES_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.repackQueues : undefined,
    error,
    loading,
  };
};

export const useNewRepackQueues = () => {
  const { data, error, loading } = useQuery<Query>(NEW_REPACK_QUEUE_LIST_QUERY);

  return {
    data: data ? data.newRepackQueues : undefined,
    error,
    loading,
  };
};

export const useDeleteRepackQueues = () =>
  useMutation<Mutation>(REPACK_QUEUES_DELETE);

export const useUpsertRepackQueues = (orderByOverride?: string) =>
  useMutation<Mutation>(REPACK_QUEUES_UPSERT, {
    refetchQueries: [
      {
        query: REPACK_QUEUES_LIST_QUERY,
        variables: useVariables(true, orderByOverride),
      },
      {
        query: REPACK_QUEUES_LIST_QUERY,
        variables: useVariables(false, orderByOverride),
      },
    ],
  });
