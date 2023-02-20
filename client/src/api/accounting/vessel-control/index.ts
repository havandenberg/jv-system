import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { getOrderByString } from 'api/utils';
import { vesselControlSearchText } from 'components/accounting/unpaids/data-utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQueryValue,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, VesselControl } from 'types';

export const VESSEL_CONTROL_DETAILS_QUERY = loader('./details.gql');
export const VESSEL_CONTROL_LIST_QUERY = loader('./list.gql');
const VESSEL_CONTROLS_UPSERT = loader('./upsert.gql');
const UNPAIDS_NOTIFY = loader('./notify.gql');

export const useVariables = (orderByOverride?: string, isUnpaids?: boolean) => {
  const [{ sortBy = 'id', sortOrder = SORT_ORDER.ASC }] = useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [vesselControlView] = useQueryValue('vesselControlView');
  const isDue = isUnpaids || vesselControlView === 'due';

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? -2 : 0,
    }),
  );
  const formattedEndDate = formatDate(
    add(
      endDate
        ? add(new Date(endDate.replace(/-/g, '/')), { days: isDue ? 0 : 1 })
        : new Date(),
      { days: isUnpaids ? 45 : 0 },
    ),
  );

  const dateFilter = {
    [isDue ? 'dueDate' : 'dateSent']: {
      greaterThanOrEqualTo: formattedStartDate,
      lessThanOrEqualTo: formattedEndDate,
    },
  };

  return {
    dateFilter,
    orderBy: orderByOverride || orderBy,
  };
};

export const useVesselControls = () => {
  const [search = ''] = useSearchQueryParam('vesselControlSearch');
  const searchArray = search?.split(' ');
  const variables = useVariables('ID_ASC');

  const { data, loading, error } = useQuery<Query>(VESSEL_CONTROL_LIST_QUERY, {
    variables,
  });

  const vesselControls = (data?.vesselControls?.nodes || []) as VesselControl[];

  const filteredData = vesselControls.filter((vc) => {
    const searchText = vesselControlSearchText(vc);

    const isSearchValid =
      !searchArray ||
      searchArray.every((searchVal) =>
        searchText.toLowerCase().includes(searchVal.toLowerCase()),
      );

    return isSearchValid;
  });

  return {
    data: filteredData,
    error,
    loading,
  };
};

export const useUpsertVesselControls = () =>
  useMutation<Mutation>(VESSEL_CONTROLS_UPSERT, {
    refetchQueries: [
      {
        query: VESSEL_CONTROL_LIST_QUERY,
        variables: useVariables('ID_ASC'),
      },
    ],
  });

export const useSendUnpaidsNotification = () =>
  useMutation<Mutation>(UNPAIDS_NOTIFY);

export const useVesselControlDetails = (id: number) => {
  const { data, loading, error } = useQuery<Query>(
    VESSEL_CONTROL_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );
  return {
    data: data?.vesselControl,
    error,
    loading,
  };
};
