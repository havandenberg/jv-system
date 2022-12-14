import { useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { buildUnpaidItems } from 'components/accounting/unpaids/data-utils';
import { useQueryValue, useSearchQueryParam } from 'hooks/use-query-params';
import { Mutation, Query, Unpaid, VesselControl } from 'types';

import { useVariables, VESSEL_CONTROL_LIST_QUERY } from '../vessel-control';

const UNPAIDS_UPSERT = loader('./upsert.gql');

export const useUnpaids = () => {
  const variables = useVariables(undefined, true);
  const [search = ''] = useSearchQueryParam('unpaidSearch');
  const [salesUserCode] = useQueryValue('salesUserCode');

  const {
    data: vesselControlsData,
    loading,
    error,
  } = useQuery<Query>(VESSEL_CONTROL_LIST_QUERY, {
    variables,
  });

  const data = useMemo(
    () =>
      buildUnpaidItems(
        (vesselControlsData?.allVesselControls?.nodes || []) as VesselControl[],
        salesUserCode,
        search?.split(' '),
      ) as Unpaid[],
    [salesUserCode, search, vesselControlsData],
  );

  return {
    data: data,
    error,
    loading,
  };
};

export const useUpsertUnpaids = (orderByOverride?: string) =>
  useMutation<Mutation>(UNPAIDS_UPSERT, {
    refetchQueries: [
      {
        query: VESSEL_CONTROL_LIST_QUERY,
        variables: useVariables(orderByOverride, true),
      },
    ],
  });
