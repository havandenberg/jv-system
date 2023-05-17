import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { ArrayParam, useQueryParam } from 'use-query-params';

import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, WireRequest } from 'types';

const WIRE_REQUEST_DETAILS_QUERY = loader('./details.gql');
const WIRE_REQUEST_LIST_QUERY = loader('./list.gql');
const WIRE_REQUEST_CREATE_QUERY = loader('./create.gql');
const WIRE_REQUEST_UPDATE_QUERY = loader('./update.gql');
const WIRE_REQUEST_DELETE_QUERY = loader('./delete.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'wireDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate =
    startDate === endDate
      ? new Date(new Date().getFullYear(), 0, 1)
      : formatDate(new Date(startDate.replace(/-/g, '/')));
  const formattedEndDate = formatDate(
    endDate ? new Date(endDate.replace(/-/g, '/')) : new Date(),
  );

  return {
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useWireRequests = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(WIRE_REQUEST_LIST_QUERY, {
    variables,
  });
  const [vendorId] = useQueryParam('vendorId', ArrayParam);
  const wires = (data?.wireRequests?.nodes || []) as WireRequest[];

  const vendorOptions: string[] = [];

  const filteredData = wires.filter((wire) => {
    const vendorOption = `${wire.vendor?.vendorName} (${wire.vendor?.id})`;
    const isVendorValid = !vendorId || vendorId.includes(vendorOption);
    if (!vendorOptions.includes(vendorOption)) {
      vendorOptions.push(vendorOption);
    }

    return isVendorValid;
  });

  return {
    data: filteredData,
    vendorOptions: vendorOptions.sort(),
    error,
    loading,
  };
};

export const useWireRequest = (id: string) => {
  const { data, error, loading } = useQuery<Query>(WIRE_REQUEST_DETAILS_QUERY, {
    variables: {
      id,
    },
  });
  return {
    data: data ? data.wireRequest : undefined,
    error,
    loading,
  };
};

export const useCreateWireRequest = () => {
  const variables = useVariables('REQUEST_DATE_DESC');

  return useMutation<Mutation>(WIRE_REQUEST_CREATE_QUERY, {
    refetchQueries: [
      {
        query: WIRE_REQUEST_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateWireRequest = (id: number) =>
  useMutation<Mutation>(WIRE_REQUEST_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: WIRE_REQUEST_DETAILS_QUERY,
        variables: { id },
      },
      {
        query: WIRE_REQUEST_LIST_QUERY,
        variables: useVariables('REQUEST_DATE_DESC'),
      },
    ],
  });

export const useDeleteWireTransfer = () => {
  const variables = useVariables('REQUEST_DATE_DESC');

  return useMutation<Mutation>(WIRE_REQUEST_DELETE_QUERY, {
    refetchQueries: [
      {
        query: WIRE_REQUEST_LIST_QUERY,
        variables,
      },
    ],
  });
};
