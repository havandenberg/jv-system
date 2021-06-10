import React, { useRef, useState } from 'react';
import styled from '@emotion/styled';
import {
  List,
  ListProps,
  ListRowRenderer,
  ScrollParams,
} from 'react-virtualized';

import UpArrow from 'assets/images/up-arrow';
import l from 'ui/layout';
import th from 'ui/theme';

const ScrollToTop = styled(l.Div)(({ visible }: { visible: boolean }) => ({
  position: 'fixed',
  bottom: 50,
  right: 30,
  cursor: visible ? 'pointer' : 'default',
  transition: th.transitions.default,
  color: th.colors.brand.primary,
  opacity: visible ? 1 : 0,
}));

interface OptionalListProps {
  height?: number;
  rowCount: number;
  rowHeight?: number;
  rowRenderer: ListRowRenderer;
  width?: number;
}

const VirtualizedList = ({
  height = 650,
  rowHeight = 48,
  width = 1024,
  ...rest
}: OptionalListProps & Omit<ListProps, 'height' | 'rowHeight' | 'width'>) => {
  const ref = useRef<List>(null);

  const [scrollTop, setScrollTop] = useState(0);
  const showScrollTop = scrollTop > 64;

  const handleScrollToTop = () => {
    if (ref && ref.current && showScrollTop) {
      ref.current.scrollToPosition(0);
    }
  };

  return (
    <>
      <List
        height={height}
        onScroll={({ scrollTop }: ScrollParams) => {
          setScrollTop(scrollTop);
        }}
        overscanRowCount={10}
        ref={ref}
        rowHeight={rowHeight}
        width={width}
        {...rest}
      />
      <ScrollToTop onClick={handleScrollToTop} visible={showScrollTop}>
        <UpArrow height={th.sizes.sm} />
      </ScrollToTop>
    </>
  );
};

export default VirtualizedList;
