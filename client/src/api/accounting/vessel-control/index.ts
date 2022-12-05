import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { useVessels } from 'api/inventory/vessel';
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
import { Mutation, Query, Vessel, VesselControl } from 'types';

const VESSEL_CONTROL_LIST_QUERY = loader('./list.gql');
const VESSEL_CONTROLS_UPSERT = loader('./upsert.gql');
const UNPAIDS_NOTIFY = loader('./notify.gql');

const useVariables = (orderByOverride?: string) => {
  const [{ sortBy = 'id', sortOrder = SORT_ORDER.ASC }] = useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [vesselControlView] = useQueryValue('vesselControlView');
  const isDue = vesselControlView === 'due';

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? -2 : 0,
    }),
  );
  const formattedEndDate = formatDate(
    add(endDate ? new Date(endDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? 1 : 0,
    }),
  );

  const dateFilter = {
    and: {
      [isDue ? 'dueDate' : 'dateSent']: {
        greaterThanOrEqualTo: formattedStartDate,
        lessThanOrEqualTo: formattedEndDate,
      },
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
    loading: vesselControlsLoading,
    error: vesselControlsError,
  } = useQuery<Query>(VESSEL_CONTROL_LIST_QUERY, {
    variables,
  });
  const vesselControls = (
    vesselControlsData ? vesselControlsData.vesselControls?.nodes : []
  ) as VesselControl[];

  const {
    data: vesselsData,
    loading: vesselsLoading,
    error: vesselsError,
  } = useVessels({
    isVesselControl: true,
    orderByOverride: 'DISCHARGE_DATE_DESC',
  });
  const vessels = (vesselsData ? vesselsData.nodes : []) as Vessel[];

  const loading = vesselControlsLoading || vesselsLoading;
  const error = vesselControlsError || vesselsError;

  const data = buildVesselControlItems(
    vessels,
    vesselControls,
    search?.split(' '),
  ) as VesselControlItem[];

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
