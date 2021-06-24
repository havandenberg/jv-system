import useLocalStorage from 'hooks/use-local-storage';
import React, { createContext, useContext } from 'react';
import { User } from 'types';

interface UserState {
  activeUser: User | null;
}

type SetContext = (c: UserState) => void;

const defaultContext = {
  activeUser: null,
};

export const UserContext = createContext<[UserState, SetContext]>([
  defaultContext,
  () => {},
]);

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useLocalStorage<UserState>('user', defaultContext);
  const updateState = (updatedState: UserState) =>
    setState((prevState) => ({ ...prevState, ...updatedState }));
  return (
    <UserContext.Provider children={children} value={[state, updateState]} />
  );
};
