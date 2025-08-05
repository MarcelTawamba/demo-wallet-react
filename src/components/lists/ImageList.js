import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Button } from 'components/inputs/Button';
import { Scrollbars } from 'react-custom-scrollbars-better';
import Image from 'components/outputs/Image';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function ImageList(props) {
  const { items } = props;
  const classes = useStyles(props);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(0);
  const small = useMediaQuery('(max-width:400px)');
  const medium = useMediaQuery('(max-width:1280px)');

  if (!items?.length) return null;

  const item = items[index];

  const showThumbnails = items.length > 1;

  return (
    <div className={classes.container}>
      {showThumbnails && (
        // <Scrollbars>
        <div className={classes.thumbnailContainer}>
          {items.map((item, i) => (
            <div
              key={item.id}
              onClick={() => {
                setIndex(i);
                if (i !== index) setLoading(true);
              }}
              variant="text"
              className={classes.thumbnail}>
              <Image
                src={item.file}
                alt={item.id}
                height={'100%'}
                width={'100%'}
              />
            </div>
          ))}
        </div>
        // </Scrollbars>
      )}
      <div className={classes.imageContainer}>
        <Button
          tooltip={'Open in new tab'}
          variant={'text'}
          style={{
            paddingBottom: 0,
            borderRadius: 3,
            width: '100%',
            overflow: 'hidden',
          }}
          zeroPadding
          noPadding
          wrapperStyle={{ padding: 0, margin: 0 }}
          newTab
          href={item.file}>
          <Image
            loadingHook={[loading, setLoading]}
            src={item.file}
            alt={item.id}
            width={'100%'}
            height={'100%'}
            // maxWidth={medium || !showThumbnails ? 300 : 200}
            // height={medium ? '60%' : '100%'}
            // maxHeight={medium ? 300 : '100%'}
          />
        </Button>
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column-reverse',
    },
    [theme.breakpoints.down(600)]: {
      alignItems: 'center',
    },
  },
  image: {
    // padding: theme.spacing(2),
    // height: 300,
    // resizeMethod: 'contain',
    // width: 300,
    // [theme.breakpoints.down('xs')]: {
    //   height: 200,
    //   width: 200,
    // },
  },
  imageContainer: {
    width: '80%',
    // height: '80%',
    // display: 'flex',
    // justifyContent: 'center ',
  },
  thumbnail: {
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      marginBottom: 0,
      width: 50,
      height: 50,
      marginRight: theme.spacing(1),
    },
  },
  thumbnailContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginRight: theme.spacing(1),
    marginTop: '6px',
    width: '20%',
    maxWidth: 100,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      marginTop: 0,
      marginLeft: '6px',
      maxWidth: 'unset',
      flexDirection: 'row',
      overflowX: 'scroll',
      overflowY: 'hidden',
      paddingRight: theme.spacing(1),
    },
    [theme.breakpoints.down(600)]: {
      justifyContent: 'center',
    },
    // width: 96,
    height: '100%',
  },
}));
