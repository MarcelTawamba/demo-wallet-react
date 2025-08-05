import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import IconButton from 'components/inputs/IconButton';

class ActionList extends React.Component {
  state = { anchorEl: null, index: 0 };

  handleClick = (event, index, variant, id) => {
    this.setState({
      anchorEl: variant ? null : event.currentTarget,
      index,
    });
    this.props.setOpen(variant && this.props.open ? false : id ?? true);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
    this.props.setOpen(false);
  };

  render() {
    const { actions = [], open, maxHeight = 400, classes } = this.props;
    const { anchorEl, index } = this.state;
    if (!actions) return null;

    return (
      <div className={classes.root}>
        {actions.map(
          (
            {
              id,
              tooltip,
              icon,
              content,
              active,
              badge,
              action,
              disabled,
              variant,
            },
            index,
          ) => {
            return (
              <IconButton
                key={id}
                tooltip={tooltip}
                className={classes.iconButton}
                onClick={e =>
                  action ? action(id) : this.handleClick(e, index, variant, id)
                }
                disabled={disabled}
                color={active ? 'primary' : 'font'}>
                <div className={classes.icon}>
                  {badge && badge !== 0 ? (
                    <div className={classes.badge}>{badge}</div>
                  ) : null}
                  {icon}
                </div>
              </IconButton>
            );
          },
        )}

        <Popover
          id="long-menu"
          anchorEl={anchorEl}
          open={open && Boolean(anchorEl)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          onClose={this.handleClose}
          PaperProps={{
            style: {
              maxHeight,
              maxWidth: 350,
              width: '100%',
            },
          }}>
          {actions?.[index]?.content}
        </Popover>
      </div>
    );
  }
}

const styles = theme => ({
  root: { display: 'flex', flexDirection: 'row' },
  checkbox: {
    padding: 0,
    margin: 0,
  },
  iconSelected: {
    width: 28,
    height: 28,
    layout: 'flex',
    justifyContent: 'center',
    paddingTop: 3,
    alignItems: 'center',
    borderRadius: 28,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  icon: {
    width: 24,
    height: 24,
    layout: 'flex',
    justifyContent: 'center',
    // paddingTop: 4,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
    // paddingBottom:
  },
  iconButtonSelected: {
    padding: 2,
    // paddingBottom:
  },
  badge: {
    position: 'absolute',
    height: 16,
    width: 16,
    right: 0,
    top: 0,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 20,
    fontSize: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.contrastText,
  },
});

ActionList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActionList);
