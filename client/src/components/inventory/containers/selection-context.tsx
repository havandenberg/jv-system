import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import usePrevious from 'hooks/use-previous';

interface ContainersSelectionState {
  selectedContainerIds: string[];
}

const defaultContext = {
  selectedContainerIds: [],
};

export const ContainersSelectionContext = createContext<
  [ContainersSelectionState, { [key: string]: any }]
>([
  defaultContext,
  {
    clearAllSelectedContainers: () => {},
    selectContainer: () => {},
    isAllVesselContainersSelected: () => {},
    toggleAllVesselContainers: () => {},
  },
]);

export const useContainersSelectionContext = () =>
  useContext(ContainersSelectionContext);

export const ContainersSelectionContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [{ selectedContainerIds }, setSelectedContainerIds] =
    useState<ContainersSelectionState>(defaultContext);
  const { pathname } = useLocation();
  const previousPathname = usePrevious(pathname);

  const clearAllSelectedContainers = useCallback(() => {
    setSelectedContainerIds(defaultContext);
  }, [setSelectedContainerIds]);

  useEffect(() => {
    if (pathname !== previousPathname && !pathname.includes('containers')) {
      clearAllSelectedContainers();
    }
  }, [clearAllSelectedContainers, pathname, previousPathname]);

  const selectContainer = (containerId: string) => {
    if (selectedContainerIds.find((cid) => cid === containerId)) {
      setSelectedContainerIds({
        selectedContainerIds: selectedContainerIds.filter(
          (cid) => cid !== containerId,
        ),
      });
    } else {
      setSelectedContainerIds({
        selectedContainerIds: [...selectedContainerIds, containerId],
      });
    }
  };

  const isAllVesselContainersSelected = (containerIds: string[]) =>
    containerIds.reduce(
      (acc, containerId) =>
        acc && !!selectedContainerIds.find((cid) => cid === containerId),
      true,
    );

  const toggleAllVesselContainers = (containerIds: string[]) => {
    const filteredContainerIds = selectedContainerIds.filter(
      (cid) => !containerIds.includes(cid),
    );
    if (isAllVesselContainersSelected(containerIds)) {
      setSelectedContainerIds({
        selectedContainerIds: filteredContainerIds,
      });
    } else {
      setSelectedContainerIds({
        selectedContainerIds: [...filteredContainerIds, ...containerIds],
      });
    }
  };

  return (
    <ContainersSelectionContext.Provider
      children={children}
      value={[
        { selectedContainerIds },
        {
          clearAllSelectedContainers,
          selectContainer,
          isAllVesselContainersSelected,
          toggleAllVesselContainers,
        },
      ]}
    />
  );
};
