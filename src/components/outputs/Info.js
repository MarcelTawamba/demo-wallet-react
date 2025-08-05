import React from 'react';
import PropTypes from 'prop-types';
import Typography from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Icon from 'components/outputs/NewIcon';
import makeStyles from '@material-ui/styles/makeStyles';
import { standardizeString } from 'util/general';

export default function Info(props) {
  let { id, langContext = {}, children, variant = 'info' } = props;
  const classes = useStyles(props);

  return (
    <div className={classes.container}>
      <View flex fD={'row'} w={'100%'}>
        <div className={classes.icon}>
          <Icon
            circled={false}
            icon={variant === 'info' ? 'information' : variant}
            size={20}
            color={variant}
          />
        </div>
        <Typography display={'inline'}>
          <Typography display={'inline'} bold myColor={variant}>
            {standardizeString(variant) + ': '}
          </Typography>
          <Typography
            id={id}
            context={langContext}
            display={'inline'}
            myColor={variant}>
            {children}
          </Typography>
        </Typography>
      </View>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    // height: '100%',
    minWidth: 200,
    width: '100%',
    backgroundColor: ({ variant }) =>
      variant === 'warning'
        ? '#FEF1E5'
        : variant === 'error'
        ? '#FAE8EA'
        : 'rgb(50, 121, 174, 0.1)',
    padding: ({ dense }) => theme.spacing(dense ? 0.5 : 2),
    paddingTop: ({ dense }) => theme.spacing(dense ? 0.5 : 2) + (dense ? 1 : 0),
    paddingBottom: ({ dense }) =>
      theme.spacing(dense ? 0.5 : 2) - (dense ? 1 : 0),
    marginBottom: ({ dense, noMargin, mb }) =>
      theme.spacing(dense || noMargin ? 0 : mb ? mb : 3),
    marginTop: ({ mt }) => (mt ? theme.spacing(mt) : 0),
    border: ({ noBorder, variant }) =>
      noBorder
        ? ''
        : `1px solid ${
            variant === 'warning'
              ? '#F47A00'
              : variant === 'error'
              ? '#CC2538'
              : 'rgb(50, 121, 174)'
          }`,
    borderRadius: 15,
  },
  icon: {
    paddingLeft: ({ dense }) => theme.spacing(dense ? 0.5 : 0),
    marginTop: 2,
    marginRight: theme.spacing(1),
  },
}));

// Title.propTypes = {
//   titleObj: PropTypes.object,
//   title: PropTypes.string,
//   subtitle: PropTypes.string,
//   onPress: PropTypes.func,
//   textStyleTitle: PropTypes.object,
//   textStyleSubtitle: PropTypes.object,
//   viewStyleContainer: PropTypes.object,
// };

// Title.defaultProps = {
//   titleObj: { title: '', subtitle: '', onPress: () => {} },
//   title: '',
//   subtitle: '',
//   onPress: () => {},
//   textStyleTitle: null,
//   textStyleSubtitle: null,
//   containerStyle: null,
// };
