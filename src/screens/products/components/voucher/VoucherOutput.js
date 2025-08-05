import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import QR from 'components/outputs/QR';
import { View } from 'components/layout/View';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    // padding: theme.spacing(2),
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // height: 180,
    // height: props => (props.small ? 120 : 240),
  },
  qrcode: {
    // height: 180,
    // height: props => (props.small ? 120 : 200),
  },
}));

export default function VoucherOutput(props) {
  const { item } = props;
  const { code } = item;

  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <QR>{code}</QR>
      <Text
        color={'primary'}
        style={{ fontSize: 24, fontWeight: '600' }}
        align={'center'}>
        {code}
      </Text>
    </div>
  );
}

VoucherOutput.propTypes = {};

VoucherOutput.defaultProps = {};
