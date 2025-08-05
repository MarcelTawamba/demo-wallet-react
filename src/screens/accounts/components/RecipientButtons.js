import React, { useEffect } from 'react';
import { get, remove } from 'lodash';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import { makeStyles } from '@material-ui/core/styles';

export default function RecipientButtons(props) {
  const classes = useStyles();

  const {
    formikProps,
    currency,
    handleRecipientButtonPress,
    actionsConfig,
    action,
    hideCrypto = false,
    showMobile = true,
    isCrypto,
  } = props;
  const { values, setFieldValue } = formikProps;
  const { recipientType } = values;

  let recipientConfig = get(
    actionsConfig,
    [action, 'config', 'recipient'],
    ['email', 'mobile', 'crypto'],
  );

  if (recipientConfig.length === 0) {
    recipientConfig = ['email', 'mobile', 'crypto'];
  }

  let showCrypto = false;
  let showEmail = true;

  if (isCrypto) {
    const hideCurrencies = get(
      actionsConfig,
      ['withdraw', 'condition', 'hideCurrency'],
      [],
    ).map(x => x.toLowerCase());

    if (hideCurrencies.includes(currency?.currency?.code.toLowerCase()))
      remove(recipientConfig, 'crypto');
  }

  const onPress = handleRecipientButtonPress
    ? value => handleRecipientButtonPress(value, formikProps)
    : value => setFieldValue('recipientType', value);

  if (!(isCrypto && !hideCrypto) && !showMobile) {
    return null;
  }

  return (
    <View
      fD={'row'}
      jC={'space-between'}
      aI="center"
      w={'100%'}
      pt={0.25}
      pb={1}
      // pt={reducePadding ? 0.25 : 1}
      // pb={reducePadding ? 1 : 1.25}
      // pb={0.75}
    >
      {recipientConfig.includes('email') && (
        <div className={classes.emailButton}>
          <Button
            noPadding
            color={'primary'}
            variant={recipientType === 'email' ? 'contained' : 'outlined'}
            onPress={() => onPress('email')}
            id="email"
            size="small"
            wide
            capitalize
          />
        </div>
      )}
      {recipientConfig.includes('mobile') && showMobile && (
        <div className={classes.mobileButton}>
          <Button
            noPadding
            color={'primary'}
            variant={recipientType === 'mobile' ? 'contained' : 'outlined'}
            onPress={() => onPress('mobile')}
            id="mobile"
            size="small"
            capitalize
            wide
          />
        </div>
      )}
      {recipientConfig.includes('crypto') && isCrypto && !hideCrypto && (
        <div className={classes.cryptoButton}>
          <Button
            noPadding
            color={'primary'}
            variant={recipientType === 'crypto' ? 'contained' : 'outlined'}
            onPress={() => onPress('crypto')}
            id="crypto"
            size="small"
            capitalize
            wide
          />
        </div>
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  cryptoButton: { flex: 1, paddingLeft: 24 },
  mobileButton: { flex: 1, paddingHorizontal: 12 },
  emailButton: { flex: 1, paddingRight: 24 },
}));
