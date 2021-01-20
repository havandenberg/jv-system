import React from 'react';

import api from 'api';
import Page from 'components/page';
import useSearch from 'hooks/use-search';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import { filterInspectionReports, listLabels } from './data-utils';
import ListItem from './list-item';

const breadcrumbs = [{ text: 'All Inspections', to: '/reports/inspections' }];
export const gridTemplateColumns = '3fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

const Inspections = () => {
  const { data } = api.useInspections();
  const { search, Search } = useSearch();

  if (!data) {
    return null;
  }

  const filteredReports = filterInspectionReports(data, search);

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={98}
      headerChildren={
        <>
          <l.Flex mb={th.spacing.lg}>{Search}</l.Flex>
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
        </>
      }
      title="Peru Grape Inspection Reports"
    >
      {filteredReports.map((inspection, idx) => (
        <ListItem data={inspection} key={idx} />
      ))}
    </Page>
  );
};

export default Inspections;
