import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import api from 'api';
import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { useUserContext } from './context';
import UserSettings from './settings';
import UserMessages from './messages';
import { UserMessage } from 'types';

const tabs = (messageCount?: number) => [
  {
    id: 'messages',
    text: `Messages${
      messageCount !== undefined ? ' (' + messageCount + ')' : ''
    }`,
  },
  {
    id: 'settings',
    text: 'Settings',
  },
];

const UserDashboard = () => {
  const history = useHistory();
  const [showReadMessages, setShowReadMessages] = useState(false);

  const [userState, setUserState] = useUserContext();
  const { activeUserId } = userState;
  const {
    data: activeUser,
    error,
    loading,
  } = api.useGetUser(activeUserId || 0, showReadMessages);
  const { id } = activeUser?.personContact || {};

  const messages = activeUser?.userMessages.nodes || [];

  const { selectedTabId, TabBar } = useTabBar({
    tabs: tabs(activeUser ? messages.length : undefined),
  });

  const getContent = () => {
    switch (selectedTabId) {
      case 'settings':
        return <UserSettings />;
      default:
        return (
          <UserMessages
            error={error}
            loading={loading}
            messages={messages as UserMessage[]}
            showReadMessages={showReadMessages}
            setShowReadMessages={(show: boolean) => {
              setShowReadMessages(show);
            }}
            userId={activeUserId || 0}
          />
        );
    }
  };

  const handleLogout = () => {
    setUserState({ ...userState, activeUserId: null });
    history.push('/');
  };

  if (!activeUserId) {
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
      title="User Dashboard"
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
