/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import { companiesSelector } from 'redux/auth/selectors';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import { resendMobileVerification } from 'util/rehive';
import { useToast } from 'components/contexts/ToastContext';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import TextField from 'components/inputs/TextField';
import MobileInput from './MobileInput';

export default function MobileVerification(props) {
  const { existing, value, onChange, name } = props;

  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState(existing);
  const [otp, setOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  const { currentCompany } = useSelector(companiesSelector);
  const { showToast } = useToast();
  useEffect(() => {
    if (onChange) onChange({ mobile, otp, verifyStep: step === 1 });
  }, [mobile, otp]);

  useEffect(() => {
    setStep(value?.verifyStep ? 1 : 0);
  }, [value]);

  async function resendOTP() {
    setLoading(true);
    await resendMobileVerification(mobile, currentCompany?.id);
    showToast({
      text: `An SMS containing an OTP has been resent to ${mobile}`,
    });
    setLoading(false);
  }
  const isRtl = document.dir === 'rtl';

  return (
    <View>
      {step === 0 ? (
        <MobileInput
          existing={mobile}
          onChange={value => setMobile(value)}
          required={props.required}
          helperText={props?.formikProps?.errors?.[name]}
        />
      ) : (
        <>
          <Button
            label="back"
            variant={'link'}
            className={classes.backButton}
            children={
              <View flex={1} fD={'row'} aI={'center'}>
                <Icon
                  icon={isRtl ? 'arrowright' : 'arrowleft'}
                  circled={false}
                  color={'#707070'}
                />
                <Text
                  id="back"
                  style={{
                    lineHeight: 0,
                    paddingRight: '0.5rem',
                    marginLeft: '0.5rem',
                  }}
                />
              </View>
            }
            onPress={() => setStep(0)}
          />
          <View w={'100%'} mt={1}>
            <Text
              style={{ textAlign: 'center' }}
              id="mfa_sms_verification"
              context={{ mobile }}
            />
            {/* <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                fontWeight: 500,
                marginTop: '0.5rem',
                marginBottom: '1rem',
              }}
              myColor={'primary'}>
              {mobile}
            </Text> */}
            <TextField
              margin="dense"
              autoComplete="off"
              variant={'outlined'}
              label={'OTP'}
              fullWidth
              style={{ textAlign: 'center' }}
              onChange={event => setOTP(event.target.value)}
            />
            <View
              flex={1}
              fD={'row'}
              aI={'center'}
              mt={0.5}
              w={'100%'}
              jC={'center'}>
              <Text
                width={'fit-content'}
                style={{
                  textAlign: 'center',
                  color: '#9D9D9D',
                }}
                id="did_not_receive_the_code"
              />
              <Button
                id="resend"
                onPress={() => resendOTP()}
                variant={'text'}
                color={'primary'}
                style={{ fontSize: 16 }}
                loading={loading}
                wrapperStyle={{
                  fontWeight: 500,
                }}
              />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  backButton: {
    marginLeft: '-0.5rem',
    padding: 0,
    '&:focus': { outline: 'none' },
  },
}));
