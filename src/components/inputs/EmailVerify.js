import React, { useEffect, useMemo, useState } from 'react';
import TextField from './TextField';
import { View } from 'components/layout/View';
import { Button } from './Button';
import { FormHelperText, InputAdornment, makeStyles } from '@material-ui/core';
import Text from 'components/outputs/Text';
import Modal from 'components/layout/Modal';
import ButtonList from 'components/lists/ButtonList';
import Image from 'components/outputs/Image';
import { createEmail, resendVerification } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import Spinner from 'components/outputs/Spinner';
import Status from 'components/outputs/Status';

export default function EmailVerify(props) {
  let {
    setFieldValue,
    values,
    error,
    helperText,
    context: { user, company, refreshUser },
    ...restProps
  } = props;
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [sentFirstMail, setSentFirstMail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [tempNewEmail, setTempNewEmail] = useState();
  const classes = useStyles();

  const email = values.email;
  const isEmailVerified = values.email_verification;

  const openModal = () => {
    if (!sentFirstMail) {
      if (!user.email) {
        // new email
        handleCreateEmail();
        setTempNewEmail(email);
      } else {
        handleResend();
      }
      setSentFirstMail(true);
    } else if (tempNewEmail !== email) {
      // new email updated
      handleCreateEmail();
      setTempNewEmail(email);
    }
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    if (!isEmailVerified && user?.verification?.email) {
      setFieldValue('email_verification', true);
      closeModal();
    }
  }, [user]);

  async function handleCreateEmail() {
    setLoadingResend(true);
    setErrorMessage(false);
    try {
      await createEmail({ email });
      showToast({
        variant: 'success',
        text:
          'Instructions on how to verify your email have been sent to ' + email,
      });
    } catch (e) {
      console.log(e);
      setErrorMessage(e?.message || "Couldn't send verification");
    }
    setLoadingResend(false);
  }

  async function handleResend() {
    setLoadingResend(true);
    try {
      await resendVerification('email', { email }, company?.id);
      showToast({
        variant: 'success',
        text:
          'Instructions on how to verify your email have been sent to ' + email,
      });
    } catch (e) {
      console.log(e);
    }
    setLoadingResend(false);
  }

  async function handleVerify() {
    setLoading(true);
    setErrorMessage(false);
    try {
      if (typeof refreshUser === 'function') {
        await refreshUser();
      }
    } catch (e) {
      console.log(e);
    }
    setErrorMessage('Email address has not been verified');
    setLoading(false);
  }

  return (
    <>
      <View mv={0.25} w={'100%'} fD="row">
        <TextField
          {...restProps}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <Spinner size={28} p={1} />
                ) : (
                  <div className={classes.row}>
                    {isEmailVerified ? (
                      <Status noWrap={false} uppercase>Verified</Status>
                    ) : (
                      <Button
                        noPadding
                        noMargin
                        variant="text"
                        size="small"
                        color="primary"
                        label="Verify"
                        loading={loading === 'submit'}
                        onClick={openModal}
                      />
                    )}
                  </div>
                )}
              </InputAdornment>
            ),
          }}
          disabled={Boolean(user.email)}
        />
      </View>

      <EmailVerifyModal
        email={email}
        showModal={showModal}
        closeModal={closeModal}
        loading={loading}
        handleResend={handleResend}
        handleVerify={handleVerify}
        errorMessage={errorMessage}
        loadingResend={loadingResend}
      />
    </>
  );
}

function EmailVerifyModal(props) {
  const {
    showModal,
    closeModal,
    email,
    handleResend,
    loading,
    handleVerify,
    errorMessage,
    loadingResend,
  } = props;

  return (
    <Modal maxWidth={415} open={showModal} disableBackdropClick>
      <View ph={1} pb={0.5} w={'100%'} aI={'center'}>
        <View mb={2} flex={1} aI={'center'}>
          <View mr={2} ml={0}>
            <Image width={100} src="email" />
          </View>
          <Text s={15} tA="center">
            We’ve sent an email to{' '}
            <Text c="primary" inline>
              {email}
            </Text>
            . Simply click the link to verify your email address.
          </Text>
          <Text s={15} style={{ marginTop: 16 }} tA="center">
            If you have not received an email, check your spam folder or click
            to resend.
          </Text>
        </View>
        {errorMessage && (
          <Text s={14} c="#FF3939" tA="center" style={{ marginBottom: 8 }}>
            {errorMessage}
          </Text>
        )}
        <ButtonList
          layout={'vertical'}
          items={[
            {
              id: 'I Have Verified',
              onPress: handleVerify,
              capitalize: true,
              wide: true,
              loading,
            },
            {
              id: 'close',
              variant: 'text',
              onPress: closeModal,
              disabled: loading,
            },
          ]}
        />
        <View fD="row" aI="center">
          <Text s={14} c="#9D9D9D">
            Did not receive the email?
          </Text>
          <Button
            onClick={handleResend}
            id="resend"
            variant="text"
            color="primary"
            loading={loadingResend}
          />
        </View>
      </View>
    </Modal>
  );
}
const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 4,
    minHeight: 44,
  },
}));
