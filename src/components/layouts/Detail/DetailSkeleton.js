import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-better';
import Skeleton from '@material-ui/lab/Skeleton';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(1),
    paddingBottom: 300,
  },
  section: {
    width: '100%',
    padding: theme.spacing(3),
    // border: '1px solid #EFEFEF',
    borderRadius: 10,
    marginBottom: theme.spacing(2),
    backgroundColor: ({ variant }) => (variant ? '#FAFAFA' : '#FFFFFF'),
  },
  header: {
    width: '100%',
    height: 72,
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

export default function DetailSkeleton(props) {
  const { variant, skeleton = ['', ''] } = props;
  const classes = useStyles(props);

  return (
    <Scrollbars autoHide className={classes.root} rtl={document.dir === 'rtl'}>
      {!variant && <HeaderSkeleton />}
      {skeleton.map((section, index) =>
        !variant ? (
          <OutputSectionSkeleton key={index} section={section} {...props} />
        ) : (
          <OutputSectionSkeletonVariant
            key={index}
            section={section}
            {...props}
          />
        ),
      )}
    </Scrollbars>
  );
}

function HeaderSkeleton(props) {
  const classes = useStyles();
  return (
    <div className={classes.header}>
      <Skeleton height="180" width={400} />
      <div className={classes.content}>
        <Skeleton height="180" width={150} className={classes.content} />
      </div>
    </div>
  );
}

function OutputSectionSkeleton(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.section}>
      <Skeleton height="180" width={200} />
      <div className={classes.content}>
        <Skeleton height="20" width="80%" className={classes.content} />
        <Skeleton height="20" width="60%" className={classes.content} />
        <Skeleton height="20" width="70%" className={classes.content} />
      </div>
    </div>
  );
}

function OutputSectionSkeletonVariant(props) {
  const { section } = props;
  const classes = useStyles2(props);
  if (section === 'images') {
    return (
      <div className={classes.section}>
        <Skeleton height={24} width={200} />
        <div className={classes.row}>
          <div className={classes.cover}>
            <Skeleton height={12} width={45} className={classes.text} />
            <Skeleton
              variant="rect"
              height={155}
              width={155}
              className={classes.image}
            />
          </div>
          <div className={classes.detail}>
            <Skeleton height={12} width={45} className={classes.text} />
            <div className={classes.detailImages}>
              <Skeleton
                variant="rect"
                height={155}
                width={155}
                className={classes.image}
              />
              <Skeleton
                variant="rect"
                height={155}
                width={155}
                className={classes.image}
              />
              <Skeleton
                variant="rect"
                height={155}
                width={155}
                className={classes.image}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={classes.section}>
      <Skeleton height={24} width={200} />
      <div className={classes.content}>
        <Skeleton height={14} width={89} className={classes.content2} />
        <Skeleton height={18} width={150} className={classes.content} />
        <Skeleton height={14} width={100} className={classes.content2} />
        <Skeleton height={18} width={143} className={classes.content} />
        <Skeleton height={14} width={60} className={classes.content2} />
        <Skeleton height={18} width={143} className={classes.content} />
        <Skeleton height={14} width={60} className={classes.content2} />
        <Skeleton height={18} width={143} className={classes.content} />
      </div>
    </div>
  );
}

const useStyles2 = makeStyles(theme => ({
  image: {
    // minWidth: 155,
    // minHeight: 100,
    // width: 155,
    // height: 100,
    marginRight: theme.spacing(1),
    // paddingBottom: 300,
  },
  cover: {
    marginRight: theme.spacing(2),
  },
  detailImages: {
    display: 'flex',
    flexDirection: 'row',
    // minHeight: 90,
  },
  text: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
  section: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    // border: '1px solid #EFEFEF',
    borderRadius: 10,
    marginBottom: theme.spacing(2),
    backgroundColor: ({ variant }) => (variant ? '#FAFAFA' : '#FFFFFF'),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    marginTop: theme.spacing(0.5),
  },
  content2: {
    marginTop: theme.spacing(2),
  },
}));
