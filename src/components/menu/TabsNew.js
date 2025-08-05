import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';

const Tab = props => {
  const {
    label,
    title,
    id,
    onChange,
    value,
    tabId = '',
    withUnderlineDecoration = true, // selected tab text decoration
  } = props;

  const selected = tabId === id || tabId === value;
  const classes = useStyles({ selected, withUnderlineDecoration });
  function handleChange(e) {
    e.preventDefault();
    onChange(value);
  }
  return (
    <button className={classes.tab} onClick={handleChange}>
      <Text
        color={selected ? 'primary' : 'font'}
        bold={selected}
        className={classes.tabLabel}
        id={label ?? title}
      />
    </button>
  );
};

const useStyles = makeStyles(theme => ({
  tab: {
    marginRight: 32,
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
    textDecoration: ({ selected, withUnderlineDecoration }) =>
      selected && withUnderlineDecoration
        ? `underline ${theme.palette.primary.main}`
        : 'none',
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default function Tabs(props) {
  const { tabs, ...restProps } = props;
  const classes = useStyles();

  return (
    <div className={classes.tabs}>
      {tabs.map(tab => (
        <Tab key={tab.value ?? tab.id ?? tab} {...tab} {...restProps} />
      ))}
    </div>
  );
}
