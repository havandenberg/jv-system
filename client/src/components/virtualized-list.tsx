import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import {
  Index,
  List,
  ListProps,
  ListRowRenderer,
  ScrollParams,
} from 'react-virtualized';

import UpArrow from 'assets/images/up-arrow';
import useDebounce from 'hooks/use-debounce';
import usePrevious from 'hooks/use-previous';
import { useQueryValue } from 'hooks/use-query-params';
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
  rowHeight?: (number | ((params: Index) => number)) &
    (number | ((info: Index) => number));
  rowRenderer: ListRowRenderer;
  width?: number;
}

const VirtualizedList = ({
  height = 650,
  rowHeight = 36,
  width = 1024,
  ...rest
}: OptionalListProps & Omit<ListProps, 'height' | 'rowHeight' | 'width'>) => {
  const ref = useRef<List>(null);
  const [listScrollTop, setListScrollTop] = useQueryValue('listScrollTop');
  const previousListScrollTop = usePrevious(listScrollTop);

  const [scrollTop, setScrollTop] = useState(listScrollTop || 0);
  const showScrollTop = scrollTop > 64;

  const handleScrollToTop = () => {
    if (ref && ref.current && showScrollTop) {
      ref.current.scrollToPosition(0);
    }
  };

  const debouncedScrollTop = useDebounce(scrollTop, 500);
  const previousDebouncedScrollTop = usePrevious(debouncedScrollTop);

  useEffect(() => {
    if (previousDebouncedScrollTop !== debouncedScrollTop) {
      setListScrollTop(`${debouncedScrollTop}`, 'replaceIn');
    }
  }, [debouncedScrollTop, setListScrollTop, previousDebouncedScrollTop]);

  useEffect(() => {
    if (previousListScrollTop !== listScrollTop) {
      setScrollTop(listScrollTop || 0);
    }
  }, [listScrollTop, setListScrollTop, previousListScrollTop]);

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
        scrollTop={parseFloat(`${scrollTop}`)}
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
