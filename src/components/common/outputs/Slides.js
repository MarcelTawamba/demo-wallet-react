import React from 'react';

import { makeStyles, useTheme as useMuiTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

import {
  CarouselProvider,
  Slider,
  ButtonBack,
  ButtonNext,
  DotGroup,
  Dot,
} from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Slide from './Slide';
import { Button } from 'components/inputs/Button';
import { useTheme } from '../context';

const dotSize = 7;

const useStyles = makeStyles(theme => ({
  root: ({ fullScreen }) => ({
    width: '100%',
    height: fullScreen ? '100vh' : 'auto',
    marginBottom: theme.spacing(2),
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
  }),
  container: ({ fullScreen }) => ({
    height: fullScreen ? '100%' : 'auto',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  inner: {
    maxWidth: '80%',
  },
  slider: ({ fullScreen }) => ({
    width: fullScreen ? '70%' : '80%',
  }),
  button: { borderWidth: 0, backgroundColor: 'white' },
  dots: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    height: dotSize * 2,
    paddingTop: ({ fullScreen }) =>
      fullScreen ? theme.spacing(8) : theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  dotNot: {
    height: dotSize,
    width: dotSize,
    maxHeight: dotSize,
    maxWidth: dotSize,
    backgroundColor: '#BCBCBC',
    borderRadius: dotSize * 2,
    margin: theme.spacing(0.5),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: 0,
    border: 'none',
  },
  dotSelected: {
    height: dotSize,
    width: dotSize * 2.5,
    maxHeight: dotSize,
    maxWidth: dotSize * 2.5,
    backgroundColor: theme.palette.primary.main,
    borderRadius: dotSize * 2,
    margin: theme.spacing(0.5),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    padding: 0,
    border: 'none',
  },
  buttonNext: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: ({ fullScreen }) =>
      fullScreen ? theme.spacing(4) : theme.spacing(1),
  },
}));

const Slides = props => {
  let { items, loop, onSuccess, showButtons = false, fullScreen } = props;
  const classes = useStyles(props);
  const { colors } = useTheme();
  const theme = useMuiTheme();
  const matches = useMediaQuery(theme.breakpoints.down(600));
  const matches2 = useMediaQuery(theme.breakpoints.down(400));
  const width = fullScreen && !matches2 ? (matches ? 300 : 400) : 200;

  if (!items) {
    return null;
  }

  const singleSlide = items.length === 1;

  return (
    <div className={classes.root}>
      <div className={classes.inner}>
        <CarouselProvider
          naturalSlideWidth={width * (matches ? 0.7 : matches2 ? 0.5 : 1)}
          naturalSlideHeight={width * (matches ? 1.1 : 1)}
          infinite={loop}
          interval={10000}
          isIntrinsicHeight
          isPlaying={!singleSlide}
          totalSlides={items.length}>
          <div className={classes.container}>
            {!singleSlide && showButtons && (
              <ButtonBack className={classes.button}>
                <ChevronLeftIcon
                  style={{
                    color: colors.font,
                    opacity: 0.5,
                    fontSize: 20,
                  }}
                />
              </ButtonBack>
            )}
            <div className={classes.slider}>
              <Slider>
                {items.map((item, index) => (
                  <Slide
                    // onFocus={() => console.log('hello')}
                    key={index}
                    slide={index}
                    width={width}
                    {...item}
                  />
                ))}
              </Slider>
            </div>
            {!singleSlide && showButtons && (
              <ButtonNext className={classes.button}>
                <ChevronRightIcon
                  style={{
                    color: colors.font,
                    opacity: 0.5,
                    fontSize: 20,
                  }}
                />
              </ButtonNext>
            )}
          </div>

          {!singleSlide && (
            <DotGroup
              className={classes.dots}
              renderDots={props => <Dots {...props} items={items} />}
            />
          )}
        </CarouselProvider>
        {onSuccess && (
          <div className={classes.buttonNext}>
            <Button
              variant="text"
              onPress={() => onSuccess()}
              color={'primary'}>
              Skip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

function Dots(props) {
  const {
    totalSlides,
    visibleSlides,
    currentSlide,
    showAsSelectedForCurrentSlideOnly,
  } = props;
  const classes = useStyles();

  const dots = [];
  for (let i = 0; i < totalSlides; i += 1) {
    const multipleSelected =
      i >= currentSlide && i < currentSlide + visibleSlides;
    const singleSelected = i === currentSlide;
    const selected = showAsSelectedForCurrentSlideOnly
      ? singleSelected
      : multipleSelected;
    const slide =
      i >= totalSlides - visibleSlides ? totalSlides - visibleSlides : i;
    dots.push(
      <Dot
        key={i}
        slide={slide}
        className={selected ? classes.dotSelected : classes.dotNot}
      />,
    );
  }
  return dots;
}

export default Slides;
