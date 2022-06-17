import React from 'react';

import Page from 'components/page';
import th from 'ui/theme';
import ty from 'ui/typography';

import DashboardNav from './nav';

const Dashboard = () => (
  <Page>
    <ty.TitleText center mb={th.spacing.lg} pb={th.spacing.md}>
      JV System
    </ty.TitleText>
    <DashboardNav />
  </Page>
);

export default Dashboard;
