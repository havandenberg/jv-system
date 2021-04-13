import { useMutation, useQuery } from '@apollo/client';
import { add, startOfISOWeek, endOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';

import { useDateRangeQueryParams } from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const PRICE_ENTRIES_QUERY = loader('./entries.gql');
const PRICE_SHEET_UPDATE = loader('./update.gql');
const PRICE_CATEGORY_CREATE = loader('./create/category.gql');
const PRICE_PRODUCT_CREATE = loader('./create/product.gql');
const PRICE_SIZE_CREATE = loader('./create/size.gql');
const PRICE_ENTRY_CREATE = loader('./create/entry.gql');
const PRICE_CATEGORY_DELETE = loader('./delete/category.gql');
const PRICE_PRODUCT_DELETE = loader('./delete/product.gql');
const PRICE_SIZE_DELETE = loader('./delete/size.gql');

const useDateVariables = () => {
  const [{ startDate }] = useDateRangeQueryParams();
  return {
    startDate: startOfISOWeek(
      startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(),
    ),
    endDate: endOfISOWeek(
      add(startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(), {
        weeks: 5,
      }),
    ),
  };
};

export const usePriceCategories = () => {
  const variables = useDateVariables();
  const { data, error, loading } = useQuery<Query>(PRICE_ENTRIES_QUERY, {
    variables,
  });

  return {
    data: data ? data.priceCategories : undefined,
    error,
    loading,
  };
};

export const useUpdatePriceSheet = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_SHEET_UPDATE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useCreatePriceCategory = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_CATEGORY_CREATE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useCreatePriceProduct = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_PRODUCT_CREATE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useCreatePriceSize = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_SIZE_CREATE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useCreatePriceEntry = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_ENTRY_CREATE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useDeletePriceCategory = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_CATEGORY_DELETE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useDeletePriceProduct = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_PRODUCT_DELETE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};

export const useDeletePriceSize = () => {
  const variables = useDateVariables();
  return useMutation<Mutation>(PRICE_SIZE_DELETE, {
    refetchQueries: [
      {
        query: PRICE_ENTRIES_QUERY,
        variables,
      },
    ],
  });
};
