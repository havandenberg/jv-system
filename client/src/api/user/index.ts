import { useMutation, useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { Mutation, Query } from 'types';

const USER_LIST_QUERY = loader('./list.gql');
const USER_DETAILS_QUERY = loader('./details.gql');
const USER_UPDATE_QUERY = loader('./update.gql');
const USER_MESSAGES_CREATE = loader('./message/create.gql');
const USER_MESSAGE_UPDATE = loader('./message/update.gql');

export const useGetUserAuthList = () => {
  const { data, error, loading, refetch } = useQuery<Query>(USER_LIST_QUERY);

  return {
    data: data ? data.users : undefined,
    error,
    loading,
    refetch,
  };
};

export const useGetUser = (id: number, showReadMessages: boolean = false) => {
  const { data, error, loading, refetch } = useQuery<Query>(
    USER_DETAILS_QUERY,
    {
      variables: { id, isRead: showReadMessages ? [true, false] : [false] },
    },
  );

  return {
    data: data ? data.user : undefined,
    error,
    loading,
    refetch,
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

export const useCreateUserMessages = () =>
  useMutation<Mutation>(USER_MESSAGES_CREATE);

export const useUpdateUserMessage = (
  id: number,
  showReadMessages: boolean = false,
) =>
  useMutation<Mutation>(USER_MESSAGE_UPDATE, {
    refetchQueries: [
      {
        query: USER_DETAILS_QUERY,
        variables: { id, isRead: showReadMessages ? [true, false] : [false] },
      },
    ],
  });
