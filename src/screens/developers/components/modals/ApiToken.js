import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PageContent from 'components/layout/page/PageContent';
import { formatTime } from 'util/general';
import OutputList from 'components/lists/OutputList';
import Text from 'components/outputs/Text';
import MfaVerify from '../MfaVerify';

export default function ApiToken(props) {
  const { item, context, onDismiss, setModal, history, showToast, onSuccess } =
    props;
  const { token, challenges } = item;
  const { expires } =
    context?.data?.find(i => item?.token.slice(0, 8) === i.token_key) ?? {};
  let outputItems = [
    {
      label: 'token',
      value: token,
    },
  ];
  outputItems.push({
    label: 'expires',
    value: expires ? formatTime(expires) : 'Permanent token',
  });

  const [verified, setVerified] = useState(false);

  const showChallenge = !verified && challenges?.length > 0;
  const activeChallenge = challenges?.[0];

  return (
    <PageContent horizontal={4} pt={2}>
      {showChallenge ? (
        <MfaVerify
          mfa="required"
          token={token}
          activeChallenge={activeChallenge}
          onSuccess={async () => {
            onSuccess && (await onSuccess());
            showToast({ id: 'token_add_success', variant: 'success' });
            setModal({
              id: 'verified_token',
              item: item,
              title: 'New api token',
            });
            setVerified(true);
            history.push('/developers/api_tokens/');
          }}
          onBack={onDismiss}
          noCancel={true}
        />
      ) : (
        <>
          <Text id="store_token_secure_message" />
          <OutputList items={outputItems} />
        </>
      )}
    </PageContent>
  );
}

const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    paddingBottom: theme.spacing(3),
  },
  buttons: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));
