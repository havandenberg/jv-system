import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const COMMON_CATEGORY_LIST_QUERY = loader('./categories/index.gql');
const COMMON_CATEGORY_CREATE_QUERY = loader('./categories/create.gql');
const COMMON_CATEGORY_UPDATE_QUERY = loader('./categories/update.gql');
const COMMON_SPECIES_LIST_QUERY = loader('./species/index.gql');
const COMMON_SPECIES_CREATE_QUERY = loader('./species/create.gql');
const COMMON_SPECIES_UPDATE_QUERY = loader('./species/update.gql');
const COMMON_VARIETY_QUERY = loader('./varieties/item.gql');
const COMMON_VARIETY_CREATE_QUERY = loader('./varieties/create.gql');
const COMMON_VARIETY_UPDATE_QUERY = loader('./varieties/update.gql');
const COMMON_SIZE_QUERY = loader('./sizes/item.gql');
const COMMON_SIZE_CREATE_QUERY = loader('./sizes/create.gql');
const COMMON_SIZE_UPDATE_QUERY = loader('./sizes/update.gql');
const COMMON_PACK_TYPE_QUERY = loader('./pack-types/item.gql');
const COMMON_PACK_TYPE_CREATE_QUERY = loader('./pack-types/create.gql');
const COMMON_PACK_TYPE_UPDATE_QUERY = loader('./pack-types/update.gql');

const useVariables = () => {
  const [search = ''] = useSearchQueryParam();

  const [{ sortBy, sortOrder = SORT_ORDER.ASC }] = useSortQueryParams();

  return {
    speciesOrderBy: getOrderByString(
      ['speciesName', 'uiColor'].includes(sortBy) ? sortBy : 'speciesName',
      sortOrder,
    ),
    sizesOrderBy: getOrderByString('sizeName', sortOrder),
    packTypesOrderBy: getOrderByString('packTypeName', sortOrder),
    varietiesOrderBy: getOrderByString('varietyName', sortOrder),
    search: getSearchArray(search),
  };
};

export const useCommonCategories = () => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_CATEGORY_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.commonCategories : undefined,
    error,
    loading,
  };
};

export const useCommonCategory = (id: string) => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_CATEGORY_LIST_QUERY, {
    variables: { ...variables, id },
  });

  return {
    data: data
      ? data.commonCategories?.nodes.find((species) => species?.id === id)
      : undefined,
    error,
    loading,
  };
};

export const useCreateCommonCategory = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_CATEGORY_CREATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_CATEGORY_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateCommonCategory = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_CATEGORY_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_CATEGORY_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useCommonSpecieses = () => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_SPECIES_LIST_QUERY, {
    variables,
  });

  return {
    data: data ? data.commonSpecieses : undefined,
    error,
    loading,
  };
};

export const useCommonSpecies = (id: string) => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_SPECIES_LIST_QUERY, {
    variables: { ...variables, id },
  });

  return {
    data: data
      ? data.commonSpecieses?.nodes.find((species) => species?.id === id)
      : undefined,
    error,
    loading,
  };
};

export const useCreateCommonSpecies = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_SPECIES_CREATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateCommonSpecies = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_SPECIES_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useCommonVariety = (id: string) => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_VARIETY_QUERY, {
    variables: { ...variables, id },
  });

  return {
    data: data ? data.commonVariety : undefined,
    error,
    loading,
  };
};

export const useCreateCommonVariety = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_VARIETY_CREATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateCommonVariety = (id: string) => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_VARIETY_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
      {
        query: COMMON_VARIETY_QUERY,
        variables: { ...variables, id },
      },
    ],
  });
};

export const useCommonSize = (id: string) => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_SIZE_QUERY, {
    variables: { ...variables, id },
  });

  return {
    data: data ? data.commonSize : undefined,
    error,
    loading,
  };
};

export const useCreateCommonSize = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_SIZE_CREATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateCommonSize = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_SIZE_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useCommonPackType = (id: string) => {
  const variables = useVariables();
  const { data, error, loading } = useQuery<Query>(COMMON_PACK_TYPE_QUERY, {
    variables: { ...variables, id },
  });

  return {
    data: data ? data.commonPackType : undefined,
    error,
    loading,
  };
};

export const useCreateCommonPackType = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_PACK_TYPE_CREATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateCommonPackType = () => {
  const variables = useVariables();
  return useMutation<Mutation>(COMMON_PACK_TYPE_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: COMMON_SPECIES_LIST_QUERY,
        variables,
      },
    ],
  });
};
