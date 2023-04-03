import { useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  usePsaInspectionQueryParams,
  useQuerySet,
  useSearchQueryParam,
  useSortQueryParams,
} from 'hooks/use-query-params';
import { PsaArrivalReport, Query } from 'types';

const INSPECTION_DETAILS_QUERY = loader('./details.gql');
const PSA_ARRIVAL_INSPECTION_DETAILS_BY_COM_VAR_QUERY = loader(
  './details-com-var.gql',
);
const INSPECTION_DETAILS_PICTURES_QUERY = loader('./details-pictures.gql');
const INSPECTIONS_LIST_QUERY = loader('./list.gql');
const PALLET_DETAILS_QUERY = loader('./pallet-details.gql');

export const usePsaArrivalInspections = () => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'reportDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const [{ coast, exporterName, arrivalCode }] = usePsaInspectionQueryParams();
  const [
    {
      startDate = formatDate(add(new Date(), { days: -30 })),
      endDate = formatDate(new Date()),
    },
  ] = useDateRangeQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);

  const { data, error, loading } = useQuery<Query>(INSPECTIONS_LIST_QUERY, {
    variables: {
      endDate,
      orderBy,
      search: getSearchArray(search),
      startDate,
    },
  });

  const inspections = (data?.psaArrivalReports?.nodes ||
    []) as PsaArrivalReport[];

  const vesselOptions: string[] = [];
  const shipperOptions: string[] = [];

  const filteredData = inspections.filter((inspection) => {
    const vesselOption = `${inspection.arrivalCode} - ${inspection.arrivalName}`;
    const isVesselValid = !arrivalCode || arrivalCode.includes(vesselOption);
    if (!vesselOptions.includes(vesselOption)) {
      vesselOptions.push(vesselOption);
    }

    const shipperOption = inspection.shipper
      ? `${inspection.shipper.shipperName} (${inspection.shipper.id})`
      : `${inspection.exporterId}`;
    const isShipperValid =
      !exporterName || exporterName.includes(shipperOption);
    if (!shipperOptions.includes(shipperOption)) {
      shipperOptions.push(shipperOption);
    }

    const isCoastValid =
      coast === 'EC'
        ? inspection.locationName === 'PSA-USEC'
        : inspection.locationName === 'PSA-USWC';

    const isValid = isVesselValid && isShipperValid && isCoastValid;

    return isValid;
  });

  return {
    data: filteredData,
    vesselOptions: vesselOptions.sort(),
    shipperOptions: shipperOptions.sort(),
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
