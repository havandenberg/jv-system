import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { getOrderByString } from 'api/utils';
import {
  buildVesselControlItems,
  VesselControlItem,
} from 'components/accounting/vessel-control/data-utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQueryValue,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, VesselControl } from 'types';

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
    endDate
      ? add(new Date(endDate.replace(/-/g, '/')), { days: isDue ? 0 : 1 })
      : new Date(),
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

export const useVesselControlItems = () => {
  const [search = ''] = useSearchQueryParam('vesselControlSearch');
  const variables = useVariables('ID_ASC');
  const [liquidatedStatus] = useQueryValue('liquidatedStatus');
  const isLiquidated = liquidatedStatus === 'liquidated';
  const isNotLiquidated = liquidatedStatus === 'unliquidated';
  const [vesselControlView] = useQueryValue('vesselControlView');
  const isDue = vesselControlView === 'due';

  const {
    data: vesselControlsData,
    loading,
    error,
  } = useQuery<Query>(VESSEL_CONTROL_LIST_QUERY, {
    variables,
  });

  const data = useMemo(
    () =>
      buildVesselControlItems(
        (vesselControlsData?.allVesselControls?.nodes || []) as VesselControl[],
        search?.split(' '),
      ) as VesselControlItem[],
    [search, vesselControlsData],
  );

  const filteredData = data.filter((vc) => {
    if (isLiquidated) {
      return vc.isLiquidated && (isDue || !!vc.id);
    }
    if (isNotLiquidated) {
      return !vc.isLiquidated && (isDue || !!vc.id);
    }
    return isDue || !!vc.id;
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
