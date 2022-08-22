import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import { CUSTOMER_DISTINCT_VALUES_QUERY } from 'api/directory/customer';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const ORDER_MASTER_DETAILS_QUERY = loader('./details.gql');
const ORDER_MASTER_LIST_QUERY = loader('./list.gql');
const ORDER_ENTRY_LIST_QUERY = loader('./entry/list.gql');
const ORDER_ENTRY_CREATE_QUERY = loader('./entry/create.gql');

const useVariables = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'orderDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate =
    startDate &&
    formatDate(
      add(new Date(startDate.replace(/-/g, '/')), {
        weeks: startDate === endDate ? -8 : 0,
      }),
    );
  const formattedEndDate =
    endDate && formatDate(new Date(endDate.replace(/-/g, '/')));

  const [{ billingCustomerId, salesUserCode }] = useQuerySet({
    billingCustomerId: StringParam,
    salesUserCode: StringParam,
  });

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
    orderBy: orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useOrderMasters = () => {
  const variables = useVariables();

  const { data, error, loading } = useQuery<Query>(ORDER_MASTER_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.orderMasters : undefined,
    error,
    loading,
  };
};

export const useOrderMaster = (orderId: string) => {
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

export const useOrderEntries = () => {
  const variables = useVariables();

  const { data, error, loading } = useQuery<Query>(ORDER_ENTRY_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.orderEntries : undefined,
    error,
    loading,
  };
};

export const useCreateOrderEntry = () => {
  const variables = useVariables();

  return useMutation<Mutation>(ORDER_ENTRY_CREATE_QUERY, {
    refetchQueries: [
      {
        query: ORDER_ENTRY_LIST_QUERY,
        variables,
      },
    ],
  });
};
