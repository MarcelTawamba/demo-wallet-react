import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import { getName } from 'country-list';
import { View } from 'components/layout/View';

const useStyles = makeStyles(theme => ({
  text: { fontSize: 13, color: '#393939', paddingBottom: theme.spacing(1) },
}));

function AddressDetails({ address }) {
  const classes = useStyles();

  if (typeof address === 'string') {
    return (
      <View grid gap={0.5} mt={0.75}>
        {address?.split(',')?.map((x, index) => (
          <Text key={index} className={classes.text}>
            {x}
          </Text>
        ))}
      </View>
    );
  } else if (typeof address === 'object') {
    const { line_1, line_2, state_province, postal_code, country, city } =
      address;
    return (
      <View mt={0.5}>
        {Boolean(line_1) && <Text className={classes.text}>{line_1}</Text>}
        {Boolean(line_2) && <Text className={classes.text}>{line_2}</Text>}
        {Boolean(city) && <Text className={classes.text}>{city}</Text>}
        {Boolean(state_province) && (
          <Text className={classes.text}>{state_province}</Text>
        )}
        {Boolean(postal_code) && (
          <Text className={classes.text}>{postal_code}</Text>
        )}
        {Boolean(country) && (
          <Text className={classes.text}>{getName(country)}</Text>
        )}
      </View>
    );
  } else {
    return null;
  }
}

export default AddressDetails;
