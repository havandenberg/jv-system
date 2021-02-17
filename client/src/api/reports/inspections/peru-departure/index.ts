import { useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { pathOr } from 'ramda';
import { StringParam } from 'use-query-params';

import api from 'api';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query } from 'types';

const CREATE_PERU_DEPARTURE_INSPECTION = loader('./create.gql');
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
  const { data: varietyDefault } = useQuery<Query>(DISTINCT_VALUES_QUERY, {
    variables: {
      columnName: 'variety',
      tableName: 'peru_departure_inspection',
    },
  });

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      exporter: exporter
        ? exporter.split(',')
        : pathOr([], ['distinctValues', 'nodes'], exporterDefault),
      orderBy,
      search,
      startDate,
      variety: variety
        ? variety.split(',')
        : pathOr([], ['distinctValues', 'nodes'], varietyDefault),
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

export const useCreatePeruDepartureInspection = (input: any) =>
  useMutation<Mutation>(CREATE_PERU_DEPARTURE_INSPECTION, {
    variables: {
      input,
    },
  });

export const postPeruDepartureInspectionImages = (
  data: FormData,
  containerId: string,
) =>
  axios.post(`${api.baseURL}/peru-departure-inspections`, data, {
    headers: {
      'container-id': containerId,
    },
  });
