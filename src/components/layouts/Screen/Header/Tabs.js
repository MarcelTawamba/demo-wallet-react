import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';

function generateNewUrl({ paths, id, defaultTab, screenId }) {
  if (!defaultTab) defaultTab = screenId;
  if (!paths || paths.length < 3) {
    return '/' + screenId + '/';
  }
  let newPathname = '/' + screenId + '/';
  if (id === defaultTab || id === '') {
    return newPathname;
  } else {
    if (paths.length === 3) {
      paths[2] = id;
    } else if (paths.length > 3) {
      paths[2] = id;
    }
    newPathname = paths.join('/');
    if (paths.length < 4) {
      newPathname = newPathname + '/';
    }
  }
  return newPathname;
}

const Tab = props => {
  const {
    label,
    title,
    id,
    classes,
    defaultTab,
    screenId,
    history,
    value,
    tabId,
  } = props;
  let paths = history?.location?.pathname.split('/') ?? [];
  const state = tabId ? tabId : paths?.[2];

  const selected = state === id || state === value;
  function handleChange() {
    let newPathname = generateNewUrl({
      paths,
      id: id ?? value,
      defaultTab,
      screenId,
    });
    history.push(newPathname);
  }
  return (
    <button className={classes.tab} onClick={handleChange}>
      <Text
        align={'center'}
        c={selected ? 'primary' : '#777777'}
        bold={selected}
        style={{ fontSize: 16 }}
        id={title ?? label}
      />
    </button>
  );
};

const styles = theme => ({
  tab: {
    marginRight: theme.spacing(8),
    width: 80,
    [theme.breakpoints.down(736)]: {
      marginRight: theme.spacing(2),
      width: 'auto',
    },

    borderWidth: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    border: 'none',
    outlineColor: 'transparent',
  },
});

const Tabs = props => {
  const { tabs, ...restProps } = props;
  return (
    <View fD={'row'} aI={'flex-end'} w={'auto'}>
      {tabs?.map(tab => (
        <Tab key={tab.value ?? tab.id ?? tab} {...tab} {...restProps} />
      ))}
    </View>
  );
};

export default withStyles(styles)(Tabs);
