import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString } from 'api/utils';
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

export const usePsaArrivalInspections = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'reportDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [
    {
      startDate = formatDate(add(new Date(), { days: -30 })),
      endDate = formatDate(new Date()),
    },
  ] = useDateRangeQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const [{ exporterName, arrivalName, locationName }] = useQuerySet({
    exporterName: StringParam,
    arrivalName: StringParam,
    locationName: StringParam,
  });

  const filteredExporterValues = useFilteredQueryValues(exporterName, {
    columnName: 'exporter_name',
    tableName: 'psa_arrival_report',
    schemaName: 'inspection',
  });

  const filteredLocationValues = useFilteredQueryValues(locationName, {
    columnName: 'location_name',
    tableName: 'psa_arrival_report',
    schemaName: 'inspection',
  });

  const filteredVesselValues = useFilteredQueryValues(arrivalName, {
    columnName: 'arrival_name',
    tableName: 'psa_arrival_report',
    schemaName: 'inspection',
  });

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      exporterName: filteredExporterValues,
      locationName: filteredLocationValues,
      orderBy,
      search,
      startDate,
      arrivalName: filteredVesselValues,
    },
  });

  return {
    data: data ? data.psaArrivalReports : undefined,
    error,
    loading,
  };
};

export const usePsaArrivalInspection = (id: string) => {
  const { data, error, loading } = useQuery<Query>(INSPECTION_DETAILS_QUERY, {
    variables: { id },
  });
  return {
    data: data ? data.psaArrivalReport : undefined,
    error,
    loading,
  };
};
