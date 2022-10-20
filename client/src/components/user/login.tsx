import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import api from 'api';
import { BasicModal } from 'components/modal';
import StatusIndicator from 'components/status-indicator';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import TextInput from 'ui/input';

import { useActiveUser } from './context';
import AddBookmark from './bookmarks/add';
import { userMessagePriorityMap } from './messages';

interface State {
  pin: string;
  error: boolean;
}

const initialState = {
  pin: '',
  error: false,
};

const UserLogin = () => {
  const { pathname } = useLocation();
  const { data: authData } = api.useGetUserAuthList();

  const {
    apiData: { data: activeUser },
    userState,
    setUserState,
  } = useActiveUser();

  const [state, setState] = useState<State>(initialState);
  const { error, pin } = state;

  const messages = activeUser?.userMessages.nodes || [];
  const messageCount = messages.length;
  const highestMessagePriority =
    messages.length > 0
      ? messages.reduce(
          (highestPriority, message) =>
            message && message.priority < highestPriority
              ? message.priority
              : highestPriority,
          messages[0]?.priority || 0,
        )
      : 0;

  const handleLogin = () => {
    if (authData) {
      const user = authData.nodes.find((u) => u && u.pin === pin);
      if (user) {
        setUserState({ ...userState, activeUserId: user.id });
        setState(initialState);
        return true;
      } else {
        setState({ ...state, error: true, pin: '' });
        return false;
      }
    }
  };

  return (
    <l.Flex
      alignCenter
      height={20}
      position="absolute"
      bottom={th.spacing.sm}
      right={th.spacing.xl}
    >
      {activeUser && !['/', '/user'].includes(pathname) && (
        <AddBookmark user={activeUser} />
      )}
      {activeUser ? (
        <l.AreaLink to="/user">
          <l.Flex alignCenter>
            <ty.TriggerText fontSize={th.fontSizes.caption}>
              Welcome, {activeUser?.personContact?.firstName}
            </ty.TriggerText>
            {!!messageCount && (
              <l.Div ml={th.spacing.sm}>
                <StatusIndicator
                  diameter={20}
                  status={userMessagePriorityMap[highestMessagePriority].status}
                  value={messageCount}
                />
              </l.Div>
            )}
          </l.Flex>
        </l.AreaLink>
      ) : (
        <BasicModal
          title="User Login"
          content={
            <>
              <ty.BodyText>Enter your pin below to log in.</ty.BodyText>
              <l.Flex justifyCenter mt={th.spacing.lg}>
                <TextInput
                  autoFocus
                  onChange={(e) =>
                    setState({ ...state, error, pin: e.target.value })
                  }
                  style={{ padding: 0, textAlign: 'center', width: 300 }}
                  value={pin}
                  type="password"
                />
              </l.Flex>
              {error && (
                <l.Flex justifyCenter mt={th.spacing.md}>
                  <ty.BodyText color={th.colors.status.error}>
                    Pin not recognized, please try again.
                  </ty.BodyText>
                </l.Flex>
              )}
            </>
          }
          handleConfirm={handleLogin}
          onCancel={() => setState(initialState)}
          confirmDisabled={pin.length === 0}
          confirmText="Login"
          triggerProps={{ fontSize: th.fontSizes.caption }}
          triggerText="Login"
          triggerType="text"
        />
      )}
    </l.Flex>
  );
};

export default UserLogin;
