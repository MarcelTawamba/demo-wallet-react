import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import { standardizeString } from 'util/general';

const findColor = status => {
  switch (status) {
    case 'available':
    case 'Available':
    case 'accepted':
    case 'complete':
    case 'Complete':
      return 'positive';
    default:
      return 'font';
  }
};

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
  },
  text: {
    color: props => theme.palette[findColor(props.children)].main,
  },
}));

const StatusOutput = props => {
  const { children } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <Text className={classes.text}>{standardizeString(children)}</Text>
    </div>
  );
};

StatusOutput.propTypes = {};

StatusOutput.defaultProps = {};

export default StatusOutput;
