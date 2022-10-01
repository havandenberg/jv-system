import React from 'react';

import { useActiveUser } from 'components/user/context';
import th from 'ui/theme';

import { UseTabBarProps, useTabBar } from '.';
import { omit } from 'ramda';

export const leftTabStyles = {
  borderBottomRightRadius: 0,
  borderTopRightRadius: 0,
  justifyContent: 'center',
  marginRight: th.spacing.sm,
  padding: `${th.spacing.sm} 10px ${th.spacing.sm} 12px`,
  width: th.spacing.md,
  style: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
};

export const middleTabStyles = {
  borderRadius: 0,
  justifyContent: 'center',
  marginRight: th.spacing.sm,
  padding: `${th.spacing.sm} 10px ${th.spacing.sm} 10px`,
  width: th.spacing.md,
  style: {
    borderRadius: 0,
  },
};

export const rightTabStyles = {
  justifyContent: 'center',
  marginRight: 0,
  padding: `${th.spacing.sm} 12px ${th.spacing.sm} 10px`,
  width: th.spacing.md,
  style: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
};

export const coastTabs = [
  {
    id: 'WC',
    customStyles: leftTabStyles,
    text: 'W',
  },
  {
    id: 'EC',
    customStyles: rightTabStyles,
    text: 'E',
  },
];

const useCoastTabBar = (props?: UseTabBarProps) => {
  const {
    apiData: { data },
  } = useActiveUser();

  const { defaultCoast } = data || {};

  return useTabBar({
    tabs: props?.tabs || coastTabs,
    isRoute: false,
    defaultTabId: defaultCoast || 'EC',
    paramName: 'coast',
    defaultTabIndex: !defaultCoast || defaultCoast === 'EC' ? 1 : 0,
    ...omit(['tabs'], props),
  });
};

export default useCoastTabBar;
