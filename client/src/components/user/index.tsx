import React from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { useUserContext } from './context';
import UserSettings from './settings';

const tabs = [
  {
    id: 'notifications',
    text: 'Notifications',
  },
  {
    id: 'settings',
    text: 'Settings',
  },
];

const UserDashboard = () => {
  const history = useHistory();

  const [userState, setUserState] = useUserContext();
  const { activeUser } = userState;
  const { id } = activeUser?.personContact || {};

  const { selectedTabId, TabBar } = useTabBar(tabs);

  const getContent = () => {
    switch (selectedTabId) {
      case 'settings':
        return <UserSettings />;
      default:
        return <div />;
    }
  };

  const handleLogout = () => {
    setUserState({ ...userState, activeUser: null });
    history.push('/');
  };

  if (!activeUser) {
    return <Redirect to="/" />;
  }

  return (
    <Page
      actions={[
        <l.AreaLink key={0} to={`/directory/internal/${id}`}>
          <b.Primary>Contact Info</b.Primary>
        </l.AreaLink>,
        <l.AreaLink key={1} to="/">
          <b.Primary ml={th.spacing.md} onClick={handleLogout}>
            Logout
          </b.Primary>
        </l.AreaLink>,
      ]}
      title="Dashboard"
    >
      <>
        <l.Div mb={th.spacing.lg}>
          <TabBar />
        </l.Div>
        {getContent()}
      </>
    </Page>
  );
};

export default UserDashboard;
