import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { ArrayParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const INSPECTION_DETAILS_QUERY = loader('./details.gql');
const INSPECTIONS_LIST_QUERY = loader('./list.gql');

export const usePeruDepartureInspections = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'inspectionDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [
    {
      startDate = formatDate(add(new Date(), { years: -10 })),
      endDate = formatDate(new Date()),
    },
  ] = useDateRangeQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ exporter, variety }] = useQuerySet({
    exporter: ArrayParam,
    variety: ArrayParam,
  });

  const filteredExporterValues = useFilteredQueryValues(exporter, {
    columnName: 'exporter',
    tableName: 'peru_departure_inspection',
    schemaName: 'inspection',
  });

  const filteredVarietyValues = useFilteredQueryValues(variety, {
    columnName: 'variety',
    tableName: 'peru_departure_inspection',
    schemaName: 'inspection',
  });

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      exporter: filteredExporterValues,
      orderBy,
      search: getSearchArray(search),
      startDate,
      variety: filteredVarietyValues,
    },
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
