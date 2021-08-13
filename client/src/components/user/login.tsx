import React, { useState } from 'react';

import api from 'api';
import { BasicModal } from 'components/modal';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';
import TextInput from 'ui/input';

import { useUserContext } from './context';

interface State {
  pin: string;
  error: boolean;
}

const initialState = {
  pin: '',
  error: false,
};

const UserLogin = () => {
  const { data } = api.useGetUsers();
  const [userState, setUserState] = useUserContext();
  const { activeUser } = userState;
  const [state, setState] = useState<State>(initialState);
  const { error, pin } = state;

  const handleLogin = () => {
    if (data) {
      const user = data.nodes.find((u) => u && u.pin === pin);
      if (user) {
        setUserState({ ...userState, activeUser: user });
        setState(initialState);
        return true;
      } else {
        setState({ ...state, error: true, pin: '' });
        return false;
      }
    }
  };

  return (
    <l.Div position="absolute" bottom={th.spacing.sm} right={th.spacing.md}>
      {activeUser ? (
        <l.AreaLink to="/user">
          <ty.TriggerText fontSize={th.fontSizes.caption}>
            Welcome, {activeUser?.personContact?.firstName}
          </ty.TriggerText>
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
                  style={{ padding: 0, textAlign: 'center' }}
                  value={pin}
                  type="password"
                  width={th.sizes.fill}
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
          triggerStyles={{ fontSize: th.fontSizes.caption }}
          triggerText="Login"
          triggerType="text"
        />
      )}
    </l.Div>
  );
};

export default UserLogin;
