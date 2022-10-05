import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { ArrayParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { VESSEL_DISTINCT_VALUES_QUERY } from 'api/inventory/vessel';
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

const EXPENSE_HEADER_DETAILS_QUERY = loader('./details.gql');
const EXPENSE_HEADER_LIST_QUERY = loader('./list.gql');
const EXPENSE_HEADER_SUMMARY_QUERY = loader('./summary.gql');

const EXPENSES_SUMMARY_VESSELS_QUERY = loader('./vessels.gql');

const useVariables = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'vesselDischargeDate', sortOrder = SORT_ORDER.ASC }] =
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

  const [{ expenseCode, vesselCode }] = useQuerySet({
    expenseCode: ArrayParam,
    vesselCode: ArrayParam,
  });

  const filteredExpenseCodeValues = useFilteredQueryValues(expenseCode, {
    columnName: 'expense_code',
    tableName: 'expense_header',
    schemaName: 'accounting',
  });

  const filteredVesselValues = useFilteredQueryValues(
    vesselCode,
    {},
    VESSEL_DISTINCT_VALUES_QUERY,
    'vesselDistinctValues',
  );

  return {
    expenseCode: filteredExpenseCodeValues,
    vesselCode: filteredVesselValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    orderBy: orderByOverride || orderBy,
    search: getSearchArray(search),
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  };
};

export const useExpenses = (orderByOverride?: string) => {
  const variables = useVariables(orderByOverride);

  const { data, error, loading } = useQuery<Query>(EXPENSE_HEADER_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.expenseHeaders : undefined,
    error,
    loading,
  };
};

export const useExpense = (orderId: string) => {
  const { data, error, loading } = useQuery<Query>(
    EXPENSE_HEADER_DETAILS_QUERY,
    {
      variables: {
        orderId,
      },
    },
  );
  return {
    data: data ? data.expenseHeaders : undefined,
    error,
    loading,
  };
};

export const useExpensesVessels = () => {
  const [vesselSearch = ''] = useSearchQueryParam('vesselSearch');
  const { data, error, loading } = useQuery<Query>(
    EXPENSES_SUMMARY_VESSELS_QUERY,
    {
      variables: {
        search: getSearchArray(vesselSearch),
      },
    },
  );

  return {
    data: data ? data.vessels : undefined,
    error,
    loading,
  };
};

export const useExpensesSummary = (vesselCode: string) => {
  const { data, error, loading } = useQuery<Query>(
    EXPENSE_HEADER_SUMMARY_QUERY,
    {
      variables: { vesselCode },
    },
  );

  return {
    data: data ? data.expenseHeaders : undefined,
    error,
    loading,
  };
};
