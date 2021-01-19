import React from 'react';

import { useInspections } from 'api/inspections';
import Page from 'components/page';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import ListItem, { columns } from './list-item';

const breadcrumbs = [{ text: 'All Inspections', to: '/reports/inspections' }];
export const gridTemplateColumns = '3fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

const Inspections = () => {
  const { data } = useInspections();

  if (!data) {
    return null;
  }

  return (
    <Page
      breadcrumbs={breadcrumbs}
      extraPaddingTop={24}
      headerChildren={
        <l.Grid gridTemplateColumns={gridTemplateColumns} mb={th.spacing.sm}>
          {columns.map(({ label }, idx) => (
            <ty.SmallText key={idx} px={th.spacing.sm} secondary>
              {label}
            </ty.SmallText>
          ))}
          <ty.SmallText px={th.spacing.sm} secondary>
            Images
          </ty.SmallText>
        </l.Grid>
      }
      title="Peru Grape Inspection Reports"
    >
      {data.map(
        (inspection, idx) =>
          inspection && <ListItem data={inspection} key={idx} />,
      )}
    </Page>
  );
};

export default Inspections;
