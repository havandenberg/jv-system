import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

export const PRODUCT_MASTER_DETAILS_QUERY = loader('./details.gql');
const PRODUCT_MASTER_LIST_QUERY = loader('./list.gql');
const PRODUCT_MASTER_UPDATE = loader('./update.gql');
export const PRODUCT_SPECIES_DETAILS_QUERY = loader('./species-details.gql');
export const PRODUCT_VARIETY_DETAILS_QUERY = loader('./variety-details.gql');
export const PRODUCT_SIZE_DETAILS_QUERY = loader('./size-details.gql');
export const PRODUCT_PACK_TYPE_DETAILS = loader('./pack-type-details.gql');

export const useProductMasters = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'id', sortOrder = SORT_ORDER.DESC }] = useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(PRODUCT_MASTER_LIST_QUERY, {
    variables: {
      orderBy,
      search: getSearchArray(search),
      last: 100,
    },
  });

  return {
    data: data ? data.productMasters : undefined,
    error,
    loading,
  };
};

export const useProductMaster = (id: string) => {
  const [{ sortBy = 'id', sortOrder = SORT_ORDER.DESC }] = useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(
    PRODUCT_MASTER_DETAILS_QUERY,
    {
      variables: {
        id,
        orderBy,
      },
    },
  );
  return {
    data: data ? data.productMaster : undefined,
    error,
    loading,
  };
};

export const useUpdateProductMaster = (id: string) => {
  return useMutation<Mutation>(PRODUCT_MASTER_UPDATE, {
    refetchQueries: [
      {
        query: PRODUCT_MASTER_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
};

export const useProductSpecies = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    PRODUCT_SPECIES_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );
  return {
    data: data ? data.productSpecies : undefined,
    error,
    loading,
  };
};

export const useProductVariety = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    PRODUCT_VARIETY_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );
  return {
    data: data ? data.productVariety : undefined,
    error,
    loading,
  };
};

export const useProductSize = (id: string) => {
  const { data, error, loading } = useQuery<Query>(PRODUCT_SIZE_DETAILS_QUERY, {
    variables: {
      id,
    },
  });
  return {
    data: data ? data.productSize : undefined,
    error,
    loading,
  };
};

export const useProductPackType = (id: string) => {
  const { data, error, loading } = useQuery<Query>(PRODUCT_PACK_TYPE_DETAILS, {
    variables: {
      id,
    },
  });
  return {
    data: data ? data.packMaster : undefined,
    error,
    loading,
  };
};
