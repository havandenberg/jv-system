import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

import api from 'api';
import b from 'ui/button';
import TextInput from 'ui/input';
import l from 'ui/layout';
import th from 'ui/theme';
import ty from 'ui/typography';

import { useUserContext } from './context';

interface State {
  confirmNewPin: string;
  newPin: string;
}

const initialState = {
  confirmNewPin: '',
  newPin: '',
};

const UserSettings = () => {
  const [userState] = useUserContext();
  const { activeUserId } = userState;
  const { data: activeUser } = api.useGetUser(activeUserId || 0);

  const [state, setState] = useState<State>(initialState);
  const { confirmNewPin, newPin } = state;
  const { id } = activeUser?.personContact || {};

  const isValid = newPin && confirmNewPin && newPin === confirmNewPin;

  const [handleUpdate, { loading, error }] = api.useUpdateUser(
    activeUser ? id : -1,
  );

  const handleUpdatePin = () => {
    if (isValid) {
      handleUpdate({
        variables: {
          updates: { pin: newPin },
          id: activeUser?.id || -1,
        },
      }).then(() => setState(initialState));
    }
  };

  return (
    <>
      {(!isValid || error) && newPin && confirmNewPin ? (
        <ty.BodyText center color={th.colors.status.error} mt={th.spacing.md}>
          {error
            ? 'An error occurred, please try again later'
            : 'Pins must match.'}
        </ty.BodyText>
      ) : (
        <l.Div height={22} />
      )}
      <ty.CaptionText secondary mb={th.spacing.sm}>
        New Pin
      </ty.CaptionText>
      <TextInput
        onChange={(e) => {
          setState({ ...state, newPin: e.target.value });
        }}
        type="password"
        value={newPin}
      />
      <ty.CaptionText secondary mb={th.spacing.sm} mt={th.spacing.lg}>
        Confirm New Pin
      </ty.CaptionText>
      <TextInput
        onChange={(e) => {
          setState({ ...state, confirmNewPin: e.target.value });
        }}
        type="password"
        value={confirmNewPin}
      />
      <b.Primary
        disabled={!newPin || !isValid}
        mt={th.spacing.xl}
        onClick={handleUpdatePin}
      >
        {loading ? (
          <l.Flex alignCenter justifyCenter>
            <ClipLoader color={th.colors.brand.secondary} size={th.sizes.xs} />
          </l.Flex>
        ) : (
          'Update Pin'
        )}
      </b.Primary>
    </>
  );
};

export default UserSettings;
