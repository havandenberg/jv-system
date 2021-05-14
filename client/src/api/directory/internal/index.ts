import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const INTERNAL_CONTACT_DETAILS_QUERY = loader('./details.gql');
const INTERNAL_CONTACT_LIST_QUERY = loader('./list.gql');

export const useInternalContacts = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'lastName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(
    INTERNAL_CONTACT_LIST_QUERY,
    {
      variables: {
        orderBy,
        search,
      },
    },
  );

  return {
    data: data ? data.personContacts : undefined,
    error,
    loading,
  };
};

export const useInternalContact = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    INTERNAL_CONTACT_DETAILS_QUERY,
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
