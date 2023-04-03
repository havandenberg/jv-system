import { useMutation, useQuery } from '@apollo/client';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';
import { equals } from 'ramda';

import { getOrderByString, getSearchArray } from 'api/utils';
import { formatDate } from 'components/date-range-picker';
import { SORT_ORDER } from 'hooks/use-columns';
import {
  useDateRangeQueryParams,
  useSearchQueryParam,
  useSortQueryParams,
  useVesselsQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, Vessel } from 'types';

const VESSEL_DETAILS_QUERY = loader('./details.gql');
const VESSEL_LIST_BY_DEPARTURE_QUERY = loader('./departure-list.gql');
const VESSEL_LIST_BY_DISCHARGE_QUERY = loader('./discharge-list.gql');
const VESSEL_CREATE_QUERY = loader('./create.gql');
const VESSEL_UPDATE_QUERY = loader('./update.gql');
const VESSEL_DELETE_QUERY = loader('./delete.gql');
const LAST_PRE_VESSEL_CODE_QUERY = loader('./last-code.gql');

interface VesselsOptions {
  isInventory?: boolean;
  isProjections?: boolean;
  orderByOverride?: string;
}

const useVariables = (options?: VesselsOptions) => {
  const { isInventory, isProjections, orderByOverride } = options || {};

  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'dischargeDate', sortOrder = SORT_ORDER.DESC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  const defaultOrderBy = getOrderByString('dischargeDate', SORT_ORDER.DESC);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate =
    startDate && new Date(startDate.replace(/-/g, '/'));

  return {
    orderBy: orderByOverride
      ? orderByOverride
      : isInventory
      ? defaultOrderBy
      : orderBy,
    search: getSearchArray(search),
    startDate: formatDate(
      isInventory
        ? startOfISOWeek(formattedStartDate || new Date())
        : search
        ? add(new Date(), { years: -1 })
        : startDate
        ? isProjections
          ? startOfISOWeek(add(formattedStartDate, { weeks: -1 }))
          : equals(startDate, endDate)
          ? add(formattedStartDate, { weeks: -4 })
          : formattedStartDate
        : new Date(),
    ),
    endDate: formatDate(
      isInventory || isProjections
        ? add(startDate ? formattedStartDate : new Date(), { weeks: 5 })
        : endDate
        ? equals(startDate, endDate)
          ? endOfISOWeek(add(formattedStartDate, { weeks: 1 }))
          : new Date(endDate.replace(/-/g, '/'))
        : formattedStartDate || new Date(),
    ),
  };
};

export const useVessels = (options?: VesselsOptions) => {
  const { isInventory, isProjections } = options || {};
  const variables = useVariables(options);

  const [{ countryId, arrivalPort, coast, vesselCode }] =
    useVesselsQueryParams();

  const { data, error, loading } = useQuery<Query>(
    isProjections
      ? VESSEL_LIST_BY_DEPARTURE_QUERY
      : VESSEL_LIST_BY_DISCHARGE_QUERY,
    {
      variables,
    },
  );

  const vessels = (data?.vessels?.nodes || []) as Vessel[];

  const vesselCodeOptions: string[] = [];
  const countryIdOptions: string[] = [];
  const arrivalPortOptions: string[] = [];

  const filteredVessels = vessels.filter((vessel) => {
    const vesselCodeOption = `${vessel.vesselCode} - ${vessel.vesselName}`;
    const isVesselCodeValid =
      !vesselCode || vesselCode.includes(vesselCodeOption);
    if (!vesselCodeOptions.includes(vesselCodeOption)) {
      vesselCodeOptions.push(vesselCodeOption);
    }

    const arrivalPortOption = `${vessel.warehouse?.warehouseName} (${vessel.warehouse?.id})`;
    const isArrivalPortValid =
      !arrivalPort || arrivalPort.includes(arrivalPortOption);
    if (!arrivalPortOptions.includes(arrivalPortOption)) {
      arrivalPortOptions.push(arrivalPortOption);
    }

    const countryIdOption = vessel.country?.id || '';
    const isCountryValid = !countryId || countryId.includes(countryIdOption);
    if (!countryIdOptions.includes(countryIdOption)) {
      countryIdOptions.push(countryIdOption);
    }

    const isCoastValid = coast.includes(vessel.coast);

    const isValid =
      isVesselCodeValid && isArrivalPortValid && isCoastValid && isCountryValid;

    return isValid;
  });

  return {
    data: isInventory || isProjections ? vessels : filteredVessels,
    vesselCodeOptions: vesselCodeOptions.sort(),
    countryIdOptions: countryIdOptions.sort(),
    arrivalPortOptions: arrivalPortOptions.sort(),
    error,
    loading,
  };
};

export const useVessel = (vesselCode: string, isPre: boolean) => {
  const { data, error, loading } = useQuery<Query>(VESSEL_DETAILS_QUERY, {
    variables: {
      vesselCode,
      isPre,
    },
  });
  return {
    data: data ? data.vessels : undefined,
    error,
    loading,
  };
};

export const useCreateVessel = () => {
  const variables = useVariables();

  return useMutation<Mutation>(VESSEL_CREATE_QUERY, {
    refetchQueries: [
      {
        query: VESSEL_LIST_BY_DISCHARGE_QUERY,
        variables,
      },
    ],
  });
};

export const useUpdateVessel = (id: string) =>
  useMutation<Mutation>(VESSEL_UPDATE_QUERY, {
    refetchQueries: [
      {
        query: VESSEL_DETAILS_QUERY,
        variables: { id },
      },
    ],
  });

export const useDeleteVessel = () => {
  const variables = useVariables();

  return useMutation<Mutation>(VESSEL_DELETE_QUERY, {
    refetchQueries: [
      {
        query: VESSEL_LIST_BY_DISCHARGE_QUERY,
        variables,
      },
    ],
  });
};

export const useLastPreVesselCode = () => {
  const { data, error, loading } = useQuery<Query>(LAST_PRE_VESSEL_CODE_QUERY);
  return {
    data: data ? data.vessels?.nodes[0]?.preVesselCode : undefined,
    error,
    loading,
  };
};
