import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import { useState } from 'react';
import Modal from 'components/layout/Modal';
import { get } from 'lodash';
import CryptoCheckoutPlaceholder from './images/CryptoCheckoutPlaceholder';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';

const modalConfig = [
  {
    title: 'Double check the crypto address and amount',
    description: (
      <Text align="center">
        If you send an incorrect amount or currency, your transaction will{' '}
        <b>not be processed</b> and if you send to the wrong address,{' '}
        <b>your funds will be lost</b>
      </Text>
    ),
  },
  // {
  //   title: 'Send the exact cryptocurrency amount',
  //   description: (
  //     <Text align="center">
  //       Please send the correct amount. If you send the incorrect amount, your
  //       transaction will not get processed.
  //     </Text>
  //   ),
  // },
];

export default function CryptoCheckoutWarningModal(props) {
  const { invoice } = props;

  const classes = useStyles(props);
  // const colors = get(
  //   //TODO:
  //   invoice,
  //   ['metadata', 'service_business', 'business', 'colors'],
  //   {
  //     primary: '#56E',
  //     secondary: '#AAE',

  //     primaryContrast: '#EEE',
  //     secondaryContrast: '#FFF',
  //   },
  // );

  const [modalIndex, setModalIndex] = useState(0);

  const modalPage = get(modalConfig, modalIndex);
  if (!modalPage) {
    return null;
  }
  const { title, description } = modalPage;

  return (
    <Modal
      maxWidth={350}
      close
      open={modalIndex < modalConfig.length}
      onDismiss={() => setModalIndex(modalIndex + 1)}>
      <div className={classes.container}>
        {/* <CryptoCheckoutPlaceholder width={150} height={150} colors={colors} /> */}
        <div className={classes.inner}>
          <Text
            align="center"
            className={classes.title}
            color="primary"
            bold
            variant="h6">
            {title}
          </Text>
          {description}
        </div>

        <Button
          label="I UNDERSTAND"
          color="primary"
          onPress={() => setModalIndex(modalIndex + 1)}
          wide
        />
      </div>
    </Modal>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  title: {
    paddingBottom: theme.spacing(2),
  },
  inner: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}));
