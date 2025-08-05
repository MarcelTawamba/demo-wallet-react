import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { standardizeString } from 'util/general';
import Text from 'components/outputs/Text';
import PoSPlaceholderImage from 'screens/pos/components/images/PoSPlaceholderImages';
import { View } from 'components/layout/View';
import Skeleton from '@material-ui/lab/Skeleton';

/* components */
export default function FullScreenButtonSelector(props) {
  const { items, title, base } = props;
  const showTitle = Boolean(title);
  const classes = useStyles();

  const skeletonContent = () => (
    <View fD="row" gap={3}>
      <Skeleton width={180} height={280} />
      <Skeleton width={180} height={280} />
      <Skeleton width={180} height={280} />
      <Skeleton width={180} height={280} />
    </View>
  );

  return (
    <div>
      {/* <div className={classes.container}> */}
      {showTitle && (
        <Text
          className={classes.title}
          align="center"
          variant="h5"
          id={title}
        />
      )}
      {items.length === 0 ? (
        skeletonContent()
      ) : (
        <div className={classes.inner}>
          {items.map(({ id, to, label, icon }) => (
            <Link to={(base ? '/' + base : '') + (to ? to : '/' + id + '/')}>
              <PoSPlaceholderImage
                name={icon ? icon : id}
                label={label || id}
              />
            </Link>
          ))}
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
  },
  inner: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  container: {
    width: '100%',
    height: '100%',
    // overflow: 'scroll',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    paddingBottom: theme.spacing(6),
    // paddingTop: theme.spacing(6),
  },
}));
