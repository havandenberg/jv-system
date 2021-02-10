import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { formatDate } from 'components/date-range-picker';
import {
  useDateRangeQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { SORT_ORDER } from 'hooks/use-sort';
import { Query } from 'types';

const INSPECTIONS_LIST_QUERY = loader('./queries/list.gql');
const INSPECTION_DETAILS_QUERY = loader('./queries/details.gql');

export const usePeruDepartureInspections = () => {
  const [search = ''] = useSearchQueryParam();
  const [
    { sortBy = 'inspectionDate', sortOrder = SORT_ORDER.DESC },
  ] = useSortQueryParams();
  const [
    {
      startDate = formatDate(add(new Date(), { years: -10 })),
      endDate = formatDate(new Date()),
    },
  ] = useDateRangeQueryParams();
  const orderBy = `${sortBy
    .replace(/([a-z])([A-Z])/, '$1_$2')
    .toUpperCase()}_${sortOrder}`;

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: { endDate, orderBy, search, startDate },
  });

  return {
    data: data ? data.peruDepartureInspections : undefined,
    error,
    loading,
  };
};

export const usePeruDepartureInspection = (id: string) => {
  const { data, error, loading } = useQuery<Query>(INSPECTION_DETAILS_QUERY, {
    variables: { id },
  });
  return {
    data: data ? data.peruDepartureInspections : undefined,
    error,
    loading,
  };
};
