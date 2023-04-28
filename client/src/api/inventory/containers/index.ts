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
import { Mutation, Query } from 'types';

const VESSEL_UPDATE_QUERY = loader('../vessels/update.gql');
const CONTAINER_DETAILS_QUERY = loader('./details.gql');
const CONTAINER_LIST_QUERY = loader('./list.gql');
const CONTAINER_CREATE_QUERY = loader('./create.gql');
const CONTAINER_UPDATE_QUERY = loader('./update.gql');
const CONTAINER_DELETE_QUERY = loader('./delete.gql');
const CONTAINER_SCHEDULE_UPDATE_NOTIFY = loader('./notify.gql');

const useVariables = (isSchedule: boolean, orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam('containerSearch');
  const [{ sortBy = 'dischargeDate', sortOrder = SORT_ORDER.DESC }] =
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
    isSchedule: isSchedule ? [true] : [true, false],
    isVesselAvailable: isSchedule ? [false] : [true, false],
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    dateFilter: isSchedule
      ? undefined
      : {
          greaterThanOrEqualTo: formattedStartDate,
          lessThanOrEqualTo: formattedEndDate,
        },
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useContainers = (
  isSchedule: boolean,
  orderByOverride?: string,
) => {
  const variables = useVariables(isSchedule, orderByOverride);

  const { data, error, loading } = useQuery<Query>(CONTAINER_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.containers : undefined,
    error,
    loading,
  };
};

export const useContainer = (containerIds: string[]) => {
  const { data, error, loading } = useQuery<Query>(CONTAINER_DETAILS_QUERY, {
    variables: {
      containerIds,
    },
  });
  return {
    data: data ? data.containers : undefined,
    error,
    loading,
  };
};

export const useCreateContainer = () => {
  const variables = useVariables(false, 'DISCHARGE_DATE_DESC');

  return useMutation<Mutation>(CONTAINER_CREATE_QUERY, {
    refetchQueries: [
      {
        query: CONTAINER_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateContainer = (
  containerIds: string[],
  isSchedule: boolean,
  orderByOverride?: string,
) =>
  useMutation<Mutation>(CONTAINER_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: CONTAINER_DETAILS_QUERY,
        variables: { containerIds },
      },
      {
        query: CONTAINER_LIST_QUERY,
        variables: useVariables(isSchedule, orderByOverride),
      },
    ],
  });

export const useContainerScheduleUpdateVessel = () =>
  useMutation<Mutation>(VESSEL_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: CONTAINER_LIST_QUERY,
        variables: useVariables(true),
      },
    ],
  });

export const useDeleteContainer = () => {
  const variables = useVariables(false);

  return useMutation<Mutation>(CONTAINER_DELETE_QUERY, {
    refetchQueries: [
      {
        query: CONTAINER_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useContainerScheduleUpdateNotify = () =>
  useMutation<Mutation>(CONTAINER_SCHEDULE_UPDATE_NOTIFY);
