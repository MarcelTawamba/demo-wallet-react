import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

const Tab = ({ label, state, onChange, value, classes }) => {
  return (
    <div className={classes.tab}>
      <Button
        variant={'text'}
        style={{ borderRadius: 3 }}
        noPadding
        color={'primary'}
        onClick={() => onChange(value)}>
        <Text
          style={{
            fontWeight: state === value ? 'bold' : 'normal',
            whiteSpace: 'nowrap',
          }}
          align={'center'}
          color={'primary'}>
          {label}
        </Text>
      </Button>
    </div>
  );
};

const styles = theme => ({
  tab: {
    marginRight: 32,
    width: 80,
    [theme.breakpoints.down(736)]: {
      marginRight: theme.spacing(2),
      width: 'auto',
    },
  },
});

const Tabs = ({ tabs, ...restProps }) => {
  return (
    <View fD={'row'} h={32} aI={'flex-end'} w={'auto'}>
      {tabs?.map(tab => (
        <Tab key={tab.value} {...tab} {...restProps} />
      ))}
    </View>
  );
};

export default withStyles(styles)(Tabs);
