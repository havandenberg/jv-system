import { useQuery } from '@apollo/client';
import { add, startOfISOWeek } from 'date-fns';
import { loader } from 'graphql.macro';
import { StringParam } from 'use-query-params';

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

const VESSEL_DETAILS_QUERY = loader('./details.gql');
const VESSEL_LIST_QUERY = loader('./list.gql');
export const ARRIVAL_PORT_DISTINCT_VALUES_QUERY = loader(
  './arrival-port-distinct-values.gql',
);

export const useVessels = (isInventory?: boolean) => {
  const [search = ''] = useSearchQueryParam();
  const [{ sortBy = 'dischargeDate', sortOrder = SORT_ORDER.ASC }] =
    useSortQueryParams();
  const orderBy = getOrderByString(sortBy, sortOrder);
  const defaultOrderBy = getOrderByString('dischargeDate', SORT_ORDER.ASC);

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate =
    startDate && new Date(startDate.replace(/-/g, '/'));

  const [{ countryId, arrivalPort, coast }] = useQuerySet({
    countryId: StringParam,
    arrivalPort: StringParam,
    coast: StringParam,
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

  const { data, error, loading } = useQuery<Query>(VESSEL_LIST_QUERY, {
    variables: {
      countryId: filteredCountryIdValues,
      arrivalPort: filteredArrivalPortValues.map((val) =>
        val.substring(val.lastIndexOf(' (') + 2, val.length - 1),
      ),
      coast: filteredCoastValues,
      orderBy: isInventory ? defaultOrderBy : orderBy,
      search: getSearchArray(search),
      startDate: formatDate(
        isInventory
          ? startOfISOWeek(formattedStartDate || new Date())
          : startDate
          ? formattedStartDate
          : search
          ? add(new Date(), { years: -1 })
          : new Date(),
      ),
      endDate: formatDate(
        isInventory
          ? add(startDate ? formattedStartDate : new Date(), { weeks: 5 })
          : endDate
          ? new Date(endDate.replace(/-/g, '/'))
          : add(new Date(), { years: 1 }),
      ),
    },
  });

  return {
    data: data ? data.vessels : undefined,
    error,
    loading,
  };
};

export const useVessel = (id: string) => {
  const { data, error, loading } = useQuery<Query>(VESSEL_DETAILS_QUERY, {
    variables: {
      id,
    },
  });
  return {
    data: data ? data.vessel : undefined,
    error,
    loading,
  };
};
