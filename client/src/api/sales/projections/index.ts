import { useMutation, useQuery } from '@apollo/client';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';

import {
  useQueryValue,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const SHIPPER_PROJECTION_LIST_QUERY = loader('./list.gql');
const SHIPPER_PROJECTION_VESSEL_LIST_QUERY = loader('./vessel-list.gql');
const SHIPPER_PROJECTION_PRODUCT_LIST_QUERY = loader('./product-list.gql');
const SHIPPER_PROJECTION_UPDATE_QUERY = loader('./update.gql');
const SHIPPER_PROJECTION_UPSERT = loader('./create/index.gql');
const SHIPPER_PROJECTION_VESSEL_CREATE = loader('./create/vessel.gql');
const SHIPPER_PROJECTION_PRODUCT_CREATE = loader('./create/product.gql');
const SHIPPER_PROJECTION_ENTRY_CREATE = loader('./create/entry.gql');
const SHIPPER_PROJECTION_ENTRY_DELETE = loader('./delete/entry.gql');
export const SHIPPER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/shipper/distinct-values.gql',
);

const useVariables = () => {
  const [endDateQuery] = useQueryValue('endDate');
  const [startDateQuery] = useQueryValue('startDate');
  const endDate = endDateQuery
    ? new Date(endDateQuery.replace(/-/g, '/'))
    : new Date();
  const startDate = startOfISOWeek(
    startDateQuery ? new Date(startDateQuery.replace(/-/g, '/')) : new Date(),
  );
  const [search = ''] = useSearchQueryParam();

  const [view = 'list'] = useQueryValue('view');
  const isNotList = view !== 'list';
  const [{ sortBy = 'completedAt', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(
    isNotList ? 'shipperName' : sortBy,
    isNotList ? SORT_ORDER.ASC : sortOrder,
  );

  const [shipperId] = useQueryValue('shipperId');
  const [coast = 'EC'] = useQueryValue('coast');

  const filteredShipperValues = useFilteredQueryValues(
    shipperId || '',
    {
      columnName: 'id',
      tableName: 'shipper',
      schemaName: 'directory',
    },
    SHIPPER_DISTINCT_VALUES_QUERY,
    'shipperDistinctValues',
  );

  return {
    arrivalPort: coast,
    shipperId: isNotList
      ? shipperId
      : filteredShipperValues.map((val) =>
          val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
        ),
    startDate: isNotList
      ? formatDate(startDate)
      : formatDate(add(endDate, { weeks: -4 })),
    endDate: isNotList
      ? formatDate(endOfISOWeek(add(startDate, { weeks: 5 })))
      : formatDate(add(endDate, { days: 1, weeks: 4 })),
    orderBy,
    search: isNotList ? undefined : getSearchArray(search),
  };
};

export const useShipperProjections = () => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(
    SHIPPER_PROJECTION_LIST_QUERY,
    {
      variables,
    },
  );

  return {
    data: data ? data.shipperProjections : undefined,
    error,
    loading,
  };
};

export const useShipperProjectionVessels = () => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(
    SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
    {
      variables,
    },
  );

  return {
    data: data ? data.shipperProjectionVessels : undefined,
    error,
    loading,
  };
};

export const useShipperProjectionProducts = () => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(
    SHIPPER_PROJECTION_PRODUCT_LIST_QUERY,
    {
      variables,
    },
  );

  return {
    data: data ? data.shipperProjectionProducts : undefined,
    error,
    loading,
  };
};

export const useUpdateShipperProjection = () => {
  const variables = useVariables();

  return useMutation<Mutation>(SHIPPER_PROJECTION_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
        variables,
      },
      {
        query: SHIPPER_PROJECTION_PRODUCT_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpsertShipperProjection = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_UPSERT, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_LIST_QUERY,
        variables: { ...variables, orderBy: 'SHIPPER_ID_DESC' },
      },
    ],
  });
};

export const useCreateShipperProjectionVessel = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_VESSEL_CREATE, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useCreateShipperProjectionProducts = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_PRODUCT_CREATE, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_PRODUCT_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useCreateShipperProjectionEntry = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_ENTRY_CREATE, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
        variables,
      },
      {
        query: SHIPPER_PROJECTION_PRODUCT_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useDeleteShipperProjectionEntries = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_ENTRY_DELETE, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
        variables,
      },
    ],
  });
};
