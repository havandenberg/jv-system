import { useMutation, useQuery } from '@apollo/client';
import { add, endOfISOWeek, max, min, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';

import { formatDate } from 'components/date-range-picker';
import { useProgramsQueryParams } from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const SHIPPER_PROGRAM_LIST_QUERY = loader('./shipper/list.gql');
const SHIPPER_PROGRAM_UPSERT = loader('./shipper/bulk-upsert.gql');
const SHIPPER_PROGRAM_ENTRY_BULK_UPSERT = loader(
  './shipper/bulk-upsert-entry.gql',
);
const SHIPPER_PROGRAM_DELETE = loader('./shipper/delete.gql');
export const SHIPPER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/shipper/distinct-values.gql',
);
const CUSTOMER_PROGRAM_LIST_QUERY = loader('./customer/list.gql');
const CUSTOMER_PROGRAM_UPSERT = loader('./customer/bulk-upsert.gql');
const CUSTOMER_PROGRAM_ENTRY_BULK_UPSERT = loader(
  './customer/bulk-upsert-entry.gql',
);
const CUSTOMER_PROGRAM_DELETE = loader('./customer/delete.gql');
export const CUSTOMER_DISTINCT_VALUES_QUERY = loader(
  '../../../api/directory/customer/distinct-values.gql',
);
const ALLOCATIONS_UPSERT = loader('./allocations/upsert.gql');
const ALLOCATIONS_DELETE = loader('./allocations/delete.gql');

const useVariables = (
  weekCount: number,
  allocateStartDate?: Date,
  allocateEndDate?: Date,
) => {
  const [
    {
      commonSpeciesId,
      commonVarietyId,
      commonSizeId,
      commonPackTypeId,
      plu,
      coast = 'EC',
      shipperId,
      customerId,
      startDate: startDateQuery,
      endDate: endDateQuery,
    },
  ] = useProgramsQueryParams();

  const endDate = endDateQuery
    ? new Date(endDateQuery.replace(/-/g, '/'))
    : new Date();
  const startDate = startOfISOWeek(
    startDateQuery ? new Date(startDateQuery.replace(/-/g, '/')) : new Date(),
  );

  return {
    arrivalPort: coast,
    customerId: customerId || (weekCount === undefined ? null : undefined),
    shipperId: shipperId || (weekCount === undefined ? null : undefined),
    startDate: formatDate(min([allocateStartDate || startDate, startDate])),
    endDate: formatDate(
      max([
        allocateEndDate || endDate,
        endOfISOWeek(add(endDate, { weeks: weekCount || 0 })),
      ]),
    ),
    commonSpeciesId: commonSpeciesId || null,
    commonVarietyId: commonVarietyId || null,
    commonSizeId: commonSizeId || null,
    commonPackTypeId: commonPackTypeId || null,
    plu: plu || null,
    orderBy: ['PROGRAM_DATE_DESC'],
  };
};

export const useShipperPrograms = (
  weekCount: number,
  allocateStartDate: Date,
  allocateEndDate: Date,
) => {
  const variables = useVariables(weekCount, allocateStartDate, allocateEndDate);
  const { data, error, loading } = useQuery<Query>(SHIPPER_PROGRAM_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.shipperPrograms : undefined,
    error,
    loading,
  };
};

export const useUpsertShipperPrograms = () =>
  useMutation<Mutation>(SHIPPER_PROGRAM_UPSERT);

export const useUpsertShipperProgramEntries = (
  weekCount: number,
  allocateStartDate: Date,
  allocateEndDate: Date,
) => {
  const variables = useVariables(weekCount, allocateStartDate, allocateEndDate);
  return useMutation<Mutation>(SHIPPER_PROGRAM_ENTRY_BULK_UPSERT, {
    refetchQueries: [
      {
        query: SHIPPER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useDeleteShipperPrograms = () =>
  useMutation<Mutation>(SHIPPER_PROGRAM_DELETE);

export const useCustomerPrograms = (
  weekCount: number,
  allocateStartDate: Date,
  allocateEndDate: Date,
) => {
  const variables = useVariables(weekCount, allocateStartDate, allocateEndDate);
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

export const useUpsertCustomerPrograms = () =>
  useMutation<Mutation>(CUSTOMER_PROGRAM_UPSERT);

export const useUpsertCustomerProgramEntries = (
  weekCount: number,
  allocateStartDate: Date,
  allocateEndDate: Date,
) => {
  const variables = useVariables(weekCount, allocateStartDate, allocateEndDate);
  return useMutation<Mutation>(CUSTOMER_PROGRAM_ENTRY_BULK_UPSERT, {
    refetchQueries: [
      {
        query: CUSTOMER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useDeleteCustomerPrograms = () =>
  useMutation<Mutation>(CUSTOMER_PROGRAM_DELETE);

export const useBulkUpsertAllocations = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(ALLOCATIONS_UPSERT, {
    refetchQueries: [
      {
        query: CUSTOMER_PROGRAM_LIST_QUERY,
        variables,
      },
      {
        query: SHIPPER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useBulkDeleteAllocations = (weekCount: number) => {
  const variables = useVariables(weekCount);
  return useMutation<Mutation>(ALLOCATIONS_DELETE, {
    refetchQueries: [
      {
        query: CUSTOMER_PROGRAM_LIST_QUERY,
        variables,
      },
      {
        query: SHIPPER_PROGRAM_LIST_QUERY,
        variables,
      },
    ],
  });
};
