import React from 'react';

import ErrorOutput from 'components/outputs/Error';
import LoginForm from './LoginForm';
import WalletCheckoutAccountSelector from './WalletCheckoutAccountSelector';

export default function WalletCheckoutLogin(props) {
  const { company, context, user, isAuthed, setUser } = props;

  return (
    <>
      {!company?.id ? (
        <ErrorOutput>Unable to connect company</ErrorOutput>
      ) : isAuthed ? (
        <WalletCheckoutAccountSelector
          {...props}
          isAuthed={isAuthed}
          user={user}
          setUser={setUser}
        />
      ) : (
        <LoginForm {...props} setUser={setUser} />
      )}
    </>
  );
}
