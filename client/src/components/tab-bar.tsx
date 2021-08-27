import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';

import { useQueryValue } from 'hooks/use-query-params';
import l, { DivProps, divPropsSet } from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export interface Tab {
  id: string;
  text: string;
  to?: string;
  disabled?: boolean;
  customStyles?: DivProps;
}

export const StyledTab = styled(l.Flex)(
  ({ disabled, selected }: { disabled?: boolean; selected?: boolean }) => ({
    background: selected
      ? th.colors.brand.primary
      : th.colors.brand.containerBackground,
    borderRadius: 20,
    boxShadow: th.shadows.boxLight,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? th.opacities.disabled : 1,
    padding: `${th.spacing.sm} ${th.spacing.md}`,
    transition: th.transitions.default,
    ':hover': {
      background: disabled
        ? th.colors.brand.containerBackground
        : selected
        ? th.colors.brand.primary
        : th.colors.brand.containerBackgroundAccent,
      p: {
        color: selected ? th.colors.text.inv : th.colors.brand.secondary,
      },
    },
    p: {
      color: selected ? th.colors.text.inv : th.colors.brand.secondary,
    },
  }),
  divPropsSet,
);

interface Props {
  onSelectTab?: (tabId: string) => void;
  selectedTabId: string;
  tabs: Tab[];
}

const TabBar = ({ onSelectTab, selectedTabId, tabs }: Props) => (
  <l.Flex>
    {tabs.map(({ customStyles, disabled, id, text, to }, idx) => {
      const selected = selectedTabId === id;
      const isLast = idx + 1 === tabs.length;
      const tab = (
        <StyledTab
          disabled={disabled}
          key={id}
          mr={isLast ? undefined : th.spacing.md}
          onClick={() => {
            !disabled && onSelectTab && onSelectTab(id);
          }}
          selected={selected}
          {...customStyles}
        >
          <ty.CaptionText>{text}</ty.CaptionText>
        </StyledTab>
      );

      return to && !disabled ? (
        <l.AreaLink key={id} to={to || '#'}>
          {tab}
        </l.AreaLink>
      ) : (
        tab
      );
    })}
  </l.Flex>
);

export default TabBar;

export const useTabBar = (
  tabs: Tab[],
  isRoute?: boolean,
  defaultTabId?: string,
  paramName?: string,
  defaultTabIndex: number = 0,
  onSelectTab?: (tabId: string) => void,
) => {
  const { routeTabId } = useParams<{
    routeTabId: string;
  }>();
  const firstTab = tabs[defaultTabIndex] && tabs[defaultTabIndex].id;
  const [stateTabId, setStateTabId] = useState(
    defaultTabId || isRoute ? routeTabId || firstTab : firstTab,
  );
  const [queryTabId, setQueryTabId] = useQueryValue(paramName || '');
  const selectedTabId = isRoute
    ? routeTabId
    : paramName
    ? queryTabId || stateTabId
    : stateTabId;

  const handleSelectTab = (tabId: string) => {
    onSelectTab && onSelectTab(tabId);
    if (paramName) {
      setQueryTabId(tabId);
    } else {
      setStateTabId(tabId);
    }
  };

  useEffect(() => {
    if (paramName && !queryTabId) {
      setQueryTabId(defaultTabId || firstTab);
    }
  }, [defaultTabId, firstTab, paramName, queryTabId, setQueryTabId]);

  const Component = () => (
    <TabBar
      onSelectTab={isRoute ? undefined : handleSelectTab}
      selectedTabId={selectedTabId}
      tabs={tabs}
    />
  );

  return {
    selectedTabId,
    handleSelectTab,
    TabBar: Component,
  };
};
