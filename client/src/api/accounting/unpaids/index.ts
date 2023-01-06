import { useMemo } from 'react';
import { pluck } from 'ramda';
import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import {
  buildVesselControlItems,
  VesselControlItem,
} from 'components/accounting/vessel-control/data-utils';
import { useQueryValue, useSearchQueryParam } from 'hooks/use-query-params';
import { Mutation, Query, VesselControl } from 'types';

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

  const vesselControls = useMemo(
    () =>
      buildVesselControlItems(
        (vesselControlsData?.allVesselControls?.nodes || []) as VesselControl[],
        search?.split(' '),
      ) as VesselControlItem[],
    [search, vesselControlsData],
  );

  const unpaids = vesselControls
    .map(({ groupedPallets }) =>
      Object.keys(groupedPallets)
        .map((suc) =>
          !salesUserCode || salesUserCode === 'all' || suc === salesUserCode
            ? pluck('unpaid', Object.values(groupedPallets[suc]))
            : [],
        )
        .flat(),
    )
    .flat();

  return {
    data: unpaids,
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
