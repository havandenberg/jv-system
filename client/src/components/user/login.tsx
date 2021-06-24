import { BasicModal } from 'components/modal';
import React, { useState } from 'react';

import api from 'api';
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

const Login = () => {
  const { data } = api.useGetUsers();
  const [userState, setUserState] = useUserContext();
  const { activeUser } = userState;
  const [{ error, pin }, setState] = useState<State>(initialState);

  const handleLogin = () => {
    if (data) {
      const user = data.nodes.find((u) => u && u.pin === pin);
      if (user) {
        setUserState({ ...userState, activeUser: user });
        return true;
      } else {
        setState({ error: true, pin: '' });
        return false;
      }
    }
  };

  const handleLogout = () => {
    setUserState({ ...userState, activeUser: null });
    setState(initialState);
  };

  return (
    <l.Div position="absolute" bottom={th.spacing.sm} right={th.spacing.md}>
      <BasicModal
        title="User Login"
        content={
          <>
            <ty.BodyText>
              {activeUser
                ? `Logged in as ${activeUser.displayName}.`
                : 'Enter your pin below to log in.'}
            </ty.BodyText>
            {!activeUser && (
              <>
                <l.Flex justifyCenter mt={th.spacing.lg}>
                  <TextInput
                    autoFocus
                    onChange={(e) => setState({ error, pin: e.target.value })}
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
            )}
          </>
        }
        handleConfirm={activeUser ? handleLogout : handleLogin}
        onCancel={() => setState(initialState)}
        confirmDisabled={activeUser ? false : pin.length === 0}
        confirmText={activeUser ? `Logout` : 'Login'}
        triggerStyles={{ fontSize: th.fontSizes.caption }}
        triggerText={
          activeUser ? `Welcome, ${activeUser.displayName}` : 'Login'
        }
        triggerType="text"
      />
    </l.Div>
  );
};

export default Login;
