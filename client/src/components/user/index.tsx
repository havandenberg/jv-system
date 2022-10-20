import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';

import Page from 'components/page';
import { useTabBar } from 'components/tab-bar';
import { User, UserMessage } from 'types';
import b from 'ui/button';
import l from 'ui/layout';
import th from 'ui/theme';

import { useActiveUser } from './context';
import UserBookmarks from './bookmarks';
import UserSettings from './settings';
import UserMessages from './messages';

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

  const {
    apiData: { data: activeUser, error, loading },
    userState,
    setUserState,
  } = useActiveUser();
  const { id: activeUserId } = activeUser || {};
  const { id: personContactId } = activeUser?.personContact || {};

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
        <l.AreaLink key={0} mr={th.spacing.lg} to="/">
          <b.Error onClick={handleLogout}>Logout</b.Error>
        </l.AreaLink>,
        <l.AreaLink key={1} to={`/directory/internal/${personContactId}`}>
          <b.Primary>Contact Info</b.Primary>
        </l.AreaLink>,
      ]}
      title="User Dashboard"
    >
      <l.Flex justifyBetween>
        <l.Div width="60%">
          <l.Div mb={th.spacing.lg}>
            <TabBar />
          </l.Div>
          {getContent()}
        </l.Div>
        <l.Div width="35%">
          <UserBookmarks
            id={activeUserId}
            showReadMessages={showReadMessages}
            user={activeUser as User}
          />
        </l.Div>
      </l.Flex>
    </Page>
  );
};

export default UserDashboard;
