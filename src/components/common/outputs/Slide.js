import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Slide as CarouselSlide } from 'pure-react-carousel';
// import Text from 'components/outputs/Text';
import { Typography } from '@material-ui/core';
import PlaceholderImage from './PlaceholderImage';

const useStyles = makeStyles(theme => ({
  container: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slide: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(1),
  },
}));

const Slide = props => {
  const { title, description, image, width } = props;
  const classes = useStyles();
  return (
    <CarouselSlide>
      <div className={classes.container}>
        <PlaceholderImage name={image} width={width} />
        <div className={classes.slide}>
          {/* <h3>{title}</h3> */}
          <Typography align={'center'}>{description}</Typography>
        </div>
      </div>
    </CarouselSlide>
  );
};

export default Slide;
