import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';

function generateNewUrl({ paths, id, defaultTab, screenId }) {
  if (!defaultTab) defaultTab = screenId;
  if (!paths || paths.length < 3) {
    return '/' + screenId + '/';
  }
  let newPathname = '/' + screenId + '/';
  if (id === defaultTab || id === '') {
    return newPathname;
  } else {
    newPathname = newPathname + id + '/';
    // if (paths.length === 3) {
    //   paths[2] = id;
    // } else if (paths.length > 3) {
    //   paths[2] = id;
    // }
    // newPathname = paths.join('/');
    // if (paths.length < 4) {
    //   newPathname = newPathname + '/';
    // }
  }
  return newPathname;
}

const Tab = props => {
  const {
    label,
    title,
    id,
    defaultTab,
    screenId,
    history,
    value,
    locales,
    tabId = '',
  } = props;

  let paths = history?.location?.pathname.split('/') ?? [];

  const selected = tabId === id || tabId === value;
  const classes = useStyles({ selected });
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
        id={label ?? title}
        color={selected ? 'primary' : 'font'}
        bold={selected}
        className={classes.tabLabel}
      />
    </button>
  );
};

const useStyles = makeStyles(theme => ({
  tab: {
    marginRight: 32,
    // width: 80,
    [theme.breakpoints.down(736)]: {
      marginRight: theme.spacing(2),
      width: 'auto',
    },
    paddingLeft: 0,
    borderWidth: 0,
    cursor: 'pointer',
    backgroundColor: 'transparent',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    border: 'none',
    outlineColor: 'transparent',
    textDecoration: ({ selected }) =>
      selected ? `underline ${theme.palette.primary.main}` : 'none',
  },
}));

export default function Tabs(props) {
  const { tabs, ...restProps } = props;

  return (
    <>
      {tabs.map(tab => (
        <Tab key={tab.value ?? tab.id ?? tab} {...tab} {...restProps} />
      ))}
    </>
  );
}
