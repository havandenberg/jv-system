import React from 'react';
import { isEmpty } from 'ramda';

import api from 'api';
import { DataMessage, DataMessageProps } from 'components/page/message';
import Page from 'components/page';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';
import useColumns, { SORT_ORDER } from 'hooks/use-columns';
import { PeruDepartureInspection } from 'types';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import ImportInspectionsModal from './import';
import { listLabels } from './peru-departure/data-utils';
import ListItem from './peru-departure/list-item';

const breadcrumbs = [{ text: 'All Inspections', to: '/reports/inspections' }];
export const gridTemplateColumns = '50px 3.5fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

export const InspectionsDataMessage = <T extends {}>(
  dataProps: DataMessageProps<T>,
) => <DataMessage {...dataProps} />;

const Inspections = () => {
  const { data, error, loading } = api.usePeruDepartureInspections();
  const inspections = data ? data.nodes : [];
  const { Search } = useSearch();
  const { DateRangePicker } = useDateRange();
  const columnLabels = useColumns<PeruDepartureInspection>(
    'inspectionDate',
    SORT_ORDER.DESC,
    listLabels,
  );

  return (
    <Page
      actions={<ImportInspectionsModal />}
      breadcrumbs={breadcrumbs}
      extraPaddingTop={122}
      headerChildren={
        <>
          <l.Flex mb={th.spacing.sm}>
            {Search}
            <l.Div width={th.spacing.md} />
            {DateRangePicker}
          </l.Flex>
          {!loading && (
            <>
              <ty.SmallText mb={th.spacing.lg} pl={th.spacing.sm}>
                Results: {data ? data.totalCount : '-'}
              </ty.SmallText>
              <l.Grid
                gridTemplateColumns={gridTemplateColumns}
                mb={th.spacing.sm}
                pl={th.spacing.sm}
              >
                <ty.SmallText pr={th.spacing.sm} secondary>
                  Type
                </ty.SmallText>
                {columnLabels}
                <ty.SmallText px={th.spacing.sm} secondary>
                  Images
                </ty.SmallText>
              </l.Grid>
            </>
          )}
        </>
      }
      title="Product Inspection Reports"
    >
      {inspections && !isEmpty(inspections) ? (
        inspections.map(
          (inspection, idx) =>
            inspection && <ListItem data={inspection} key={idx} />,
        )
      ) : (
        <InspectionsDataMessage
          data={(inspections as PeruDepartureInspection[]) || []}
          error={error}
          loading={loading}
          emptyProps={{
            header: 'No Reports Found 😔',
            text: 'Modify search and date parameters to view more results.',
          }}
        />
      )}
    </Page>
  );
};

export default Inspections;
