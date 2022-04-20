import { useMutation, useQuery } from '@apollo/client';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';

import {
  SHIPPER_LIST_QUERY,
  useShippersVariables,
} from 'api/directory/shipper';
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
const SHIPPER_PROJECTION_VESSEL_INFO_LIST_QUERY = loader(
  './vessel-info-list.gql',
);
const SHIPPER_PROJECTION_PRODUCT_LIST_QUERY = loader('./product-list.gql');
const SHIPPER_PROJECTION_UPSERT = loader('./create/index.gql');
const BULK_CREATE_SHIPPER_PROJECTION_VESSEL = loader('./create/vessel.gql');
const SHIPPER_PROJECTION_VESSEL_INFO_CREATE = loader(
  './create/vessel-info.gql',
);
const SHIPPER_PROJECTION_PRODUCT_UPSERT = loader('./create/product.gql');
const SHIPPER_PROJECTION_ENTRY_DELETE = loader('./delete/entry.gql');
export const SHIPPER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/shipper/distinct-values.gql',
);

const useVariables = (isInventory?: boolean) => {
  const [endDateQuery] = useQueryValue('endDate');
  const [startDateQuery] = useQueryValue('startDate');
  const endDate = endDateQuery
    ? new Date(endDateQuery.replace(/-/g, '/'))
    : new Date();
  const startDate = startOfISOWeek(
    startDateQuery ? new Date(startDateQuery.replace(/-/g, '/')) : new Date(),
  );
  const [search = ''] = useSearchQueryParam();

  const [view = 'grid'] = useQueryValue('view');
  const isNotList = view !== 'list';
  const isGrid = view === 'grid';
  const [{ sortBy = 'submittedAt', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(
    isNotList ? 'shipperName' : sortBy,
    isNotList ? SORT_ORDER.ASC : sortOrder,
  );

  const [shipperId] = useQueryValue('shipperId');
  const parsedShipperId = shipperId
    ? shipperId.length === 5
      ? shipperId
      : shipperId.slice(-6, -1)
    : undefined;
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
    shipperId: isInventory
      ? undefined
      : isNotList
      ? parsedShipperId
      : filteredShipperValues.map((val) =>
          val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
        ),
    startDate: isGrid
      ? formatDate(startOfISOWeek(add(startDate, { weeks: -1 })))
      : formatDate(startOfISOWeek(add(startDate, { weeks: -4 }))),
    endDate:
      isNotList || isInventory
        ? formatDate(endOfISOWeek(add(endDate, { weeks: 4 })))
        : formatDate(add(endOfISOWeek(endDate), { days: 1 })),
    startDatetime: isGrid
      ? formatDate(startOfISOWeek(add(startDate, { weeks: -1 })))
      : formatDate(startOfISOWeek(add(startDate, { weeks: -4 }))),
    endDatetime:
      isNotList || isInventory
        ? formatDate(endOfISOWeek(add(endDate, { weeks: 4 })))
        : formatDate(add(endOfISOWeek(endDate), { days: 1 })),
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

export const useShipperProjectionVesselInfos = (isInventory?: boolean) => {
  const variables = useVariables(isInventory);
  const { data, error, loading } = useQuery<Query>(
    SHIPPER_PROJECTION_VESSEL_INFO_LIST_QUERY,
    {
      variables,
    },
  );

  return {
    data: data ? data.shipperProjectionVesselInfos : undefined,
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

export const useUpsertShipperProjection = () => {
  const variables = useVariables();
  const shipperVariables = useShippersVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_UPSERT, {
    refetchQueries: [
      {
        query: SHIPPER_LIST_QUERY,
        variables: { ...shipperVariables, orderBy: 'SHIPPER_NAME_ASC' },
      },
      {
        query: SHIPPER_PROJECTION_LIST_QUERY,
        variables: { ...variables, orderBy: 'SHIPPER_ID_DESC' },
      },
    ],
  });
};

export const useBulkCreateShipperProjectionVessels = () =>
  useMutation<Mutation>(BULK_CREATE_SHIPPER_PROJECTION_VESSEL);

export const useCreateShipperProjectionVesselInfo = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_VESSEL_INFO_CREATE, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_VESSEL_INFO_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpsertShipperProjectionProducts = () => {
  const variables = useVariables();
  return useMutation<Mutation>(SHIPPER_PROJECTION_PRODUCT_UPSERT, {
    refetchQueries: [
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
        query: SHIPPER_PROJECTION_VESSEL_INFO_LIST_QUERY,
        variables,
      },
    ],
  });
};
