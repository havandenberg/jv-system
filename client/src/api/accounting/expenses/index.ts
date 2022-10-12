import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getSearchArray } from 'api/utils';
import { useSearchQueryParam } from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const EXPENSE_HEADER_SUMMARY_QUERY = loader('./summary.gql');
const EXPENSE_HEADER_REVIEW_LIST_QUERY = loader('./reviews.gql');
const EXPENSE_HEADER_REVIEW_BULK_UPSERT = loader('./reviews-upsert.gql');
const EXPENSES_SUMMARY_VESSELS_QUERY = loader('./vessels.gql');

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

export const useExpensesSummary = (vesselCode: string, shipperId: string) => {
  const { data, error, loading } = useQuery<Query>(
    EXPENSE_HEADER_SUMMARY_QUERY,
    {
      variables: { vesselCode, shipperId },
    },
  );

  return {
    data: data ? data.expenseHeaderSummary : undefined,
    error,
    loading,
  };
};

export const useExpensesSummaryReviews = (expenseIds: string[]) => {
  const { data, error, loading } = useQuery<Query>(
    EXPENSE_HEADER_REVIEW_LIST_QUERY,
    {
      variables: { expenseHeaderIds: expenseIds },
    },
  );

  return {
    data: data ? data.expenseHeaderReviews : undefined,
    error,
    loading,
  };
};

export const useUpsertExpenseReviews = (expenseIds: string[]) =>
  useMutation<Mutation>(EXPENSE_HEADER_REVIEW_BULK_UPSERT, {
    refetchQueries: [
      {
        query: EXPENSE_HEADER_REVIEW_LIST_QUERY,
        variables: { expenseHeaderIds: expenseIds },
      },
    ],
    awaitRefetchQueries: true,
  });
