import React from 'react';
import { isEmpty } from 'ramda';
import { Range } from 'react-date-range';

import api from 'api';
import Empty from 'components/empty';
import Page from 'components/page';
import useDateRange from 'hooks/use-date-range';
import useSearch from 'hooks/use-search';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { filterInspectionReports, listLabels } from './data-utils';
import ListItem from './list-item';
import Loading from 'components/loading';

const breadcrumbs = [{ text: 'All Inspections', to: '/reports/inspections' }];
export const gridTemplateColumns = '3fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

const Inspections = () => {
  const { data, loading } = api.useInspections();
  const { search, Search } = useSearch();
  const { selectedDates, DateRangePicker } = useDateRange();
  const { startDate, endDate } =
    (selectedDates && (selectedDates as Range[])[0]) || {};

  if (!data) {
    return null;
  }

  const filteredReports = filterInspectionReports(
    data,
    search,
    startDate,
    endDate,
  );

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={98}
      headerChildren={
        <>
          <l.Flex mb={th.spacing.lg}>
            {Search}
            <l.Div width={th.spacing.md} />
            {DateRangePicker}
          </l.Flex>
          {!loading && (
            <l.Grid
              gridTemplateColumns={gridTemplateColumns}
              mb={th.spacing.sm}
              pl={th.spacing.sm}
            >
              {listLabels.map(({ label }, idx) => (
                <ty.SmallText key={idx} px={th.spacing.sm} secondary>
                  {label}
                </ty.SmallText>
              ))}
              <ty.SmallText px={th.spacing.sm} secondary>
                Images
              </ty.SmallText>
            </l.Grid>
          )}
        </>
      }
      title="Peru Grape Inspection Reports"
    >
      {!data || loading ? (
        <Loading />
      ) : isEmpty(filteredReports) ? (
        <Empty
          header="No Reports Found 😔"
          text="Modify search and date parameters to view more results."
        />
      ) : (
        filteredReports.map((inspection, idx) => (
          <ListItem data={inspection} key={idx} />
        ))
      )}
    </Page>
  );
};

export default Inspections;
