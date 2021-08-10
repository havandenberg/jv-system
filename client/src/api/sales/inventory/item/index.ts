import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { Query } from 'types';

const INVENTORY_ITEM_DETAILS_QUERY = loader('./details.gql');
const INVENTORY_ITEM_LIST_QUERY = loader('./list.gql');

export const useInventoryItems = () => {
  const { data, error, loading } = useQuery<Query>(INVENTORY_ITEM_LIST_QUERY);

  return {
    data: data ? data.inventoryItems : undefined,
    error,
    loading,
  };
};

export const useInventoryItem = (id: string) => {
  const { data, error, loading } = useQuery<Query>(
    INVENTORY_ITEM_DETAILS_QUERY,
    {
      variables: {
        id,
      },
    },
  );
  return {
    data: data ? data.inventoryItem : undefined,
    error,
    loading,
  };
};
