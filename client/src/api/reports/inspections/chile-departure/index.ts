import { useQuery } from '@apollo/client';
import { snakeCase } from 'change-case';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
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

export const useChileDepartureInspections = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'inspectionDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [
    {
      startDate = formatDate(add(new Date(), { years: -10 })),
      endDate = formatDate(new Date()),
    },
  ] = useDateRangeQueryParams();
  const orderBy = snakeCase(sortBy);

  const [{ shipper, variety }] = useQuerySet({
    shipper: StringParam,
    variety: StringParam,
  });

  const filteredExporterValues = useFilteredQueryValues(shipper, {
    columnName: 'shipper',
    tableName: 'chile_departure_inspection_pallet',
    schemaName: 'inspection',
  });

  const filteredVarietyValues = useFilteredQueryValues(variety, {
    columnName: 'variety',
    tableName: 'chile_departure_inspection_pallet',
    schemaName: 'inspection',
  });

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      exporter: filteredExporterValues,
      orderBy,
      sortOrder,
      search,
      startDate,
      variety: filteredVarietyValues,
    },
  });

  return {
    data: data ? data.chileDepartureInspections : undefined,
    error,
    loading,
  };
};

export const useChileDepartureInspection = (id: string) => {
  const { data, error, loading } = useQuery<Query>(INSPECTION_DETAILS_QUERY, {
    variables: { lotNumber: id },
  });
  const reportData = data && data.chileDepartureInspections?.nodes[0];
  const combinedData = data
    ? {
        ...reportData,
        pallets: data.chileDepartureInspectionPallets?.nodes || [],
      }
    : undefined;
  return {
    data: combinedData,
    error,
    loading,
  };
};
