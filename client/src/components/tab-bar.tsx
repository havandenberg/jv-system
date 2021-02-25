import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { useQueryValue } from 'hooks/use-query-params';

export interface Tab {
  id: string;
  text: string;
  disabled?: boolean;
}

const StyledTab = styled(l.Div)(
  ({ disabled, selected }: { disabled?: boolean; selected?: boolean }) => ({
    background: selected
      ? th.colors.brand.primary
      : th.colors.brand.containerBackground,
    borderRadius: 20,
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
);

interface Props {
  onSelectTab: (tabId: string) => void;
  selectedTabId: string;
  tabs: Tab[];
}

const TabBar = ({ onSelectTab, selectedTabId, tabs }: Props) => (
  <l.Flex>
    {tabs.map(({ disabled, id, text }, idx) => {
      const selected = selectedTabId === id;
      const isLast = idx + 1 === tabs.length;
      return (
        <StyledTab
          key={id}
          disabled={disabled}
          mr={isLast ? undefined : th.spacing.md}
          onClick={() => {
            !disabled && onSelectTab(id);
          }}
          selected={selected}
        >
          <ty.CaptionText>{text}</ty.CaptionText>
        </StyledTab>
      );
    })}
  </l.Flex>
);

export default TabBar;

export const useTabBar = (
  tabs: Tab[],
  defaultTabId?: string,
  useQuery?: boolean,
) => {
  const [selectedTabId, onSelectTab] = useState(
    defaultTabId || (tabs[0] && tabs[0].id),
  );
  const [selectedTabIdQuery, setSelectedTabQuery] = useQueryValue('reportType');

  useEffect(() => {
    if (useQuery && !selectedTabIdQuery) {
      setSelectedTabQuery(defaultTabId || (tabs[0] && tabs[0].id));
    }
  }, [defaultTabId, selectedTabIdQuery, setSelectedTabQuery, tabs, useQuery]);

  const Component = () => (
    <TabBar
      onSelectTab={useQuery ? setSelectedTabQuery : onSelectTab}
      selectedTabId={selectedTabIdQuery || selectedTabId}
      tabs={tabs}
    />
  );

  return {
    selectedTabId: selectedTabIdQuery || selectedTabId,
    onSelectTab: useQuery ? setSelectedTabQuery : onSelectTab,
    TabBar: Component,
  };
};
