import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import NextIcon from '@material-ui/icons/ChevronRight';
import PreviousIcon from '@material-ui/icons/ChevronLeft';

import IconButton from 'components/inputs/IconButton';
import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  container: {
    // padding: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-end',
  },
  pageNumber: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
  },
}));

const PaginationControls = props => {
  const { page, setPage, pageLast } = props;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <IconButton disabled={page === 1} onPress={() => setPage(page - 1)}>
        <PreviousIcon style={{ fontSize: 18 }} />
      </IconButton>
      <Text width={'auto'} className={classes.pageNumber}>
        {page}
      </Text>
      <IconButton
        disabled={page === pageLast}
        onPress={() => setPage(page + 1)}>
        <NextIcon style={{ fontSize: 18 }} />
      </IconButton>
    </div>
  );
};

// ButtonList.defaultProps = {
//   items: [{ label: '', onPress: () => {}, loading: false, disabled: false }],
//   actionIcon: { icon: '', onPress: () => {} },
//   close: { label: '', onPress: () => {}, loading: false, disabled: false },
// };

// ButtonList.propTypes = {
//   items: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string,
//       onPress: PropTypes.func,
//       loading: PropTypes.bool,
//       disabled: PropTypes.bool,
//     }),
//   ).isRequired,
// };

export default PaginationControls;
