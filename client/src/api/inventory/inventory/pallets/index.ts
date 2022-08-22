import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { getOrderByString, getSearchArray } from 'api/utils';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const PALLET_DETAILS_QUERY = loader('./details.gql');
const PALLET_LIST_QUERY = loader('./list.gql');

export const usePallets = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'palletId', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(PALLET_LIST_QUERY, {
    variables: {
      orderBy,
      search: getSearchArray(search),
    },
  });

  return {
    data: data ? data.pallets : undefined,
    error,
    loading,
  };
};

export const usePallet = (id: string) => {
  const { data, error, loading } = useQuery<Query>(PALLET_DETAILS_QUERY, {
    variables: {
      id,
    },
  });
  return {
    data: data ? data.pallet : undefined,
    error,
    loading,
  };
};
