import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import { Query } from 'types';

const SALES_REPORT_INVENTORY_ITEMS_QUERY = loader('./inventory-items.gql');

export const useSalesReportItemsByVesselShipper = (
  vesselCode: string,
  shipperId: string,
) => {
  const { data, error, loading } = useQuery<Query>(
    SALES_REPORT_INVENTORY_ITEMS_QUERY,
    {
      variables: { vesselCode, shipperId },
    },
  );
  return {
    data: data ? data.inventoryItems : undefined,
    error,
    loading,
  };
};
