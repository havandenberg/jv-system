import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { useVessels } from 'api/inventory/vessel';
import { getOrderByString } from 'api/utils';
import { buildUnpaidItems } from 'components/accounting/unpaids/data-utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQueryValue,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, Unpaid, Vessel } from 'types';

const UNPAID_LIST_QUERY = loader('./list.gql');
const UNPAIDS_UPSERT = loader('./upsert.gql');

const useVariables = (orderByOverride?: string) => {
  const [{ sortBy = 'isApproved', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

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

  return {
    orderBy: orderByOverride || orderBy,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useUnpaids = () => {
  const variables = useVariables();
  const [search = ''] = useSearchQueryParam('unpaidSearch');
  const [salesUserCode] = useQueryValue('salesUserCode');

  const {
    data: unpaidsData,
    loading: unpaidsLoading,
    error: unpaidsError,
  } = useQuery<Query>(UNPAID_LIST_QUERY, {
    variables,
  });
  const unpaids = (unpaidsData ? unpaidsData.unpaids?.nodes : []) as Unpaid[];

  const {
    data: vesselsData,
    loading: vesselsLoading,
    error: vesselsError,
  } = useVessels({
    isVesselControl: true,
    orderByOverride: 'DISCHARGE_DATE_DESC',
  });
  const vessels = (vesselsData ? vesselsData.nodes : []) as Vessel[];

  const loading = unpaidsLoading || vesselsLoading;
  const error = unpaidsError || vesselsError;

  const data = buildUnpaidItems(
    vessels,
    unpaids,
    salesUserCode,
    search?.split(' '),
  ) as Unpaid[];

  return {
    data: data.filter((up) => !up.vesselControl?.isLiquidated),
    error,
    loading,
  };
};

export const useUpsertUnpaids = (orderByOverride?: string) =>
  useMutation<Mutation>(UNPAIDS_UPSERT, {
    refetchQueries: [
      {
        query: UNPAID_LIST_QUERY,
        variables: useVariables(orderByOverride),
      },
    ],
  });
