import React, { useRef, useState, useLayoutEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import { get } from 'lodash';
import { Button } from 'components/inputs/Button';
import Hover from 'components/layout/Hover';
import Image from 'components/outputs/Image';
import QuantityControl from '../cart/QuantityControl';
import { CartContext } from 'screens/products/util/contexts/CartContext';
export default function ProductCardHeader(props) {
  let { items, addToCartButtonProps = {}, disabled, id } = props;
  const { items: currCartItems, loadingItem } = useContext(CartContext);

  const isInCart = currCartItems?.some(cartItem => cartItem.product === id);

  const inputStyle = {
    fontSize: 15,
    width: '50px',
  };

  const iconStyleProps = {
    h: 18,
    w: 18,
    bR: 16,
    aI: 'center',
    display: 'flex',
    jC: 'center',
    flex: 1,
    style: {
      border: '2px solid #FFF',
      color: '#FFF',
    },
  };

  const viewStyle = {
    fD: 'row',
    jC: 'center',
    aI: 'center',
    gap: 0.5,
    bC: 'primary',
    bR: 20,
    pt: 0.01,
    pb: 0.01,
    w: 130,
    h: 38,
  };

  const iconAndInputStyle = {
    fD: 'row',
    jC: 'center',
    aI: 'center',
    gap: 0.5,
  };

  const { loading } = addToCartButtonProps;
  const ref = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { width: height } = dimensions;

  useLayoutEffect(() => {
    if (ref.current) {
      setDimensions({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, []);

  const classes = useStyles({ height });

  const image = get(items, [0], null);

  return (
    <Hover
      render={hover => (
        <div className={classes.container} ref={ref}>
          {image ? (
            <Image
              src={image.file}
              resizeMode={'cover'}
              width="100%"
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 10,
              }}
            />
          ) : (
            <PlaceholderImage name="product" width={220} />
          )}

          {(hover || loading) && !disabled && (
            <div className={classes.buttonContainer}>
              <div className={classes.buttonBackground} />
              <div className={classes.button}>
                {isInCart ? (
                  <QuantityControl
                    inputStyle={inputStyle}
                    iconStyleProps={iconStyleProps}
                    viewStyle={viewStyle}
                    iconFontSize={{ fontSize: 12 }}
                    loaderStyle={{ color: 'white' }}
                    spinnerSize={18}
                    item={{ id }}
                    variant={''}
                    showButton={{
                      onlyRead: true,
                    }}
                    iconAndInputStyle={iconAndInputStyle}
                  />
                ) : (
                  <Button
                    style={loading ? { backgroundColor: 'transparent' } : {}}
                    color="primary"
                    id="add_to_cart"
                    capitalize
                    {...addToCartButtonProps}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}
    />
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'hidden',
    width: '100%',
    height: 220,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up(1600)]: {
      height: 300,
    },
  },
  buttonContainer: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    width: '100%',
    opacity: 1,
    height: 220,
    [theme.breakpoints.up(1600)]: {
      height: 300,
    },
  },
  buttonBackground: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    width: '100%',
    height: 220,
    [theme.breakpoints.up(1600)]: {
      height: 300,
    },
  },
  button: {
    position: 'absolute',
    zIndex: 1000,
    display: 'flex',
    opacity: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
}));
