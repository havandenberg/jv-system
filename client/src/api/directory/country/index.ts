import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

export const COUNTRY_LIST_QUERY = loader('./list.gql');

export const useCountries = (orderByOverride?: string) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'countryName', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(COUNTRY_LIST_QUERY, {
    variables: {
      orderBy: orderByOverride || orderBy,
      search: getSearchArray(search),
    },
  });

  return {
    data: data ? data.countries : undefined,
    error,
    loading,
  };
};
