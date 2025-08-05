import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'components/inputs/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: props => ({
    display: 'flex',
    paddingLeft: props.padded ? theme.spacing(4) : 0,
    paddingRight: props.padded ? theme.spacing(4) : 0,
    justifyContent: 'flex-end',
    alignItems: props.layout === 'vertical' ? 'flex-start' : 'flex-end',

    [theme.breakpoints.down(480)]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  }),
  vertical: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    // justifyContent: 'flex-start',
    width: '100%',
    marginTop: ({ noPadding }) => (noPadding ? theme.spacing(1) : 0),
  },
}));

const ButtonList = ({
  items = [{ label: '', onPress: () => {}, loading: false, disabled: false }],
  actionIcon = { icon: '', onPress: () => {} },
  close = { label: '', onPress: () => {}, loading: false, disabled: false },
  color,
  design,
  layout,
  variant,
  buttonType,
  buttonPropsOverride,
  noPadding,
}) => {
  const classes = useStyles({ layout, noPadding, padded: false });

  const buttonProps = {
    variant: variant
      ? variant
      : design && design.variant
      ? design.variant
      : 'contained',
    color: color
      ? color
      : design && design.buttonColor
      ? design.buttonColor
      : 'primary',
    wide: layout === 'vertical' && buttonType !== 'text',
    noPadding,
    ...buttonPropsOverride,
  };

  return (
    <div className={`${classes.root} ${classes[layout]}`}>
      {items.map((action, index) => (
        <Button
          wide
          key={action.id ? action.id : index}
          {...buttonProps}
          {...action}
        />
      ))}
    </div>
  );
};

ButtonList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      onPress: PropTypes.func,
      loading: PropTypes.bool,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
};

export default ButtonList;
