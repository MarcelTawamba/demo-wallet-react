import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

const Tab = ({
  label,
  id,
  title,
  state,
  onChange,
  value,
  classes,
  variant,
  ...props
}) => {
  const selected = state === (value ?? id);
  return (
    <div className={classes.tab}>
      <button
        variant={'text'}
        style={{
          border: 'none',
          marginLeft: 0,
          paddingLeft: 0,
          backgroundColor: 'transparent',
          cursor: 'pointer',
          outline: 'none',
        }}
        noPadding
        color={variant && !selected ? 'font' : 'primary'}
        onClick={e => {
          e.preventDefault();
          onChange(value ?? id);
        }}>
        <Text
          style={{
            fontWeight: selected ? '500' : 'normal',
            whiteSpace: 'nowrap',
          }}
          align={'center'}
          color={variant && !selected ? 'font' : 'primary'}>
          {props.isNumberedTab && (
            <span className={classes.tabNumber} style={{ marginRight: 8 }}>
              {props.tabNumber}
            </span>
          )}
          <Text
            id={label ?? title}
            inline
            color={variant && !selected ? 'font' : 'primary'}
            style={{ textDecorationLine: selected ? 'underline' : 'none' }}
          />
        </Text>
      </button>
    </div>
  );
};

const styles = theme => ({
  tab: {
    marginRight: 32,
    minWidth: 80,
    [theme.breakpoints.down(736)]: {
      marginRight: theme.spacing(2),
      width: 'auto',
    },
    border: 'none',
  },
  tabNumber: {
    // marginRight: 8,
    border: '2px solid',
    borderRadius: '50%',
    padding: '1px 5px',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600,
  },
});

const Tabs = ({ tabs, variant, tabSpaceBetween, ...restProps }) => {
  return (
    <View
      fD={'row'}
      h={32}
      aI={'flex-end'}
      w={tabSpaceBetween ? '100%' : 'auto'}
      jC={tabSpaceBetween ? 'space-between' : 'flex-start'}>
      {tabs.map((tab, tabIndex) => (
        <Tab
          key={tab?.value ?? tab?.id}
          variant={variant}
          {...tab}
          {...restProps}
          tabNumber={tabIndex + 1}
        />
      ))}
    </View>
  );
};

export default withStyles(styles)(Tabs);
