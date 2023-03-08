import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import {
  useSortQueryParams,
  useRepackQueryParams,
} from 'hooks/use-query-params';
import { RepackHeader, RepackItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels, indexBaseLabels } from './data-utils';
import RepackItemList from './items/list';
import RepackList from './list';
import { groupBy, sortBy, values } from 'ramda';

export const breadcrumbs = (id: string) => [
  {
    text: 'Repacks',
    to: `/inventory/repacks`,
  },
  {
    text: 'Repack',
    to: `/inventory/repacks/${id}`,
  },
];

const tabs: (runCount: number, itemCount: number) => Tab[] = (
  runCount,
  itemCount,
) => [
  ...(runCount > 1
    ? [
        {
          id: 'runs',
          text: 'Runs',
        },
      ]
    : []),
  {
    id: 'items',
    text: `Items ${itemCount ? ' (' + itemCount + ')' : ''}`,
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [, setSortParams] = useSortQueryParams();
  const [{ runNumber }, setRepackParams] = useRepackQueryParams();

  const repackCodeSearchArray = id.split('-');
  const originalRepackCode = `${repackCodeSearchArray[0] || ''}-${
    repackCodeSearchArray[1]?.replace(/\D/g, '') || ''
  }`;
  const repackCodeSearch = `${originalRepackCode}%`;

  const { data, error, loading } = api.useRepack(repackCodeSearch);
  const repacks = useMemo(
    () =>
      ((data?.nodes || []) as RepackHeader[]).filter(
        (rh) =>
          rh?.runNumber !== '1' &&
          rh?.repackCode?.split('-')?.[1]?.replace(/\D/g, '') ===
            repackCodeSearchArray[1]?.replace(/\D/g, ''),
      ),
    [data, repackCodeSearchArray],
  );
  const filteredRepacks = values(
    groupBy((rp) => rp?.repackCode || 'UNK', repacks),
  )
    .map((rg) =>
      rg.length > 1 ? sortBy((rp) => rp.repackDate, rg)[rg.length - 1] : rg,
    )
    .flat();

  const repack =
    runNumber !== undefined
      ? filteredRepacks.find((repack) =>
          repack?.runNumber
            ? `${repack?.runNumber}` === runNumber
            : repack.repackCode === id,
        )
      : filteredRepacks.find(
          (repack) => repack?.repackCode === originalRepackCode,
        );

  const items = (
    runNumber !== undefined
      ? repack?.items.nodes || []
      : filteredRepacks.map((rp) => rp?.items.nodes || []).flat()
  ) as RepackItem[];
  const hasItems = items.length > 0;

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(
      runNumber !== undefined ? 0 : filteredRepacks.length,
      items.length,
    ),
    isRoute: false,
    defaultTabId: 'runs',
    paramName: 'repackView',
  });
  const prevSelectedTabId = usePrevious(selectedTabId);

  useEffect(() => {
    if (prevSelectedTabId !== selectedTabId) {
      const isRuns = selectedTabId === 'runs';
      setSortParams(
        {
          sortBy: isRuns ? 'runNumber' : 'palletId',
          sortOrder: SORT_ORDER.ASC,
        },
        'replaceIn',
      );
    }
  }, [prevSelectedTabId, selectedTabId, setSortParams]);

  useEffect(() => {
    if (
      filteredRepacks &&
      filteredRepacks.length === 1 &&
      repack &&
      runNumber === undefined
    ) {
      setRepackParams(
        { runNumber: `${repack.runNumber}`, repackView: 'items' },
        'replaceIn',
      );
    }
  }, [runNumber, filteredRepacks, repack, setRepackParams]);

  const isRuns =
    selectedTabId === 'runs' &&
    runNumber === undefined &&
    filteredRepacks.length > 1;

  const clearLocation = () => {
    setRepackParams({
      runNumber: undefined,
      repackView: filteredRepacks.length > 1 ? 'runs' : 'items',
    });
  };

  return (
    <Page
      breadcrumbs={breadcrumbs(id)}
      title={repack ? 'Repack Details' : 'Loading...'}
    >
      {repack ? (
        <l.Div pb={th.spacing.xl}>
          <BaseData<RepackHeader> data={repack} labels={indexBaseLabels} />
          {(runNumber !== undefined || filteredRepacks.length === 1) && (
            <>
              <l.Flex alignCenter my={th.spacing.md}>
                <ty.CaptionText>Run:</ty.CaptionText>
                {filteredRepacks.length > 1 && (
                  <l.HoverButton
                    dark
                    ml={th.spacing.lg}
                    onClick={clearLocation}
                  >
                    <ty.CaptionText>Show All</ty.CaptionText>
                  </l.HoverButton>
                )}
              </l.Flex>
              <BaseData<RepackHeader> data={repack} labels={baseLabels} />
            </>
          )}
          <l.Flex alignCenter justifyBetween my={th.spacing.lg}>
            <TabBar />
          </l.Flex>
          {isRuns ? (
            <RepackList baseUrl="/inventory/repacks/" items={filteredRepacks} />
          ) : hasItems ? (
            <RepackItemList items={items} />
          ) : (
            <DataMessage data={items} error={error} loading={loading} />
          )}
        </l.Div>
      ) : (
        <DataMessage data={filteredRepacks} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
