import React from 'react';

interface GlobalState {}

type SetContext = (c: GlobalState) => void;

const defaultContext = {};

export const GlobalContext = React.createContext<[GlobalState, SetContext]>([defaultContext, () => {}]);

export const useGlobalContext = () => React.useContext(GlobalContext);

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<GlobalState>(defaultContext);
  const updateState = (updatedState: GlobalState) => setState(prevState => ({ ...prevState, ...updatedState }));
  return <GlobalContext.Provider children={children} value={[state, updateState]} />;
};
