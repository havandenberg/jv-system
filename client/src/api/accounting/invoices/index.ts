import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { ArrayParam } from 'use-query-params';

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
import { Query } from 'types';

const INVOICE_HEADER_DETAILS_QUERY = loader('./details.gql');
const INVOICE_HEADER_LIST_QUERY = loader('./list.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'invoiceDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
      weeks: startDate === endDate ? -1 : 0,
    }),
  );
  const formattedEndDate = formatDate(
    endDate ? new Date(endDate.replace(/-/g, '/')) : new Date(),
  );

  const [{ billingCustomerId, salesUserCode }] = useQuerySet({
    billingCustomerId: ArrayParam,
    salesUserCode: ArrayParam,
  });

  const filteredSalesUserCodeValues = useFilteredQueryValues(salesUserCode, {
    columnName: 'sales_user_code',
    tableName: 'invoice_header',
    schemaName: 'accounting',
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

export const useInvoices = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(INVOICE_HEADER_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.invoiceHeaders : undefined,
    error,
    loading,
  };
};

export const useInvoice = (orderId: string) => {
  const { data, error, loading } = useQuery<Query>(
    INVOICE_HEADER_DETAILS_QUERY,
    {
      variables: {
        orderId,
      },
    },
  );
  return {
    data: data ? data.invoiceHeaders : undefined,
    error,
    loading,
  };
};
