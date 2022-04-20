import { useMutation, useQuery } from '@apollo/client';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';

import { formatDate } from 'components/date-range-picker';
import { useQueryValue } from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const SHIPPER_PROGRAM_LIST_QUERY = loader('./shipper/list.gql');
const SHIPPER_PROGRAM_UPSERT = loader('./shipper/bulk-upsert.gql');
const SHIPPER_PROGRAM_ENTRY_UPSERT = loader('./shipper/bulk-upsert-entry.gql');
const SHIPPER_PROGRAM_DELETE = loader('./shipper/delete.gql');
export const SHIPPER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/shipper/distinct-values.gql',
);
const CUSTOMER_PROGRAM_LIST_QUERY = loader('./customer/list.gql');
const CUSTOMER_PROGRAM_UPSERT = loader('./customer/bulk-upsert.gql');
const CUSTOMER_PROGRAM_ENTRY_UPSERT = loader(
  './customer/bulk-upsert-entry.gql',
);
const CUSTOMER_PROGRAM_DELETE = loader('./customer/delete.gql');
export const CUSTOMER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/customer/distinct-values.gql',
);

const useVariables = (weekCount: number) => {
  const [endDateQuery] = useQueryValue('endDate');
  const [startDateQuery] = useQueryValue('startDate');
  const endDate = endDateQuery
    ? new Date(endDateQuery.replace(/-/g, '/'))
    : new Date();
  const startDate = startOfISOWeek(
    startDateQuery ? new Date(startDateQuery.replace(/-/g, '/')) : new Date(),
  );

  const [shipperId] = useQueryValue('shipperId');
  const [customerId] = useQueryValue('customerId');
  const [coast = 'EC'] = useQueryValue('coast');

  return {
    arrivalPort: coast,
    customerId: customerId || undefined,
    shipperId: shipperId || undefined,
    startDate: formatDate(startDate),
    endDate: formatDate(endOfISOWeek(add(endDate, { weeks: weekCount }))),
  };
};

export const useShipperPrograms = (weekCount: number) => {
  const variables = useVariables(weekCount);
  const { data, error, loading } = useQuery<Query>(SHIPPER_PROGRAM_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.shipperPrograms : undefined,
    error,
    loading,
  };
};

export const useUpsertShipperPrograms = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(SHIPPER_PROGRAM_UPSERT, {
    refetchQueries: [
      {
        query: SHIPPER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpsertShipperProgramEntries = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(SHIPPER_PROGRAM_ENTRY_UPSERT, {
    refetchQueries: [
      {
        query: SHIPPER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useDeleteShipperProgram = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(SHIPPER_PROGRAM_DELETE, {
    refetchQueries: [
      {
        query: SHIPPER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useCustomerPrograms = (weekCount: number) => {
  const variables = useVariables(weekCount);
  const { data, error, loading } = useQuery<Query>(
    CUSTOMER_PROGRAM_LIST_QUERY,
    {
      variables,
    },
  );

  return {
    data: data ? data.customerPrograms : undefined,
    error,
    loading,
  };
};

export const useUpsertCustomerPrograms = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(CUSTOMER_PROGRAM_UPSERT, {
    refetchQueries: [
      {
        query: CUSTOMER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpsertCustomerProgramEntries = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(CUSTOMER_PROGRAM_ENTRY_UPSERT, {
    refetchQueries: [
      {
        query: CUSTOMER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useDeleteCustomerProgram = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(CUSTOMER_PROGRAM_DELETE, {
    refetchQueries: [
      {
        query: CUSTOMER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};
