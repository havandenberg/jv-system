import React from 'react';

import Breadcrumbs from 'components/nav/breadcrumbs';
import ty from 'ui/typography';
import { useInspections } from 'api/inspections';

const breadcrumbs = [{ text: 'All Inspections', to: '/reports/inspections' }];

const Inspections = () => {
  const inspections = useInspections();
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <ty.TitleText>Peru Grape Inspection Reports</ty.TitleText>
    </>
  );
};

export default Inspections;
