import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { ArrayParam, StringParam } from 'use-query-params';

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
const PSA_ARRIVAL_INSPECTION_DETAILS_BY_COM_VAR_QUERY = loader(
  './details-com-var.gql',
);
const INSPECTION_DETAILS_PICTURES_QUERY = loader('./details-pictures.gql');
const INSPECTIONS_LIST_QUERY = loader('./list.gql');
const PALLET_DETAILS_QUERY = loader('./pallet-details.gql');
export const VESSEL_DISTINCT_VALUES_QUERY = loader(
  './vessel-distinct-values.gql',
);

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

  const [coast = ''] = useQueryValue('coast');
  const [variety = ''] = useQueryValue('variety');

  const [{ exporterName, arrivalName }] = useQuerySet({
    exporterName: ArrayParam,
    arrivalName: ArrayParam,
  });

  const filteredExporterValues = useFilteredQueryValues(exporterName, {
    columnName: 'exporter_name',
    tableName: 'psa_arrival_report',
    schemaName: 'inspection',
  });

  const filteredVesselValues = useFilteredQueryValues(
    arrivalName,
    {
      columnName: 'arrival_name',
      tableName: 'psa_arrival_report',
      schemaName: 'inspection',
    },
    VESSEL_DISTINCT_VALUES_QUERY,
    'psaInspectionVesselDistinctValues',
  );

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      exporterName: filteredExporterValues,
      locationName: coast === 'EC' ? 'PSA-USEC' : 'PSA-USWC',
      orderBy,
      search: getSearchArray(search),
      startDate,
      arrivalName: filteredVesselValues.map((val) =>
        val.substring(0, val.lastIndexOf(' (')),
      ),
      arrivalCode: filteredVesselValues.map((val) =>
        val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
      ),
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

export const usePsaArrivalInspectionComVar = (id: string) => {
  const [{ commodity = '', variety = '' }] = useQuerySet({
    commodity: StringParam,
    variety: StringParam,
  });
  const [{ sortBy = 'size', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  const { data, error, loading } = useQuery<Query>(
    PSA_ARRIVAL_INSPECTION_DETAILS_BY_COM_VAR_QUERY,
    {
      variables: {
        id,
        commodity,
        variety,
        grapesOrderBy: orderBy,
        citrusOrderBy: orderBy,
        stoneFruitOrderBy: orderBy,
        pomegranatesOrderBy: orderBy,
        persimmonsOrderBy: orderBy,
        pearsOrderBy: orderBy,
        lemonsOrderBy: orderBy,
        cherriesOrderBy: orderBy,
        applesOrderBy: orderBy,
      },
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

export const usePsaArrivalPallet = (id: string) =>
  useQuery<Query>(PALLET_DETAILS_QUERY, {
    variables: { id },
  });
