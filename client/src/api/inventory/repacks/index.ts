import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, RepackHeader } from 'types';

const REPACK_HEADER_DETAILS_QUERY = loader('./details.gql');
const REPACK_HEADER_LIST_QUERY = loader('./list.gql');
const REPACK_QUEUES_LIST_QUERY = loader('./queue/index.gql');
const NEW_REPACK_QUEUE_LIST_QUERY = loader('./queue/new-list.gql');
const REPACK_PACK_TYPE_LIST_QUERY = loader('./queue/pack-types.gql');
const REPACK_QUEUES_DELETE = loader('./queue/delete.gql');
const REPACK_QUEUES_UPSERT = loader('./queue/upsert.gql');

const useVariables = (isNullRepackDate: boolean, orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam('repackQueueSearch');
  const [{ sortBy = 'repackDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
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

  return {
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
  const repacks = (data?.repackHeaders?.nodes || []) as RepackHeader[];

  const vesselOptions: string[] = [];
  const shipperOptions: string[] = [];
  const warehouseOptions: string[] = [];
  const repackStyleOptions: string[] = [];

  repacks.forEach((repack) => {
    if (repack) {
      const { vessel, shipper, warehouse, repackStyle } = repack;

      const vesselOption = `${vessel?.vesselCode} - ${vessel?.vesselName}`;
      if (!vesselOptions.includes(vesselOption)) {
        vesselOptions.push(vesselOption);
      }

      const shipperOption = `${shipper?.shipperName} (${shipper?.id})`;
      if (!shipperOptions.includes(shipperOption)) {
        shipperOptions.push(shipperOption);
      }

      const warehouseOption = `${warehouse?.warehouseName} (${warehouse?.id})`;
      if (!warehouseOptions.includes(warehouseOption)) {
        warehouseOptions.push(warehouseOption);
      }

      const repackStyleOption = `${repackStyle?.styleDescription} (${repackStyle?.id})`;
      if (!repackStyleOptions.includes(repackStyleOption)) {
        repackStyleOptions.push(repackStyleOption);
      }
    }
  });

  return {
    data: data ? data.repackHeaders : undefined,
    vesselOptions: vesselOptions.sort(),
    shipperOptions: shipperOptions.sort(),
    warehouseOptions: warehouseOptions.sort(),
    repackStyleOptions: repackStyleOptions.sort(),
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
