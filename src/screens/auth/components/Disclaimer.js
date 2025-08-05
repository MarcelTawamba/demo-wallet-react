import React, { useState, useEffect } from 'react';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';

import { useConfiguration } from 'components/contexts/ConfigurationContext';
import { Button } from 'components/inputs/Button';
import makeStyles from '@material-ui/styles/makeStyles';
import { isEmpty } from 'lodash';

export default function Disclaimer(props) {
  const { title, company } = props;
  let { id = '', name = '' } = company ?? {};
  if (!name) {
    name = standardizeString(id);
  }
  const [hidden, setHidden] = useState(false);
  const classes = useStyles();
  let { config: client } = useConfiguration();

  const [dismissed, setDismissed] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const tempDismissed = await localStorage.getItem('dismissedDisclaimer');
      setDismissed(JSON.parse(tempDismissed ?? '{}'));
      setLoading(false);
    }

    fetchData();
  }, []);

  function handleDismiss() {
    const tempDismissed = { ...(dismissed ?? {}), [id]: true };
    setDismissed(tempDismissed);
    const value = JSON.stringify(tempDismissed);
    localStorage.setItem('dismissedDisclaimer', value);
  }

  if (
    isEmpty(company) ||
    client?.company ||
    hidden ||
    dismissed?.[id] ||
    loading
  ) {
    return null;
  }
  return (
    <View p={1} style={{ maxWidth: 960 }}>
      {title && (
        <Text tA="center" s={14} p={0.25} c="#585858" fW="500">
          Who is managing my funds?
        </Text>
      )}
      <div className={classes.container}>
        <Text align="center" myColor="white">
          <Text bold="700" variant="body2" inline myColor="white">
            Important disclaimer:{' '}
          </Text>
          <Text variant="body2" inline myColor="white">
            {name +
              ' is powered by the Rehive App. All funds, activities and support queries are administered by ' +
              name +
              '. Rehive is not responsible for any possible loss of funds that may occur through mismanagement by ' +
              name +
              '.'}
          </Text>
        </Text>
        <Button label="ACCEPT" onPress={handleDismiss} color="#888" />
      </div>
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    [theme.breakpoints.down(560)]: {
      flexDirection: 'column',
    },
  },
}));
