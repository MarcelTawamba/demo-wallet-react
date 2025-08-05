import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Slide as CarouselSlide } from 'pure-react-carousel';
// import Text from 'components/outputs/Text';
import { Typography } from '@material-ui/core';
import PlaceholderImage from './PlaceholderImage';
import { SimpleImg } from 'react-simple-img';
import useI18Language from 'hooks/useI18Language';

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
  const isUrl = image.includes('http');
  const classes = useStyles();
  const { getI18Translation } = useI18Language();
  
  // Check if description is a translation key or plain text
  const displayText = getI18Translation(description) !== description 
    ? getI18Translation(description) 
    : description;
  
  return (
    <CarouselSlide>
      <div className={classes.container}>
        {isUrl ? (
          <SimpleImg
            style={{
              maxHeight: width,
              maxWidth: width,
              minHeight: width,
              minWidth: width,
            }}
            imgStyle={{
              objectFit: 'cover',
              height: '100%',
              width: '100%',
            }}
            alt={title ? title : displayText}
            src={image}
          />
        ) : (
          <PlaceholderImage name={image} width={width} />
        )}
        <div className={classes.slide}>
          {/* <h3>{title}</h3> */}
          <Typography align={'center'}>{displayText}</Typography>
        </div>
      </div>
    </CarouselSlide>
  );
};

export default Slide;
