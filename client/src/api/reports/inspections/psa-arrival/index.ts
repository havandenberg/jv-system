import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import useFilteredQueryValues from 'api/hooks/use-filtered-query-values';
import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useQuerySet,
  useQueryValue,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { Query } from 'types';

const INSPECTION_DETAILS_QUERY = loader('./details.gql');
const INSPECTION_DETAILS_COM_VAR_LIST_QUERY = loader(
  './details-com-var-list.gql',
);
const INSPECTION_DETAILS_PICTURES_QUERY = loader('./details-pictures.gql');
const INSPECTIONS_LIST_QUERY = loader('./list.gql');
const PALLET_LIST_QUERY = loader('./pallets.gql');
const PALLET_DETAILS_QUERY = loader('./pallet-details.gql');

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

  const [variety = ''] = useQueryValue('variety');

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
      search: getSearchArray(search),
      startDate,
      arrivalName: filteredVesselValues,
      variety,
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

export const usePsaArrivalInspectionComVarList = (id: string) => {
  const [{ commodity = '', variety = '' }] = useQuerySet({
    commodity: StringParam,
    variety: StringParam,
  });
  const { data, error, loading } = useQuery<Query>(
    INSPECTION_DETAILS_COM_VAR_LIST_QUERY,
    {
      variables: { id, commodity, variety },
    },
  );
  return {
    data: data ? data.psaArrivalReport : undefined,
    error,
    loading,
  };
};

export const usePsaArrivalInspectionPictures = (palletIds: string[]) => {
  const { data, error, loading } = useQuery<Query>(
    INSPECTION_DETAILS_PICTURES_QUERY,
    {
      variables: { palletIds },
    },
  );
  return {
    data: data ? data.psaArrivalPictures : undefined,
    error,
    loading,
  };
};

export const usePsaArrivalPallets = (arrival: string, exporterName: string) => {
  const [{ sortBy = 'palletId', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  const [variety = ''] = useQueryValue('variety');

  return useQuery<Query>(PALLET_LIST_QUERY, {
    variables: {
      arrival,
      exporterName,
      grapesOrderBy: orderBy,
      citrusOrderBy: orderBy,
      stoneFruitOrderBy: orderBy,
      pomegranatesOrderBy: orderBy,
      persimmonsOrderBy: orderBy,
      pearsOrderBy: orderBy,
      lemonsOrderBy: orderBy,
      cherriesOrderBy: orderBy,
      applesOrderBy: orderBy,
      variety,
    },
  });
};

export const usePsaArrivalPallet = (id: string) =>
  useQuery<Query>(PALLET_DETAILS_QUERY, {
    variables: { id },
  });
