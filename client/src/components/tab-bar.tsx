import React, { useState } from 'react';
import styled from '@emotion/styled';

import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

export interface Tab {
  id: string;
  text: string;
}

const StyledTab = styled(l.Div)(({ selected }: { selected?: boolean }) => ({
  background: selected
    ? th.colors.brand.primary
    : th.colors.brand.containerBackground,
  borderRadius: 20,
  cursor: 'pointer',
  padding: `${th.spacing.sm} ${th.spacing.md}`,
  transition: th.transitions.default,
  ':hover': {
    background: selected
      ? th.colors.brand.primary
      : th.colors.brand.containerBackgroundAccent,
    p: {
      color: selected ? th.colors.text.inv : th.colors.brand.secondary,
    },
  },
  p: {
    color: selected ? th.colors.text.inv : th.colors.brand.secondary,
  },
}));

interface Props {
  onSelectTab: (tabId: string) => void;
  selectedTabId: string;
  tabs: Tab[];
}

const TabBar = ({ onSelectTab, selectedTabId, tabs }: Props) => (
  <l.Flex>
    {tabs.map(({ id, text }, idx) => {
      const selected = selectedTabId === id;
      const isLast = idx + 1 === tabs.length;
      return (
        <StyledTab
          key={id}
          mr={isLast ? undefined : th.spacing.md}
          onClick={() => {
            onSelectTab(id);
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

export const useTabBar = (tabs: Tab[]) => {
  const [selectedTabId, onSelectTab] = useState(tabs[0].id);

  const Component = () => (
    <TabBar
      onSelectTab={onSelectTab}
      selectedTabId={selectedTabId}
      tabs={tabs}
    />
  );

  return { selectedTabId, onSelectTab, TabBar: Component };
};
