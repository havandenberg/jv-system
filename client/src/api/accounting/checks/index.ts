import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useCheckQueryParams,
  useDateRangeQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { CheckHeader, Query } from 'types';

const CHECK_DETAILS_QUERY = loader('./details.gql');
const CHECK_LIST_QUERY = loader('./list.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'checkDate', sortOrder = SORT_ORDER.DESC }] =
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

export const useChecks = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);
  const [{ vendorId, checkStatus }] = useCheckQueryParams();

  const { data, error, loading } = useQuery<Query>(CHECK_LIST_QUERY, {
    variables,
  });

  const checks = (data?.checkHeaders?.nodes || []) as CheckHeader[];

  const vendorOptions: string[] = [];
  const statusOptions: string[] = [];

  const filteredData = checks.filter((check) => {
    const vendorOption = `${check.vendor?.vendorName} (${check.vendor?.id})`;
    const isVendorValid = !vendorId || vendorId.includes(vendorOption);
    if (!vendorOptions.includes(vendorOption)) {
      vendorOptions.push(vendorOption);
    }

    const statusOption = `${check.checkStatus}`;
    const isStatusValid = !checkStatus || checkStatus.includes(statusOption);
    if (!statusOptions.includes(statusOption)) {
      statusOptions.push(statusOption);
    }

    const isValid = isVendorValid && isStatusValid;

    return isValid;
  });

  return {
    data: filteredData,
    vendorOptions: vendorOptions.sort(),
    statusOptions: statusOptions.sort(),
    error,
    loading,
  };
};

export const useCheck = (checkNumber: string) => {
  const { data, error, loading } = useQuery<Query>(CHECK_DETAILS_QUERY, {
    variables: {
      checkNumber,
    },
  });
  return {
    data: data ? (data.checkHeaders?.nodes || [])[0] : undefined,
    error,
    loading,
  };
};
