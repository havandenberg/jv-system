import { useMutation, useQuery } from '@apollo/client';
import { formatDate } from 'components/date-range-picker';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';

import { useQueryValue } from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const SHIPPER_PROJECTION_VESSEL_LIST_QUERY = loader('./list.gql');
const SHIPPER_PROJECTION_UPDATE_QUERY = loader('./update.gql');
const SHIPPER_PROJECTION_VESSEL_CREATE = loader('./create/vessel.gql');
const SHIPPER_PROJECTION_PRODUCT_CREATE = loader('./create/product.gql');
const SHIPPER_PROJECTION_ENTRY_CREATE = loader('./create/entry.gql');
const SHIPPER_PROJECTION_ENTRY_DELETE = loader('./delete/entry.gql');

const useVariables = () => {
  const [startDateQuery] = useQueryValue('startDate');
  const [shipperId = ''] = useQueryValue('shipperId');
  const [coast = 'EC'] = useQueryValue('coast');
  const startDate = startOfISOWeek(
    startDateQuery ? new Date(startDateQuery.replace(/-/g, '/')) : new Date(),
  );

  return {
    arrivalPort: coast === 'EC' ? 'USEC' : 'USWC',
    shipperId,
    startDate: formatDate(startDate),
    endDate: endOfISOWeek(add(startDate, { weeks: 5 })),
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

export const useUpdateShipperProjection = () => {
  const variables = useVariables();

  return useMutation<Mutation>(SHIPPER_PROJECTION_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
        variables,
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
        query: SHIPPER_PROJECTION_VESSEL_LIST_QUERY,
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
