import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { vesselControlSearchText } from 'components/accounting/unpaids/data-utils';
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

  const vesselControls = (vesselControlsData?.vesselControls?.nodes ||
    []) as VesselControl[];
  const searchArray = search?.split(' ');

  const unpaids = vesselControls
    .map(({ unpaids, ...rest }) =>
      unpaids?.nodes
        ?.filter((unpaid) => {
          const searchText = vesselControlSearchText({
            ...rest,
            unpaids: { ...unpaids, nodes: [unpaid] },
          });

          const isSearchValid =
            !searchArray ||
            searchArray.every((searchVal) =>
              searchText.toLowerCase().includes(searchVal.toLowerCase()),
            );

          return (
            isSearchValid &&
            (!salesUserCode ||
              salesUserCode === 'all' ||
              unpaid?.invoice?.salesUserCode === salesUserCode)
          );
        })
        .map((up) => ({ ...up, vessel: rest.vessel, shipper: rest.shipper })),
    )
    .flat() as Unpaid[];

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
