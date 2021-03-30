import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const COMPANY_DETAILS_QUERY = loader('./details.gql');
const COMPANY_LIST_QUERY = loader('./list.gql');

export const useCompanies = (companyType: string) => {
  const [search = ''] = useSearchQueryParam();
  const [
    { sortBy = 'companyName', sortOrder = SORT_ORDER.DESC },
  ] = useSortQueryParams();
  const orderBy = `${sortBy
    .replace(/([a-z])([A-Z])/, '$1_$2')
    .toUpperCase()}_${sortOrder}`;

  const { data, error, loading } = useQuery<Query>(COMPANY_LIST_QUERY, {
    variables: {
      companyType,
      orderBy,
      search,
    },
  });

  return {
    data: data ? data.companies : undefined,
    error,
    loading,
  };
};

export const useCompany = (companyType: string, id: string) => {
  const { data, error, loading } = useQuery<Query>(COMPANY_DETAILS_QUERY, {
    variables: {
      companyType,
      id,
    },
  });
  return {
    data: data ? data.company : undefined,
    error,
    loading,
  };
};
