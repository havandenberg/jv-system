import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { Query } from 'types';

const USER_LIST_QUERY = loader('./list.gql');

export const useGetUsers = () => {
  const { data, error, loading } = useQuery<Query>(USER_LIST_QUERY);

  return {
    data: data ? data.users : undefined,
    error,
    loading,
  };
};
