import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import Text from 'components/outputs/Text';

const ConversionRate = ({ children, classes, containerStyle, textStyle }) => {
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer} style={containerStyle}>
        <Text width="auto" variant="overline" align="center" style={textStyle}>
          {children}
        </Text>
      </div>
    </div>
  );
};
const styles = theme => ({
  container: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',

    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingBottom: 4,
  },
  innerContainer: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 100,
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  },
});

ConversionRate.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ConversionRate);
