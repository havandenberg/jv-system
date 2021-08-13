import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { Mutation, Query } from 'types';

const USER_LIST_QUERY = loader('./list.gql');
const USER_UPDATE_QUERY = loader('./update.gql');

export const useGetUsers = () => {
  const { data, error, loading } = useQuery<Query>(USER_LIST_QUERY);

  return {
    data: data ? data.users : undefined,
    error,
    loading,
  };
};

export const useUpdateUser = (id: string) =>
  useMutation<Mutation>(USER_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: USER_LIST_QUERY,
        variables: { id },
      },
    ],
  });
