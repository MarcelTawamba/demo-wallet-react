import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { useTranslation } from 'react-i18next';

const styles = theme => ({
  root: {
    width: '100%',
    minWidth: 300,
    maxWidth: 600,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
  },
  checkbox: {
    padding: 0,
    paddingRight: theme.spacing(1),
    margin: 0,
  },
});

function CheckboxList({ classes, filters }) {
  const { t } = useTranslation(['common']);
  const [checked, sateChecked] = useState([0]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    sateChecked(newChecked);
  };

  return (
    <List
      className={classes.root}
      subheader={<ListSubheader component="div">{t('filters')}</ListSubheader>}>
      {filters.map(filter => (
        <ListItem
          key={filter.label}
          role={undefined}
          dense
          button
          onClick={filter.onClick}>
          <Checkbox
            classes={{ root: classes.checkbox }}
            dense
            checked={filter.value}
            tabIndex={-1}
            disableRipple
          />
          <ListItemText primary={t(filter.label)} />
        </ListItem>
      ))}
    </List>
  );
}

CheckboxList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckboxList);
