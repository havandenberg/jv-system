import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useOrdersQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const USER_DETAILS_QUERY = loader('../../user/details.gql');
const ORDER_MASTER_DETAILS_QUERY = loader('./details.gql');
const ORDER_MASTER_LIST_QUERY = loader('./list.gql');
const ORDER_ENTRY_DETAILS_QUERY = loader('./entry/details.gql');
const ORDER_ENTRY_LIST_QUERY = loader('./entry/list.gql');
const ORDER_ENTRY_CREATE = loader('./entry/create.gql');
const ORDER_ENTRY_UPDATE = loader('./entry/update.gql');
const LOAD_NUMBERS_UPSERT = loader('./load-numbers/upsert.gql');
const NEXT_ORDER_NUMBER_QUERY = loader('./load-numbers/next-order-number.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'orderDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ billingCustomerId, detailsIndex, salesUserCode }] =
    useOrdersQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? -8 : 0,
    }),
  );
  const formattedEndDate = formatDate(
    add(endDate ? new Date(endDate.replace(/-/g, '/')) : new Date(), {
      days: detailsIndex !== undefined ? 0 : startDate === endDate ? 1 : 0,
      weeks: detailsIndex !== undefined ? 4 : 0,
    }),
  );

  const filteredSalesUserCodeValues = useFilteredQueryValues(salesUserCode, {
    columnName: 'sales_user_code',
    tableName: 'order_master',
    schemaName: 'operations',
  });

  const filteredCustomerValues = useFilteredQueryValues(
    billingCustomerId,
    {},
    CUSTOMER_DISTINCT_VALUES_QUERY,
    'customerDistinctValues',
  );

  return {
    billingCustomerId: filteredCustomerValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    salesUserCode: filteredSalesUserCodeValues,
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useOrders = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(ORDER_MASTER_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.orderMasters : undefined,
    error,
    loading,
  };
};

export const useOrder = (orderId: string) => {
  const { data, error, loading } = useQuery<Query>(ORDER_MASTER_DETAILS_QUERY, {
    variables: {
      orderId,
    },
  });
  return {
    data: data ? data.orderMasters : undefined,
    error,
    loading,
  };
};

export const useOrderEntries = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(ORDER_ENTRY_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.orderEntries : undefined,
    error,
    loading,
  };
};

export const useOrderEntry = (orderId: string = '0') => {
  const { data, error, loading } = useQuery<Query>(ORDER_ENTRY_DETAILS_QUERY, {
    variables: {
      orderId,
    },
  });
  return {
    data: data ? data.orderEntries : undefined,
    error,
    loading,
  };
};

export const useCreateOrderEntry = (orderId: string) => {
  const variables = useVariables('ORDER_DATE_ASC');

  return useMutation<Mutation>(ORDER_ENTRY_CREATE, {
    refetchQueries: [
      {
        query: ORDER_ENTRY_LIST_QUERY,
        variables,
      },
      {
        query: ORDER_ENTRY_DETAILS_QUERY,
        variables: {
          orderId,
        },
      },
    ],
  });
};

export const useUpdateOrderEntry = (orderId: string) => {
  const variables = useVariables('ORDER_DATE_ASC');

  return useMutation<Mutation>(ORDER_ENTRY_UPDATE, {
    refetchQueries: [
      {
        query: ORDER_ENTRY_LIST_QUERY,
        variables,
      },
      {
        query: ORDER_ENTRY_DETAILS_QUERY,
        variables: {
          orderId,
        },
      },
    ],
  });
};

export const useUpsertLoadNumbers = (userId: number) =>
  useMutation<Mutation>(LOAD_NUMBERS_UPSERT, {
    refetchQueries: [
      {
        query: USER_DETAILS_QUERY,
        variables: { id: userId, isRead: [true, false] },
      },
    ],
  });

export const useNextOrderNumber = () => {
  const { data, error, loading } = useQuery<Query>(NEXT_ORDER_NUMBER_QUERY);
  return {
    data: data ? data.nextOrderNumber : undefined,
    error,
    loading,
  };
};
