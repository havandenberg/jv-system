import React, { useEffect, useMemo } from 'react';
import { pluck } from 'ramda';
import { useParams } from 'react-router-dom';

import api from 'api';
import BaseData from 'components/base-data';
import PalletList from 'components/inventory/inventory/pallets/list';
import Page from 'components/page';
import { DataMessage } from 'components/page/message';
import { Tab, useTabBar } from 'components/tab-bar';
import { SORT_ORDER } from 'hooks/use-columns';
import usePrevious from 'hooks/use-previous';
import {
  useSortQueryParams,
  useRepackQueryParams,
} from 'hooks/use-query-params';
import { Pallet, RepackHeader, RepackItem } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { baseLabels, indexBaseLabels } from './data-utils';
import RepackList from './list';

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

const tabs: (runCount: number, palletCount: number) => Tab[] = (
  runCount,
  palletCount,
) => [
  ...(runCount && palletCount > 1
    ? [
        {
          id: 'runs',
          text: 'Runs',
        },
      ]
    : []),
  {
    id: 'pallets',
    text: `Pallets ${palletCount ? ' (' + palletCount + ')' : ''}`,
  },
];

const Details = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const [, setSortParams] = useSortQueryParams();
  const [{ runNumber }, setRepackParams] = useRepackQueryParams();

  const { data, error, loading } = api.useRepack(id);
  const repacks = useMemo(() => (data?.nodes || []) as RepackHeader[], [data]);
  const repack = runNumber
    ? repacks.find((repack) => `${repack?.runNumber}` === runNumber)
    : repacks[0];
  const pallets = (
    runNumber
      ? pluck('pallet', (repack?.items.nodes || []) as RepackItem[])
      : repacks
          .map((rp) => pluck('pallet', (rp?.items.nodes || []) as RepackItem[]))
          .flat()
  ) as Pallet[];
  const hasPallets = pallets.length > 0;

  const { TabBar, selectedTabId } = useTabBar({
    tabs: tabs(pallets.length, runNumber ? 0 : repacks.length),
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
    if (repacks && repacks.length === 1 && repack && !runNumber) {
      setRepackParams(
        { runNumber: `${repack.runNumber}`, repackView: 'pallets' },
        'replaceIn',
      );
    }
  }, [runNumber, repacks, repack, setRepackParams]);

  const isRuns = selectedTabId === 'runs' && !runNumber && repacks.length > 1;

  const clearLocation = () => {
    setRepackParams({
      runNumber: undefined,
      repackView: repacks.length > 1 ? 'runs' : 'pallets',
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
          {(runNumber || repacks.length === 1) && (
            <>
              <l.Flex alignCenter my={th.spacing.md}>
                <ty.CaptionText>Run:</ty.CaptionText>
                {repacks.length > 1 && (
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
            <RepackList baseUrl="/inventory/repacks/" items={repacks} />
          ) : hasPallets ? (
            <PalletList baseUrl={`/inventory`} pallets={pallets} />
          ) : (
            <DataMessage data={pallets} error={error} loading={loading} />
          )}
        </l.Div>
      ) : (
        <DataMessage data={repacks} error={error} loading={loading} />
      )}
    </Page>
  );
};

export default Details;
