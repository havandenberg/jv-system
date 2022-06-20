import React from 'react';
import { isEmpty, pluck } from 'ramda';

import api from 'api';
import { DataMessage } from 'components/page/message';
import Page from 'components/page';
import VirtualizedList from 'components/virtualized-list';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PsaArrivalPicture, PsaArrivalReport } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { InspectionTypes, SubInspectionsProps } from '..';
import ListItem from '../list-item';
import { listLabels } from './data-utils';

export const gridTemplateColumns =
  '0.8fr 1.2fr 1.2fr 80px 80px 75px 0.9fr 30px';

interface PsaArrivalInspection extends PsaArrivalReport {
  imageUrls?: string[] | null;
}

const PsaArrivalInspections = ({
  breadcrumbs,
  DateRangePicker,
  Search,
  TabBar,
}: SubInspectionsProps) => {
  const { data, loading, error } = api.usePsaArrivalInspections();
  const inspections = data
    ? (data.nodes as PsaArrivalReport[]).map((report) => {
        const imageUrls = report
          ? pluck('imageUrl', report.pictures.nodes as PsaArrivalPicture[]) ||
            []
          : [];
        return { ...report, imageUrls };
      })
    : [];

  const columnLabels = useColumns<PsaArrivalReport>(
    'reportDate',
    SORT_ORDER.DESC,
    listLabels,
    'inspection',
    'psa_arrival_report',
  );

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={101}
      headerChildren={
        <>
          <l.Flex alignCenter mb={th.spacing.sm} justifyBetween>
            <l.Flex>
              {Search}
              <l.Div width={th.spacing.md} />
              {DateRangePicker}
              <l.Div width={th.spacing.md} />
            </l.Flex>
            {TabBar}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.md} pl={th.spacing.sm} secondary>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
                pr={data ? (data.totalCount > 7 ? th.spacing.md : 0) : 0}
              >
                {columnLabels}
                <ty.SmallText px={th.spacing.sm} secondary>
                  Images
                </ty.SmallText>
              </l.Grid>
            </>
          )}
        </>
      }
      title="PSA Inspections"
    >
      {!isEmpty(inspections) ? (
        <VirtualizedList
          rowCount={data ? inspections.length : 0}
          rowHeight={74}
          rowRenderer={({ key, index, style }) => {
            const item = inspections[index];
            const titleList = item
              ? (item.pictures.nodes as PsaArrivalPicture[]).map(
                  (picture) => `${picture.pictureDescription}`,
                )
              : undefined;
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<PsaArrivalInspection>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    lightboxTitle={item.id}
                    listLabels={listLabels}
                    slug={`${InspectionTypes.ARRIVAL}/${item.id}`}
                    titleList={titleList}
                  />
                </div>
              )
            );
          }}
        />
      ) : (
        <DataMessage
          data={inspections}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No reports found',
            text: 'Modify search and date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default PsaArrivalInspections;
