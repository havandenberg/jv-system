import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import {
  getSortedUnpaids,
  vesselControlSearchText,
} from 'components/accounting/unpaids/data-utils';
import {
  useSearchQueryParam,
  useUnpaidsQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, Unpaid, VesselControl } from 'types';

import { useVariables, VESSEL_CONTROL_LIST_QUERY } from '../vessel-control';

const UNPAIDS_UPSERT = loader('./upsert.gql');
const UNPAIDS_INVOICE_DETAILS_QUERY = loader('./invoice.gql');

export const useUnpaids = () => {
  const variables = useVariables(true);
  const [search = ''] = useSearchQueryParam('unpaidSearch');
  const [{ invoiceId, loadId, salesUserCode, showLiq, vesselCode }] =
    useUnpaidsQueryParams();

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

  const vesselCodeOptions: string[] = [];
  const loadIdOptions: string[] = [];
  const invoiceIdOptions: string[] = [];

  const unpaids = getSortedUnpaids(
    vesselControls
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

            const isLiqValid = showLiq || !rest.isLiquidated;
            const isVesselCodeValid =
              !vesselCode || vesselCode.includes(rest.vessel?.vesselCode);
            const isLoadIdValid =
              !loadId || loadId.includes(unpaid?.invoice?.truckLoadId);
            const isInvoiceIdValid =
              !invoiceId || invoiceId.includes(unpaid?.invoice?.invoiceId);

            const isValid =
              unpaid &&
              isSearchValid &&
              isLiqValid &&
              isVesselCodeValid &&
              isLoadIdValid &&
              isInvoiceIdValid &&
              (!salesUserCode ||
                salesUserCode === 'all' ||
                unpaid.invoice?.salesUserCode === salesUserCode);

            if (isValid) {
              if (!vesselCodeOptions.includes(`${rest.vessel?.vesselCode}`)) {
                vesselCodeOptions.push(`${rest.vessel?.vesselCode}`);
              }
              if (!loadIdOptions.includes(`${unpaid?.invoice?.truckLoadId}`)) {
                loadIdOptions.push(`${unpaid?.invoice?.truckLoadId}`);
              }
              if (!invoiceIdOptions.includes(`${unpaid?.invoice?.invoiceId}`)) {
                invoiceIdOptions.push(`${unpaid?.invoice?.invoiceId}`);
              }
            }

            return isValid;
          })
          .map((up) => ({
            ...up,
            vessel: rest.vessel,
            shipper: rest.shipper,
            vesselControl: rest,
          })),
      )
      .flat() as Unpaid[],
    showLiq,
  );

  return {
    data: unpaids,
    vesselCodeOptions: vesselCodeOptions.sort(),
    loadIdOptions: loadIdOptions.sort(),
    invoiceIdOptions: invoiceIdOptions.sort(),
    error,
    loading,
  };
};

export const useUpsertUnpaids = () =>
  useMutation<Mutation>(UNPAIDS_UPSERT, {
    refetchQueries: [
      {
        query: VESSEL_CONTROL_LIST_QUERY,
        variables: useVariables(true),
      },
    ],
  });

export const useUnpaidInvoiceDetails = (id: number) => {
  const { data, loading, error } = useQuery<Query>(
    UNPAIDS_INVOICE_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );
  return {
    data: data?.invoiceHeader,
    error,
    loading,
  };
};
