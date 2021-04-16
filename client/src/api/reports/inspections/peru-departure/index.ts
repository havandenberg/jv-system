import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { pathOr } from 'ramda';
import { StringParam } from 'use-query-params';

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
const DISTINCT_VALUES_QUERY = loader('../../../distinct-values.gql');

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

  const [{ exporter, variety }] = useQuerySet({
    exporter: StringParam,
    variety: StringParam,
  });
  const { data: exporterDefault } = useQuery<Query>(DISTINCT_VALUES_QUERY, {
    variables: {
      columnName: 'exporter',
      tableName: 'peru_departure_inspection',
    },
  });
  const exporterDefaultList: string[] = pathOr(
    [],
    ['distinctValues', 'nodes'],
    exporterDefault,
  );
  const filteredExporters = exporter
    ? exporter
        .split(',')
        .filter((val: string) =>
          exporterDefaultList.length > 0
            ? exporterDefaultList.includes(val)
            : false,
        )
    : [];

  const { data: varietyDefault } = useQuery<Query>(DISTINCT_VALUES_QUERY, {
    variables: {
      columnName: 'variety',
      tableName: 'peru_departure_inspection',
    },
  });
  const varietyDefaultList: string[] = pathOr(
    [],
    ['distinctValues', 'nodes'],
    varietyDefault,
  );
  const filteredVarieties = variety
    ? variety
        .split(',')
        .filter((val: string) =>
          varietyDefaultList.length > 0
            ? varietyDefaultList.includes(val)
            : false,
        )
    : [];

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      exporter:
        filteredExporters.length > 0 ? filteredExporters : exporterDefaultList,
      orderBy,
      search,
      startDate,
      variety:
        filteredVarieties.length > 0 ? filteredVarieties : varietyDefaultList,
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