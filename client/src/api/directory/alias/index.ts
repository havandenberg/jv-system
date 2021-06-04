import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';
import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { StringParam } from 'use-query-params';

const CONTACT_ALIAS_DETAILS_QUERY = loader('./details.gql');
const CONTACT_ALIAS_LIST_QUERY = loader('./list.gql');
const CONTACT_ALIAS_UPDATE = loader('./update.gql');

export const useContactAliases = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'aliasName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ aliasType }] = useQuerySet({
    aliasType: StringParam,
  });

  const filteredAliasTypeValues = useFilteredQueryValues(aliasType, {
    columnName: 'alias_type',
    tableName: 'contact_alias',
    schemaName: 'directory',
  });

  const { data, error, loading } = useQuery<Query>(CONTACT_ALIAS_LIST_QUERY, {
    variables: {
      aliasType: filteredAliasTypeValues,
      orderBy,
      search,
    },
  });

  return {
    data: data ? data.contactAliases : undefined,
    error,
    loading,
  };
};

export const useContactAlias = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    CONTACT_ALIAS_DETAILS_QUERY,
    {
      variables: { id },
    },
  );
  return {
    data: data ? data.contactAlias : undefined,
    error,
    loading,
  };
};

export const useUpdateContactAlias = (id: string) => {
  return useMutation<Mutation>(CONTACT_ALIAS_UPDATE, {
    refetchQueries: [
      {
        query: CONTACT_ALIAS_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
};
