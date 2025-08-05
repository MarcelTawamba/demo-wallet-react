import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingBottom: ({ pb, footer }) => theme.spacing(pb ?? (footer ? 5 : 3)),

    [theme.breakpoints.up(540)]: {
      paddingLeft: ({ horizontal = 3 }) => theme.spacing(horizontal),
      paddingRight: ({ horizontal = 3 }) => theme.spacing(horizontal),
    },
    [theme.breakpoints.down(540)]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    borderTop: props => (props.border ? '1px solid #EFEFEF' : ''),
    paddingTop: props => theme.spacing(props?.pt ?? props.border ? 2 : 0),
    // borderBottom: '1px solid #EFEFEF',
  },
}));

const PageContent = props => {
  const { children, border, footer, ...restProps } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container} {...restProps}>
      {children}
    </div>
  );
};

PageContent.propTypes = {
  footer: PropTypes.bool,
};

export default PageContent;
