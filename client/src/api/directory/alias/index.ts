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
const CONTACT_ALIAS_CREATE = loader('./create.gql');
const CONTACT_ALIAS_DELETE = loader('./delete.gql');
const ADD_CONTACTS_TO_ALIAS = loader('./add-contacts.gql');
const REMOVE_CONTACTS_FROM_ALIAS = loader('./remove-contacts.gql');

export const useContactAliases = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'aliasName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(CONTACT_ALIAS_LIST_QUERY, {
    variables: {
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
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(
    CONTACT_ALIAS_DETAILS_QUERY,
    {
      variables: { id, orderBy },
    },
  );
  return {
    data: data ? data.contactAlias : undefined,
    error,
    loading,
  };
};

export const useUpdateContactAlias = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  return useMutation<Mutation>(CONTACT_ALIAS_UPDATE, {
    refetchQueries: [
      {
        query: CONTACT_ALIAS_DETAILS_QUERY,
        variables: { id, orderBy },
      },
    ],
  });
};

export const useCreateContactAlias = () => {
  const [search = ''] = useSearchQueryParam();

  return useMutation<Mutation>(CONTACT_ALIAS_CREATE, {
    refetchQueries: [
      {
        query: CONTACT_ALIAS_LIST_QUERY,
        variables: {
          orderBy: 'ALIAS_NAME_ASC',
          search,
        },
      },
    ],
  });
};

export const useDeleteContactAlias = () => {
  const [search = ''] = useSearchQueryParam();

  const [{ aliasType }] = useQuerySet({
    aliasType: StringParam,
  });

  const filteredAliasTypeValues = useFilteredQueryValues(aliasType, {
    columnName: 'alias_type',
    tableName: 'contact_alias',
    schemaName: 'directory',
  });

  return useMutation<Mutation>(CONTACT_ALIAS_DELETE, {
    refetchQueries: [
      {
        query: CONTACT_ALIAS_LIST_QUERY,
        variables: {
          aliasType: filteredAliasTypeValues,
          orderBy: 'ALIAS_NAME_ASC',
          search,
        },
      },
    ],
  });
};

export const useAddContactsToAlias = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  return useMutation<Mutation>(ADD_CONTACTS_TO_ALIAS, {
    refetchQueries: [
      {
        query: CONTACT_ALIAS_DETAILS_QUERY,
        variables: { id, orderBy },
      },
    ],
  });
};

export const useRemoveContactsFromAlias = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  return useMutation<Mutation>(REMOVE_CONTACTS_FROM_ALIAS, {
    refetchQueries: [
      {
        query: CONTACT_ALIAS_DETAILS_QUERY,
        variables: { id, orderBy },
      },
    ],
  });
};
