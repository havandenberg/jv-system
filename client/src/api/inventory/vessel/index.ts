import { useMutation, useQuery } from '@apollo/client';
import { add, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';
import { equals } from 'ramda';
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
import { Mutation, Query } from 'types';

const VESSEL_DETAILS_QUERY = loader('./details.gql');
const VESSEL_LIST_BY_DEPARTURE_QUERY = loader('./departure-list.gql');
const VESSEL_LIST_BY_DISCHARGE_QUERY = loader('./discharge-list.gql');
const VESSEL_CREATE_QUERY = loader('./create.gql');
const VESSEL_UPDATE_QUERY = loader('./update.gql');
const VESSEL_DELETE_QUERY = loader('./delete.gql');
const LAST_PRE_VESSEL_CODE_QUERY = loader('./last-code.gql');
export const ARRIVAL_PORT_DISTINCT_VALUES_QUERY = loader(
  './arrival-port-distinct-values.gql',
);

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

  const [{ countryId, arrivalPort, coast }] = useQuerySet({
    countryId: ArrayParam,
    arrivalPort: ArrayParam,
    coast: ArrayParam,
  });

  const filteredCountryIdValues = useFilteredQueryValues(countryId, {
    columnName: 'country_id',
    tableName: 'vessel',
    schemaName: 'product',
  });

  const filteredArrivalPortValues = useFilteredQueryValues(
    arrivalPort,
    {
      columnName: 'arrival_port',
      tableName: 'vessel',
      schemaName: 'product',
    },
    ARRIVAL_PORT_DISTINCT_VALUES_QUERY,
    'vesselArrivalPortDistinctValues',
  );
  const filteredCoastValues = useFilteredQueryValues(coast, {
    columnName: 'coast',
    tableName: 'vessel',
    schemaName: 'product',
  });

  return {
    countryId: [...filteredCountryIdValues, ...(countryId ? [] : [''])],
    arrivalPort: filteredArrivalPortValues.map((val) =>
      val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
    ),
    coast: filteredCoastValues,
    orderBy: orderByOverride
      ? orderByOverride
      : isInventory
      ? defaultOrderBy
      : orderBy,
    search: getSearchArray(search),
    startDate: formatDate(
      isInventory
        ? startOfISOWeek(formattedStartDate || new Date())
        : startDate
        ? isProjections
          ? startOfISOWeek(add(formattedStartDate, { weeks: -1 }))
          : equals(startDate, endDate)
          ? add(formattedStartDate, { weeks: -4 })
          : formattedStartDate
        : search
        ? add(new Date(), { years: -1 })
        : new Date(),
    ),
    endDate: formatDate(
      isInventory
        ? add(startDate ? formattedStartDate : new Date(), { weeks: 5 })
        : endDate
        ? equals(startDate, endDate) || isProjections
          ? endOfISOWeek(add(formattedStartDate, { weeks: 4 }))
          : new Date(endDate.replace(/-/g, '/'))
        : add(new Date(), { years: 1 }),
    ),
  };
};

export const useVessels = (options?: VesselsOptions) => {
  const { isProjections } = options || {};
  const variables = useVariables(options);

  const { data, error, loading } = useQuery<Query>(
    isProjections
      ? VESSEL_LIST_BY_DEPARTURE_QUERY
      : VESSEL_LIST_BY_DISCHARGE_QUERY,
    {
      variables,
    },
  );

  return {
    data: data ? data.vessels : undefined,
    error,
    loading,
  };
};

export const useVessel = (vesselCode: string) => {
  const { data, error, loading } = useQuery<Query>(VESSEL_DETAILS_QUERY, {
    variables: {
      vesselCode,
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
