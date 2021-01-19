import React from 'react';

import { useInspections } from 'api/inspections';
import Breadcrumbs from 'components/nav/breadcrumbs';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import ListItem, { columns } from './list-item';

const breadcrumbs = [{ text: 'All Inspections', to: '/reports/inspections' }];
export const gridTemplateColumns = '3fr 4fr 4fr 4fr 2fr 2fr 6fr 30px';

const Inspections = () => {
  const { data } = useInspections();
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <ty.TitleText>Peru Grape Inspection Reports</ty.TitleText>
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
      {data.map((inspection, idx) => (
        <ListItem data={inspection} key={idx} />
      ))}
    </>
  );
};

export default Inspections;
