import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const PERSON_CONTACT_DETAILS_QUERY = loader('./details.gql');
const PERSON_CONTACT_LIST_QUERY = loader('./list.gql');
const PERSON_CONTACT_UPDATE = loader('./update.gql');
const PERSON_CONTACT_CREATE = loader('./create.gql');
const PERSON_CONTACT_DELETE = loader('./delete.gql');

interface PersonContactVariables {
  isInternal?: boolean;
  customerId?: string;
  shipperId?: string;
  warehouseId?: string;
}

export const usePersonContacts = ({
  isInternal,
  customerId,
  shipperId,
  warehouseId,
}: PersonContactVariables) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(PERSON_CONTACT_LIST_QUERY, {
    variables: {
      isInternal,
      customerId,
      shipperId,
      warehouseId,
      orderBy,
      search,
    },
  });

  return {
    data: data ? data.personContacts : undefined,
    error,
    loading,
  };
};

export const usePersonContact = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    PERSON_CONTACT_DETAILS_QUERY,
    {
      variables: { id },
    },
  );
  return {
    data: data ? data.personContact : undefined,
    error,
    loading,
  };
};

export const useUpdatePersonContact = (id: string) => {
  return useMutation<Mutation>(PERSON_CONTACT_UPDATE, {
    refetchQueries: [
      {
        query: PERSON_CONTACT_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });
};

export const useCreatePersonContact = ({
  isInternal,
  customerId,
  shipperId,
  warehouseId,
}: PersonContactVariables) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  return useMutation<Mutation>(PERSON_CONTACT_CREATE, {
    refetchQueries: [
      {
        query: PERSON_CONTACT_LIST_QUERY,
        variables: {
          isInternal: isInternal ? true : undefined,
          customerId,
          shipperId,
          warehouseId,
          orderBy,
          search,
        },
      },
    ],
  });
};

export const useDeletePersonContact = ({
  isInternal,
  customerId,
  shipperId,
  warehouseId,
}: PersonContactVariables) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'firstName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  return useMutation<Mutation>(PERSON_CONTACT_DELETE, {
    refetchQueries: [
      {
        query: PERSON_CONTACT_LIST_QUERY,
        variables: {
          isInternal: isInternal ? true : undefined,
          customerId,
          shipperId,
          warehouseId,
          orderBy,
          search,
        },
      },
    ],
  });
};
