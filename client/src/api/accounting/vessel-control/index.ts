import { useMutation, useQuery } from '@apollo/client';
import { add } from 'date-fns';
import { loader } from 'graphql.macro';

import { vesselControlSearchText } from 'components/accounting/unpaids/data-utils';
import { formatDate } from 'components/date-range-picker';
import {
  useDateRangeQueryParams,
  useQueryValue,
  useSearchQueryParam,
  useUnpaidsQueryParams,
  useVesselControlQueryParams,
} from 'hooks/use-query-params';
import { Mutation, Query, VesselControl } from 'types';

export const VESSEL_CONTROL_DETAILS_QUERY = loader('./details.gql');
export const VESSEL_CONTROL_LIST_QUERY = loader('./list.gql');
const VESSEL_CONTROLS_UPDATE = loader('./update.gql');
const UNPAIDS_NOTIFY = loader('./notify.gql');

export const useVariables = (isUnpaids?: boolean) => {
  const [search] = useQueryValue('vesselControlSearch');
  const [vesselControlView] = useQueryValue('vesselControlView');
  const [{ showLiq }] = useUnpaidsQueryParams();
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
      (isUnpaids && showLiq) || search
        ? undefined
        : isUnpaids
        ? { isLiquidated: { isNull: true } }
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
    {
      vessel,
      shipper,
      arrivalLocation,
      country,
      liquidatedStatus,
      inStatus,
      outStatus,
      vesselControlView,
    },
  ] = useVesselControlQueryParams();
  const isLiquidated = liquidatedStatus === 'liquidated';
  const isNotLiquidated = liquidatedStatus === 'unliquidated';
  const isIn = inStatus === 'checked';
  const isNotIn = inStatus === 'unchecked';
  const isOut = outStatus === 'checked';
  const isNotOut = outStatus === 'unchecked';
  const isDue = vesselControlView === 'due';

  const { data, loading, error, refetch } = useQuery<Query>(
    VESSEL_CONTROL_LIST_QUERY,
    {
      variables,
    },
  );

  const vesselControls = (data?.vesselControls?.nodes || []) as VesselControl[];

  const vesselOptions: string[] = [];
  const shipperOptions: string[] = [];
  const arrivalOptions: string[] = [];
  const countryOptions: string[] = [];

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

    let isInStatusValid = true;
    if (isIn) {
      isInStatusValid = !!vc.approval1;
    } else if (isNotIn) {
      isInStatusValid = !vc.approval1;
    }

    let isOutStatusValid = true;
    if (isOut) {
      isOutStatusValid = !!vc.approval2;
    } else if (isNotOut) {
      isOutStatusValid = !vc.approval2;
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

    const countryOption = vc.vessel?.country?.countryName || '';
    const isCountryValid = !country || country.includes(countryOption);
    if (!countryOptions.includes(countryOption)) {
      countryOptions.push(countryOption);
    }

    const isValid =
      isVesselCodeValid &&
      isSearchValid &&
      isShipperValid &&
      isArrivalLocationValid &&
      isCountryValid &&
      isLiquidationStatusValid &&
      isInStatusValid &&
      isOutStatusValid;

    return isValid;
  });

  return {
    data: filteredData,
    vesselOptions: vesselOptions.sort(),
    shipperOptions: shipperOptions.sort(),
    arrivalOptions: arrivalOptions.sort(),
    countryOptions: countryOptions.sort(),
    error,
    loading,
    refetch,
  };
};

export const useUpdateVesselControl = () =>
  useMutation<Mutation>(VESSEL_CONTROLS_UPDATE, {});

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
