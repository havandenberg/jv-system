import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const OFFICE_DETAILS_QUERY = loader('./details.gql');
const OFFICE_LIST_QUERY = loader('./list.gql');

export const useOffices = () => {
  const [search = ''] = useSearchQueryParam();
  const [
    { sortBy = 'officeName', sortOrder = SORT_ORDER.ASC },
  ] = useSortQueryParams();
  const orderBy = `${sortBy
    .replace(/([a-z])([A-Z])/, '$1_$2')
    .toUpperCase()}_${sortOrder}`;

  const { data, error, loading } = useQuery<Query>(OFFICE_LIST_QUERY, {
    variables: {
      orderBy,
      search,
    },
  });

  return {
    data: data ? data.offices : undefined,
    error,
    loading,
  };
};

export const useOffice = (id: string) => {
  const { data, error, loading } = useQuery<Query>(OFFICE_DETAILS_QUERY, {
    variables: { id },
  });
  return {
    data: data ? data.office : undefined,
    error,
    loading,
  };
};
