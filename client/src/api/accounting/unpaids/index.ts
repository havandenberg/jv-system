import {
  ApolloClient,
  NormalizedCacheObject,
  useMutation,
  useQuery,
} from '@apollo/client';
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

const UNPAIDS_UPDATE = loader('./update.gql');
const UNPAIDS_INVOICE_DETAILS_QUERY = loader('./invoice.gql');

export const useUnpaids = () => {
  const variables = useVariables(true);
  const [search = ''] = useSearchQueryParam('unpaidSearch');
  const [
    {
      invoiceId,
      loadId,
      salesUserCode,
      showLiq,
      status,
      vesselCode,
      customer,
      shipper,
    },
  ] = useUnpaidsQueryParams();

  const {
    data: vesselControlsData,
    loading,
    error,
    refetch,
  } = useQuery<Query>(VESSEL_CONTROL_LIST_QUERY, {
    variables,
  });

  const vesselControls = (vesselControlsData?.vesselControls?.nodes ||
    []) as VesselControl[];
  const searchArray = search?.split(' ');

  const vesselCodeOptions: string[] = [];
  const loadIdOptions: string[] = [];
  const invoiceIdOptions: string[] = [];
  const customerOptions: string[] = [];
  const shipperOptions: string[] = [];

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
            const isStatusValid =
              status === 'all' ||
              (status === 'urgent'
                ? !!unpaid?.isUrgent
                : status === 'alert'
                ? !!unpaid?.invoice?.flag
                : true);
            const isVesselCodeValid =
              !vesselCode || vesselCode.includes(rest.vessel?.vesselCode);
            const isLoadIdValid =
              !loadId || loadId.includes(unpaid?.invoice?.truckLoadId);
            const isInvoiceIdValid =
              !invoiceId || invoiceId.includes(unpaid?.invoice?.invoiceId);
            const customerOption = `${unpaid?.invoice?.billingCustomer?.customerName} (${unpaid?.invoice?.billingCustomer?.id})`;
            const isCustomerValid =
              !customer || customer.includes(customerOption);
            const shipperOption = `${rest.shipper?.shipperName} (${rest.shipper?.id})`;
            const isShipperValid = !shipper || shipper.includes(shipperOption);

            const isSalesUserValid =
              !salesUserCode ||
              salesUserCode === 'all' ||
              (salesUserCode === 'BS'
                ? ['BS', 'CP'].includes(unpaid?.invoice?.salesUserCode || 'x')
                : unpaid?.invoice?.salesUserCode === salesUserCode);

            const isValid =
              unpaid &&
              isSearchValid &&
              isLiqValid &&
              isStatusValid &&
              isVesselCodeValid &&
              isLoadIdValid &&
              isInvoiceIdValid &&
              isCustomerValid &&
              isShipperValid &&
              isSalesUserValid;

            if (unpaid && isLiqValid && isSalesUserValid) {
              if (!vesselCodeOptions.includes(`${rest.vessel?.vesselCode}`)) {
                vesselCodeOptions.push(`${rest.vessel?.vesselCode}`);
              }
              if (!loadIdOptions.includes(`${unpaid?.invoice?.truckLoadId}`)) {
                loadIdOptions.push(`${unpaid?.invoice?.truckLoadId}`);
              }
              if (!invoiceIdOptions.includes(`${unpaid?.invoice?.invoiceId}`)) {
                invoiceIdOptions.push(`${unpaid?.invoice?.invoiceId}`);
              }
              if (!customerOptions.includes(customerOption)) {
                customerOptions.push(customerOption);
              }
              if (!shipperOptions.includes(shipperOption)) {
                shipperOptions.push(shipperOption);
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
    customerOptions: customerOptions.sort(),
    shipperOptions: shipperOptions.sort(),
    error,
    loading,
    refetch,
  };
};

export const useUpdateUnpaid = () => useMutation<Mutation>(UNPAIDS_UPDATE);

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

export const getUnpaidInvoiceDetails = (
  gqlClient: ApolloClient<NormalizedCacheObject>,
  id: string,
) =>
  gqlClient.query({
    query: UNPAIDS_INVOICE_DETAILS_QUERY,
    variables: { id },
  });
