import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import MenuIcon from './MenuIcon'; // need to keep it because of MenuIcon's css dependency
import { withStyles } from '@material-ui/core/styles';
import { ListItemText } from '@material-ui/core';
import Text from 'components/outputs/Text';
import { Link } from 'react-router-dom';
import Hover from 'components/layout/Hover';

class SubMenuItem extends Component {
  render() {
    const { item, parent, index, base, parsedUrl, classes } = this.props;
    const { pageId = '', screenId } = parsedUrl;

    let { id, label, icon, url } = item;
    if (!label) label = id;
    if (!icon) icon = id;

    const to =
      id === 'admin'
        ? '/' + parent + '_admin/'
        : base + '/' + parent + '/' + id + '/';
    const selected =
      pageId === id ||
      (pageId === '' && index === 0 && !id.includes('admin')) ||
      screenId === parent + '_admin' ||
      (screenId === parent + '_admin' && pageId);

    const myButton = itemProps =>
      React.forwardRef((props, ref) =>
        // <div role="button" {...props} ref={ref} />
        url ? (
          <a
            {...props}
            {...itemProps}
            target={'_blank'}
            href={url}
            rel="noreferrer"
            ref={ref}
          />
        ) : (
          <Link {...props} {...itemProps} to={to} ref={ref} />
        ),
      );
    return (
      <Hover
        style={{ width: '100%' }}
        render={hover => (
          <div className={classes.container}>
            <ListItem
              className={
                selected
                  ? classes.rowSelected
                  : hover
                  ? classes.rowHover
                  : classes.row
              }
              button
              component={myButton()}
              dense>
              <ListItemText
                inset
                primary={
                  <Text
                    bold={selected}
                    variant={'subtitle2'}
                    myColor={selected ? 'primary' : 'textPrimary'}
                    id={label}
                  />
                }
              />
            </ListItem>
          </div>
        )}
      />
    );
  }
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(0.5),
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    width: '100%',
    justifyContent: 'center',
  },
  rowSelected: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    fontWeight: '700',
    width: '100%',
    borderRadius: 20,
  },
  rowHover: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    backgroundColor: '#FAFAFA',
    width: '100%',
    justifyContent: 'center',
    borderRadius: 20,
  },
});

export default withStyles(styles)(SubMenuItem);
