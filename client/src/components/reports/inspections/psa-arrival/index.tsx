import React from 'react';
import { isEmpty } from 'ramda';

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
import Header from '../header';
import ListItem from '../list-item';
import { listLabels as getListLabels } from './data-utils';

export const gridTemplateColumns =
  '0.8fr 0.6fr 1.2fr 1.2fr 80px 75px 0.9fr 30px';

interface PsaArrivalInspection extends PsaArrivalReport {
  imageUrls?: string[] | null;
}

const PsaArrivalInspections = ({ breadcrumbs }: SubInspectionsProps) => {
  const { data, vesselOptions, shipperOptions, loading, error } =
    api.usePsaArrivalInspections();
  const inspections = data || [];

  const listLabels = getListLabels(vesselOptions, shipperOptions);

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
      extraPaddingTop={112}
      headerChildren={
        <>
          <Header dataCount={data.length} loading={loading} />
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
              pr={data ? (data.length > 7 ? th.spacing.md : 0) : 0}
            >
              {columnLabels}
              <ty.SmallText px={th.spacing.sm} secondary>
                Images
              </ty.SmallText>
            </l.Grid>
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
            const slides = item
              ? ((item.pictures.nodes || []) as PsaArrivalPicture[]).map(
                  ({ imageUrl, palletId, pictureDescription }) => ({
                    description: pictureDescription,
                    src: `${api.baseURL}/${imageUrl}`,
                    title: palletId,
                  }),
                )
              : [];
            return (
              item && (
                <div key={key} style={style}>
                  <ListItem<PsaArrivalInspection>
                    data={item}
                    gridTemplateColumns={gridTemplateColumns}
                    index={index}
                    listLabels={listLabels}
                    slug={`${InspectionTypes.ARRIVAL}/${item.id}`}
                    slides={slides}
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
