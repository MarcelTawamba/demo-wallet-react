import React from 'react';
import moment from 'moment';
import { makeStyles } from '@material-ui/styles';

import { get } from 'lodash';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useTheme } from 'components/app/context';
import Overlays from 'components/outputs/Overlays';

export default function ChiplessCard(props) {
  const { item, currency } = props;
  const { colors } = useTheme();

  const classes = useStyles();
  const { id, account, created } = item;

  return (
    <div className={classes.container}>
      <Overlays variant={'chiplessCard'} width={400} />
      <div className={classes.card}>
        <Text myColor="primaryContrast" bold>
          {get(currency, ['currency', 'code'])}
        </Text>
        <Text
          variant="h4"
          myColor="primaryContrast"
          bold
          style={{ paddingTop: 16 }}>
          {account}
        </Text>
        <div className={classes.date}>
          <Text myColor="primaryContrast" align="right">
            Created
          </Text>
          <Text myColor="primaryContrast" bold align="right">
            {moment(created).format('YY/MM/DD')}
          </Text>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    borderRadius: 20,
    maxWidth: 330,
    height: 180,
    maxHeight: 180,
    backgroundColor: theme.palette.primary.main,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    // paddingTop: theme.spacing(2),
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
    height: '100%',
  },
  date: {
    width: '100%',
  },
}));
