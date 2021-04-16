import React from 'react';

import Page from 'components/page';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import DashboardNav from './nav';

const Dashboard = () => (
  <Page
    headerChildren={
      <ty.LargeText
        center
        italic
        fontFamily={th.fontFamilies.header}
        mt={th.spacing.lg}
      >
        <ty.Span fontSize={th.fontSizes.display}>"</ty.Span> One Call Brings You
        The World's Finest Brands Of Fresh Produce{' '}
        <ty.Span fontSize={th.fontSizes.display}>"</ty.Span>
      </ty.LargeText>
    }
  >
    <l.Flex mt={th.spacing.lg}>
      <DashboardNav />
    </l.Flex>
  </Page>
);

export default Dashboard;
