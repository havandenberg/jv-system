import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { useUserContext } from 'components/user/context';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const CONTACT_GROUP_DETAILS_QUERY = loader('./details.gql');
const CONTACT_GROUP_LIST_QUERY = loader('./list.gql');
const CONTACT_GROUP_UPDATE = loader('./update.gql');
const CONTACT_GROUP_CREATE = loader('./create.gql');
const CONTACT_GROUP_DELETE = loader('./delete.gql');
const ADD_CONTACTS_TO_GROUP = loader('./add-contacts.gql');
const REMOVE_CONTACTS_FROM_GROUP = loader('./remove-contacts.gql');

export const useContactGroups = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'groupName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  const [{ activeUserId }] = useUserContext();

  const { data, error, loading } = useQuery<Query>(CONTACT_GROUP_LIST_QUERY, {
    variables: {
      orderBy,
      search: getSearchArray(search),
      userId: activeUserId || 0,
    },
  });

  return {
    data: data ? data.contactGroups : undefined,
    error,
    loading,
  };
};

export const useContactGroup = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(
    CONTACT_GROUP_DETAILS_QUERY,
    {
      variables: { id, orderBy },
    },
  );
  return {
    data: data ? data.contactGroup : undefined,
    error,
    loading,
  };
};

export const useUpdateContactGroup = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  return useMutation<Mutation>(CONTACT_GROUP_UPDATE, {
    refetchQueries: [
      {
        query: CONTACT_GROUP_DETAILS_QUERY,
        variables: { id, orderBy },
      },
    ],
  });
};

export const useCreateContactGroup = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ activeUserId }] = useUserContext();

  return useMutation<Mutation>(CONTACT_GROUP_CREATE, {
    refetchQueries: [
      {
        query: CONTACT_GROUP_LIST_QUERY,
        variables: {
          orderBy: 'GROUP_NAME_ASC',
          search: getSearchArray(search),
          userId: activeUserId || 0,
        },
      },
    ],
  });
};

export const useDeleteContactGroup = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ activeUserId }] = useUserContext();

  return useMutation<Mutation>(CONTACT_GROUP_DELETE, {
    refetchQueries: [
      {
        query: CONTACT_GROUP_LIST_QUERY,
        variables: {
          orderBy: 'GROUP_NAME_ASC',
          search: getSearchArray(search),
          userId: activeUserId || 0,
        },
      },
    ],
  });
};

export const useAddContactsToGroup = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  return useMutation<Mutation>(ADD_CONTACTS_TO_GROUP, {
    refetchQueries: [
      {
        query: CONTACT_GROUP_DETAILS_QUERY,
        variables: { id, orderBy },
      },
    ],
  });
};

export const useRemoveContactsFromGroup = (id: string) => {
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  return useMutation<Mutation>(REMOVE_CONTACTS_FROM_GROUP, {
    refetchQueries: [
      {
        query: CONTACT_GROUP_DETAILS_QUERY,
        variables: { id, orderBy },
      },
    ],
  });
};
