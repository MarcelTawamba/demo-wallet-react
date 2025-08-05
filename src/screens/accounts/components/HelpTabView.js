import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { useTheme } from 'components/app/context';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.palette.primary.main,
    color: '#ffffff',
    borderRadius: 26,
    padding: 0,
    height: 32,
    minHeight: 32,
    fontSize: 14,
    textTransform: 'none',
    [theme.breakpoints.down(736)]: {
      padding: '0 12px',
      margin: '0 8px',
    },
  },
  inactiveTab: {
    color: '#A3A3A3',
    padding: 0,
    height: 28,
    minHeight: 28,
    fontSize: 14,
    textTransform: 'none',
    [theme.breakpoints.down(736)]: {
      padding: '0 16px',
      margin: '0 8px',
    },
  },
}));

export default function HelpTabView({ dataList = [], ...restProps }) {
  const { colors } = useTheme();
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (dataList.length === 0) return null;

  return (
    <div className={classes.root}>
      <Tabs
        className={classes.tabs}
        value={tabIndex}
        onChange={handleChange}
        TabIndicatorProps={{ style: { display: 'none' } }}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="simple tabs example">
        {dataList.map((dataItem, index) => (
          <Tab
            label={dataItem.tabName}
            className={
              tabIndex === index ? classes.activeTab : classes.inactiveTab
            }
          />
        ))}
      </Tabs>
      {dataList.map((dataItem, index) => (
        <div
          key={index}
          value={tabIndex}
          index={index}
          role="tabpanel"
          hidden={tabIndex !== index}
          id={`simple-tabpanel-${index}`}
          style={{ marginTop: 8 }}
          aria-labelledby={`simple-tab-${index}`}>
          {tabIndex === index &&
            dataItem.items.map((item, itemIndex) => (
              <View key={itemIndex} p={0.5}>
                <Text s={18} bold>
                  {item.title}
                </Text>
                <Text c="#777777" style={{ marginTop: 6 }}>
                  {item.description}
                </Text>
              </View>
            ))}
        </div>
      ))}
    </div>
  );
}

HelpTabView.propTypes = {
  dataList: PropTypes.array.isRequired,
};
