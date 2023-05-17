import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { vesselControlSearchText } from 'components/accounting/unpaids/data-utils';
import {
  useSearchQueryParam,
  useWireControlQueryParams,
} from 'hooks/use-query-params';
import { Query, VesselControl } from 'types';

export const WIRE_CONTROL_DETAILS_QUERY = loader('./details.gql');
export const WIRE_CONTROL_LIST_QUERY = loader('./list.gql');

export const useWireControls = () => {
  const [search = ''] = useSearchQueryParam('wireControlSearch');
  const searchArray = search?.split(' ');
  const [{ vessel, shipper, arrivalLocation, country, liquidatedStatus }] =
    useWireControlQueryParams();
  const isLiquidated = liquidatedStatus === 'liquidated';
  const isNotLiquidated = liquidatedStatus === 'unliquidated';

  const { data, loading, error, refetch } = useQuery<Query>(
    WIRE_CONTROL_LIST_QUERY,
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
      isLiquidationStatusValid = !!vc.isLiquidated && !!vc.id;
    } else if (isNotLiquidated) {
      isLiquidationStatusValid = !vc.isLiquidated && !!vc.id;
    } else {
      isLiquidationStatusValid = !!vc.id;
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
      isLiquidationStatusValid;

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

export const useWireControl = (id: number) => {
  const { data, loading, error } = useQuery<Query>(WIRE_CONTROL_DETAILS_QUERY, {
    variables: {
      id,
    },
  });
  return {
    data: data?.vesselControl,
    error,
    loading,
  };
};
