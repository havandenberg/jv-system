import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import {
  Grid,
  GridCellRenderer,
  GridProps,
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

export const GridWrapper = styled(l.Div)({
  '& .ReactVirtualized__Grid__innerScrollContainer': {
    overflow: 'visible !important',
  },
});

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
  disableScrollTop?: boolean;
  disableScrollTracking?: boolean;
  height?: number;
  rowCount: number;
  rowHeight?: (number | ((params: Index) => number)) &
    (number | ((info: Index) => number));
  rowRenderer: ListRowRenderer;
  width?: number;
}

const VirtualizedList = ({
  disableScrollTop = true,
  disableScrollTracking,
  height = 650,
  onScroll,
  rowHeight = 36,
  width = 1024,
  ...rest
}: OptionalListProps & Omit<ListProps, 'height' | 'rowHeight' | 'width'>) => {
  const ref = useRef<List>(null);
  const [listScrollTop, setListScrollTop] = useQueryValue('listScrollTop');
  const previousListScrollTop = usePrevious(listScrollTop);

  const [scrollTop, setScrollTop] = useState(
    parseInt(listScrollTop || '0', 10),
  );
  const showScrollTop = scrollTop > 64;

  const handleScrollToTop = () => {
    if (showScrollTop) {
      setScrollTop(0);
    }
  };

  const debouncedScrollTop = useDebounce(scrollTop, 500);
  const previousDebouncedScrollTop = usePrevious(debouncedScrollTop);

  useEffect(() => {
    if (
      !disableScrollTop &&
      previousDebouncedScrollTop !== debouncedScrollTop
    ) {
      setListScrollTop(`${debouncedScrollTop}`, 'replaceIn');
    }
  }, [
    debouncedScrollTop,
    disableScrollTop,
    setListScrollTop,
    previousDebouncedScrollTop,
  ]);

  useEffect(() => {
    if (previousListScrollTop !== listScrollTop) {
      setScrollTop(parseInt(listScrollTop || '0', 10));
    }
  }, [listScrollTop, setListScrollTop, previousListScrollTop]);

  return (
    <>
      <List
        height={height}
        onScroll={
          disableScrollTracking
            ? undefined
            : (scrollParams: ScrollParams) => {
                !disableScrollTop && setScrollTop(scrollParams.scrollTop);
                onScroll && onScroll(scrollParams);
              }
        }
        overscanRowCount={10}
        ref={ref}
        rowHeight={rowHeight}
        scrollTop={
          disableScrollTracking || disableScrollTop
            ? undefined
            : parseFloat(`${scrollTop}`)
        }
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

interface OptionalGridProps {
  disableScrollTop?: boolean;
  disableScrollTracking?: boolean;
  height?: number;
  rowCount: number;
  rowHeight?: (number | ((params: Index) => number)) &
    (number | ((info: Index) => number));
  cellRenderer: GridCellRenderer;
  width?: number;
  recomputeGridSizeOnChange?: any;
}

export const VirtualizedGrid = ({
  disableScrollTop = true,
  disableScrollTracking,
  height = 650,
  onScroll,
  rowHeight = 36,
  width = 1024,
  recomputeGridSizeOnChange,
  ...rest
}: OptionalGridProps & Omit<GridProps, 'height' | 'rowHeight' | 'width'>) => {
  const ref = useRef<Grid>(null);
  const previousRecomputeGridSizeOnChange = usePrevious(
    recomputeGridSizeOnChange,
  );

  const [listScrollTop, setListScrollTop] = useQueryValue('listScrollTop');
  const previousListScrollTop = usePrevious(listScrollTop);

  const [scrollTop, setScrollTop] = useState(
    parseInt(listScrollTop || '0', 10),
  );
  const showScrollTop = scrollTop > 64;

  const handleScrollToTop = () => {
    if (showScrollTop) {
      setScrollTop(0);
    }
  };

  const debouncedScrollTop = useDebounce(scrollTop, 500);
  const previousDebouncedScrollTop = usePrevious(debouncedScrollTop);

  useEffect(() => {
    if (
      !disableScrollTop &&
      previousDebouncedScrollTop !== debouncedScrollTop
    ) {
      setListScrollTop(`${debouncedScrollTop}`, 'replaceIn');
    }
  }, [
    debouncedScrollTop,
    disableScrollTop,
    setListScrollTop,
    previousDebouncedScrollTop,
  ]);

  useEffect(() => {
    if (previousListScrollTop !== listScrollTop) {
      setScrollTop(parseInt(listScrollTop || '0', 10));
    }
  }, [listScrollTop, setListScrollTop, previousListScrollTop]);

  useEffect(() => {
    if (previousRecomputeGridSizeOnChange !== recomputeGridSizeOnChange) {
      ref.current?.recomputeGridSize();
    }
  }, [
    listScrollTop,
    recomputeGridSizeOnChange,
    previousRecomputeGridSizeOnChange,
  ]);

  return (
    <>
      <Grid
        height={height}
        onScroll={
          disableScrollTracking
            ? undefined
            : (scrollParams: ScrollParams) => {
                !disableScrollTop && setScrollTop(scrollParams.scrollTop);
                onScroll && onScroll(scrollParams);
              }
        }
        overscanRowCount={10}
        ref={ref}
        rowHeight={rowHeight}
        scrollTop={
          disableScrollTracking || disableScrollTop
            ? undefined
            : parseFloat(`${scrollTop}`)
        }
        width={width}
        {...rest}
      />
      <ScrollToTop onClick={handleScrollToTop} visible={showScrollTop}>
        <UpArrow height={th.sizes.sm} />
      </ScrollToTop>
    </>
  );
};
