import React, { createContext, useContext } from 'react';

import useLocalStorage from 'hooks/use-local-storage';

interface InventoryState {
  vesselsIsOpen: boolean;
}

const defaultContext = { vesselsIsOpen: false };

export const InventoryContext = createContext<
  [InventoryState, (value: InventoryState) => void]
>([defaultContext, () => {}]);

export const useInventoryContext = () => useContext(InventoryContext);

export const InventoryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useLocalStorage<InventoryState>(
    'inventoryState',
    defaultContext,
  );

  return (
    <InventoryContext.Provider children={children} value={[state, setState]} />
  );
};
