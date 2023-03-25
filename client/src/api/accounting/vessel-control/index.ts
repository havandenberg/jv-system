import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { vesselControlSearchText } from 'components/accounting/unpaids/data-utils';
import { formatDate } from 'components/date-range-picker';
import {
  useDateRangeQueryParams,
  useQueryValue,
  useSearchQueryParam,
  useVesselControlQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, VesselControl } from 'types';

export const VESSEL_CONTROL_DETAILS_QUERY = loader('./details.gql');
export const VESSEL_CONTROL_LIST_QUERY = loader('./list.gql');
const VESSEL_CONTROLS_UPSERT = loader('./upsert.gql');
const UNPAIDS_NOTIFY = loader('./notify.gql');

export const useVariables = (isUnpaids?: boolean) => {
  const [search] = useQueryValue('vesselControlSearch');
  const [vesselControlView] = useQueryValue('vesselControlView');
  const isDue = vesselControlView === 'due';

  const [{ startDate, endDate }] = useDateRangeQueryParams();
  const formattedStartDate = formatDate(
    startDate ? new Date(startDate.replace(/-/g, '/')) : new Date(),
  );
  const formattedEndDate = formatDate(
    endDate
      ? add(new Date(endDate.replace(/-/g, '/')), { days: isDue ? 0 : 1 })
      : new Date(),
  );

  return {
    vesselControlFilter:
      isUnpaids || search
        ? undefined
        : {
            [isDue ? 'dueDate' : 'dateSent']: {
              greaterThanOrEqualTo:
                startDate === endDate ? undefined : formattedStartDate,
              lessThanOrEqualTo: formattedEndDate,
            },
          },
    unpaidFilter: isUnpaids ? { isPaid: { equalTo: false } } : undefined,
  };
};

export const useVesselControls = () => {
  const [search = ''] = useSearchQueryParam('vesselControlSearch');
  const searchArray = search?.split(' ');
  const variables = useVariables();
  const [
    { vessel, shipper, arrivalLocation, liquidatedStatus, vesselControlView },
  ] = useVesselControlQueryParams();
  const isLiquidated = liquidatedStatus === 'liquidated';
  const isNotLiquidated = liquidatedStatus === 'unliquidated';
  const isDue = vesselControlView === 'due';

  const { data, loading, error } = useQuery<Query>(VESSEL_CONTROL_LIST_QUERY, {
    variables,
  });

  const vesselControls = (data?.vesselControls?.nodes || []) as VesselControl[];

  const vesselOptions: string[] = [];
  const shipperOptions: string[] = [];
  const arrivalOptions: string[] = [];

  const filteredData = vesselControls.filter((vc) => {
    const searchText = vesselControlSearchText(vc);
    const isSearchValid =
      !searchArray ||
      searchArray.every((searchVal) =>
        searchText.toLowerCase().includes(searchVal.toLowerCase()),
      );

    let isLiquidationStatusValid = true;
    if (isLiquidated) {
      isLiquidationStatusValid = !!vc.isLiquidated && (isDue || !!vc.id);
    } else if (isNotLiquidated) {
      isLiquidationStatusValid = !vc.isLiquidated && (isDue || !!vc.id);
    } else {
      isLiquidationStatusValid = isDue || !!vc.id;
    }

    const vesselOption = `${vc.vessel?.vesselCode} - ${vc.vessel?.vesselName}`;
    const isVesselCodeValid = !vessel || vessel.includes(vesselOption);
    if (!vesselOptions.includes(vesselOption)) {
      vesselOptions.push(vesselOption);
    }

    const shipperOption = `${vc.shipper?.shipperName} (${vc.shipper?.id})`;
    const isShipperValid = !shipper || shipper.includes(shipperOption);
    if (!shipperOptions.includes(shipperOption)) {
      shipperOptions.push(shipperOption);
    }

    const arrivalOption = `${vc.vessel?.warehouse?.warehouseName} (${vc.vessel?.warehouse?.id})`;
    const isArrivalLocationValid =
      !arrivalLocation || arrivalLocation.includes(arrivalOption);
    if (!arrivalOptions.includes(arrivalOption)) {
      arrivalOptions.push(arrivalOption);
    }

    const isValid =
      isVesselCodeValid &&
      isSearchValid &&
      isShipperValid &&
      isArrivalLocationValid &&
      isLiquidationStatusValid;

    return isValid;
  });

  return {
    data: filteredData,
    vesselOptions: vesselOptions.sort(),
    shipperOptions: shipperOptions.sort(),
    arrivalOptions: arrivalOptions.sort(),
    error,
    loading,
  };
};

export const useUpsertVesselControls = () =>
  useMutation<Mutation>(VESSEL_CONTROLS_UPSERT, {
    refetchQueries: [
      {
        query: VESSEL_CONTROL_LIST_QUERY,
        variables: useVariables(),
      },
    ],
  });

export const useSendUnpaidsNotification = () =>
  useMutation<Mutation>(UNPAIDS_NOTIFY);

export const useVesselControlDetails = (id: number) => {
  const { data, loading, error } = useQuery<Query>(
    VESSEL_CONTROL_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );
  return {
    data: data?.vesselControl,
    error,
    loading,
  };
};
