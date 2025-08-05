import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactToPrint from 'react-to-print';

import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import Text from 'components/outputs/Text';
import OutputList from 'components/lists/OutputList';
import { View } from 'components/layout/View';

import QR from 'components/outputs/QR';
import { generateReceive } from 'screens/accounts/util/receive';
import IconButton from 'components/inputs/IconButton';

import { standardizeString } from 'util/general';
import Icon from 'components/outputs/Icon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import RecipientButtons from '../RecipientButtons';
import Info from 'components/outputs/Info';
import { SimpleImg } from 'react-simple-img';
import ReceiveLoading from './ReceiveLoading';
import { checkIfStellar } from 'util/crypto';
import CryptoDepositForm from './CryptoDepositForm';

export default function ReceiveQR(props) {
  const {
    formikProps,
    crypto,
    currency,
    showToast,
    rates,
    services,
    profile,
    setFormState,
    refPrint,
    actionsConfig,
    handleRecipientButtonPress,
    isCrypto,
    isLoading,
  } = props;
  const { values, setFieldValue } = formikProps;

  const isBridgeCurrency = currency?.metadata?.native_context?.bridge === true || currency?.metadata?.bridge === true;

  const { items } = profile;
  const { first_name, last_name, profile: profileImage, email } = items;
  const { amount, recipientType } = values;

  const { receiveQRString, receiveUrl, sentenceString, outputItems, address } =
    generateReceive({
      services,
      rates,
      currency,
      values,
      crypto,
    });

  let config = actionsConfig?.receive?.config;

  let {
    recipient: recipientConfig = ['email', 'mobile', 'crypto'],
    showRecipientButtonsQr = false,
    showCryptoDefault,
  } = config;
  if (recipientConfig?.length === 0) {
    recipientConfig = ['email', 'mobile', 'crypto'];
  }

  useEffect(() => {
    if (
      currency?.crypto &&
      crypto?.[currency?.crypto?.blockchain] &&
      recipientConfig.includes('crypto') &&
      showCryptoDefault
    ) {
      if (handleRecipientButtonPress) {
        handleRecipientButtonPress('crypto', formikProps);
      } else {
        setFieldValue('recipientType', 'crypto');
      }
    }
  }, [currency?.crypto]);

  const isStellar = checkIfStellar(currency);

  const shareUrl = window.location.origin + '/receive' + receiveUrl;

  const actions = [
    ...(!(isBridgeCurrency && recipientType === 'crypto') ? [{
      id: 'print',
      icon: 'print',
      refPrint,
      // onPress: () => this.setState({ shareModalVisible: true }),
    }] : []),
    {
      id: 'edit',
      icon: 'edit',
      onPress: () => setFormState(''),
    },
  ];

  return (
    <React.Fragment>
      <PageTitle
        align="center"
        titleId="receive"
        handleBack={() => setFormState('')}
        actions={<ActionList items={actions} />}
      />
      {isLoading ? (
        <ReceiveLoading />
      ) : (
        <PageContent footer>
          {showRecipientButtonsQr && (
            <RecipientButtons
              showMobile={profile.items.mobile}
              formikProps={formikProps}
              action={'receive'}
              actionsConfig={actionsConfig}
              currency={currency}
              crypto={crypto}
              isCrypto={isCrypto}
              reducePadding
            />
          )}
          
          {isBridgeCurrency && recipientType === 'crypto' ? (
            <CryptoDepositForm {...props} />
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
              ref={refPrint}>
              <View
                style={{
                  height: 120,
                  width: 120,
                  borderRadius: 120,
                  marginLeft: 24,
                  marginRight: 24,
                  marginBottom: 24,
                  marginTop: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {Boolean(profileImage) ? (
                  <SimpleImg
                    style={{
                      maxHeight: 120,
                      maxWidth: 120,
                      borderRadius: 120,
                    }}
                    imgStyle={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    alt="profile"
                    src={profileImage}
                  />
                ) : (
                  <AccountCircleIcon
                    style={{ 
                      fontSize: 120, 
                      color: '#E0E0E0' 
                    }}
                  />
                )}
              </View>
              
              {(first_name || last_name) && (
                <Text variant="h6" align={'center'} bold>
                  {[first_name, last_name].filter(Boolean).join(' ')}
                </Text>
              )}

              {amount ? (
                <View p={1} w={'100%'} pb={0.75}>
                  <Text variant="h4" align={'center'} bold color="primary">
                    {sentenceString}
                  </Text>
                </View>
              ) : recipientType !== 'crypto' ? (
                <View p={1} w={'100%'} pb={0.75}>
                  <Text align={'center'} opacity={0.7}>
                    {address}
                  </Text>
                </View>
              ) : (
                <View p={0.25} />
              )}
              <View aI={'center'} w={'100%'} pb={0.5}>
                <QR showToast={showToast}>{receiveQRString}</QR>
              </View>

              {isStellar ? (
                <Info noMargin variant="warning" id="receive_isStellar_warning" />
              ) : (
                <Text align={'center'} id="scan_qr_code_to_pay" />
              )}
              {recipientType === 'crypto' ? (
                <View
                  aI={'flex-start'}
                  w={'100%'}
                  pv={0.5}
                  style={{ maxWidth: 600 }}>
                  <OutputList
                    items={outputItems}
                    outputProps={{
                      align: 'left',
                    }}
                  />
                </View>
              ) : Boolean(sentenceString) ? (
                <View p={1} w={'100%'}>
                  <Text align={'center'} opacity={0.7}>
                    {address}
                  </Text>
                </View>
              ) : null}
            </div>
          )}
        </PageContent>
      )}
    </React.Fragment>
  );
}

function ActionList(props) {
  const { items } = props;
  const classes = useStyles(props);
  return (
    <>
      {items.map(({ id, icon, refPrint, onPress }) =>
        icon === 'print' && refPrint && refPrint.current ? (
          <ReactToPrint
            key={id}
            trigger={() => (
              <IconButton
                tooltip={'print'}
                style={{ padding: 4, margin: 4 }}>
                <Icon icon={icon} color={'primary'} inverted size={20} />
              </IconButton>
            )}
            content={() => refPrint.current}
          />
        ) : (
          <IconButton
            key={id}
            style={{ padding: 4, margin: 4 }}
            tooltip={standardizeString(id)}
            onClick={onPress}>
            <Icon icon={icon} color={'primary'} inverted size={20} />
          </IconButton>
        ),
      )}
    </>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    right: 30,
  },
}));
