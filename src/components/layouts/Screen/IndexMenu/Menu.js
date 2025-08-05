import React, { useMemo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ListItem, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme as useThemeMui } from '@material-ui/core/styles';
import { userTiersSelector } from 'screens/accounts/redux/selectors';
import Icon from 'components/outputs/NewIcon';
import { Button } from 'components/inputs/Button';
import Text from 'components/outputs/Text';
import { useTheme } from 'components/app/context';

export default function Menu(props) {
  const { sections, pageId, setPage, banner: Banner } = props;

  const { colors } = useTheme();
  const tiers = useSelector(userTiersSelector);

  const theme = useThemeMui();
  const horizontal = useMediaQuery(theme.breakpoints.down(950));
  const classes = useStyles();

  function renderSection(section = {}, index) {
    const { id, menuTitleId, icon = id, condition, children } = section;

    const selected = id === pageId || Boolean(children?.[pageId]);

    return (
      <div className={classes.container}>
        <div className={classes.icon}>
          <Icon
            name={icon}
            backgroundColor={selected ? colors.primary : '#EFEFEF'}
            color={selected ? colors.primaryContrast : '#BEBEBE'}
            size={20}
          />
        </div>
        <Text
          id={menuTitleId || id}
          className={classes.text}
          style={{
            fontSize: 14,
            fontWeight: '500',
            color: selected ? colors.primary : '#BEBEBE',
          }}
        />
      </div>
    );
  }

  const filteredSections = useMemo(() =>
    sections.filter(
      (section, index) =>
        !(typeof section?.condition === 'function'
          ? section?.condition({ ...props, tiers })
          : section?.condition ?? false),
      sections,
    ),
  );

  const [init, setInit] = useState(false);

  useEffect(() => {
    if (!init) {
      const index = filteredSections.findIndex(
        item => item.id === pageId || Boolean(item?.children?.[pageId]),
      );
      if (index === -1 && filteredSections?.length > 0)
        setPage(filteredSections?.[0]?.id);
    }
    setInit(true);
  }, [filteredSections, pageId]);

  return (
    <React.Fragment>
      {typeof Banner === 'function' && <Banner />}
      {horizontal ? (
        <div className={classes.horizontal}>
          {filteredSections.map((section, index) => (
            <ListItem
              // button
              key={section?.id ?? section}
              disableGutters
              onClick={() => setPage(section?.id ?? section)}>
              {renderSection(section, index)}
            </ListItem>
          ))}
        </div>
      ) : (
        filteredSections.map((section, index) =>
          section.variant === 'button' ? (
            <Button
              color={'primary'}
              variant={'contained'}
              label={section.title}
              borderRadius={5}
              onPress={() => setPage(section?.id ?? section)}
              wide
            />
          ) : (
            <ListItem
              // button
              key={section?.id ?? section}
              disableGutters
              onClick={() => setPage(section?.id ?? section)}>
              {renderSection(section, index)}
            </ListItem>
          ),
        )
      )}
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.down(670)]: {
      // justifyContent: 'space-evenly',
      overflowX: 'scroll',
      paddingBottom: 0,
    },
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    padding: theme.spacing(0.5),
    paddingLeft: 0,
    marginRight: 5,
    [theme.breakpoints.down(950)]: {
      flexDirection: 'column',
      textAlign: 'center',
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      // margin: 'auto',
    },
    [theme.breakpoints.down(480)]: {
      padding: theme.spacing(0.5),
    },
  },
  icon: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down(950)]: {
      marginRight: 0,
      marginBottom: theme.spacing(0.5),
    },
    [theme.breakpoints.down(670)]: {
      marginBottom: theme.spacing(0.5),
    },
  },
  text: {
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down(670)]: {
      display: 'none',
    },
  },
}));
