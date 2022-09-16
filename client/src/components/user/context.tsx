import React, { createContext, useContext } from 'react';

import useLocalStorage from 'hooks/use-local-storage';
import api from 'api';
import { getUserRoles } from './roles';
import { User } from 'types';

interface UserState {
  activeUserId: number | null;
}

type SetContext = (c: UserState) => void;

const defaultContext = {
  activeUserId: null,
};

export const UserContext = createContext<[UserState, SetContext]>([
  defaultContext,
  () => {},
]);

export const useUserContext = () => useContext(UserContext);

export const useActiveUser = () => {
  const [userState, setUserState] = useUserContext();
  const { activeUserId } = userState;
  const apiData = api.useGetUser(activeUserId || 0);
  const roles = apiData.data ? getUserRoles(apiData.data as User) : {};

  return { apiData, roles, userState, setUserState };
};

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
