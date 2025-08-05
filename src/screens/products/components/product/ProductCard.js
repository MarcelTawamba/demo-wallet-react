import React, { useContext, useEffect, useState } from 'react';
import { useTheme } from 'components/app/context';
import { makeStyles } from '@material-ui/styles';
import { useTheme as useMuiTheme } from '@material-ui/core/styles';
import { Grid, useMediaQuery } from '@material-ui/core';
import CardLayout from 'components/card/CardLayout';
import { get } from 'lodash';
import { formatAmountString } from 'util/general';
import { Button } from 'components/inputs/Button';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import ImageList from 'components/lists/ImageList';
import ProductCardHeader from './ProductCardHeader';
import PlaceholderImage from 'components/outputs/PlaceholderImage';
import Hover from 'components/layout/Hover';
import { formatVariantsString } from 'util/products';
import Selector from 'components/inputs/Selector';
import Markdown from 'components/outputs/Markdown';
import {
  CartContext,
  useCart,
} from 'screens/products/util/contexts/CartContext';
import { formatPriceString } from 'screens/products/util/products';
import IconLabelButton from 'components/inputs/IconLabelButton';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import QuantityControl from '../cart/QuantityControl';

export default function ProductCard(props) {
  const {
    item: initialItem,
    items,
    showModal,
    hideModal,
    noCard,
    detail,
    addToCart,
    handleBack,
  } = props;
  const featuredItems = items
    ?.filter(product => product.id !== initialItem.id)
    .slice(0, 3);
  const classes = useStyles(props);
  const { colors } = useTheme();

  const { currency, loadingItem } = useCart();

  const [item, setItem] = useState(initialItem);
  const history = useHistory();
  const { location = {} } = history;
  const { pathname } = location;

  const handleProductChange = url => {
    items &&
      items.forEach(product => {
        if (url.includes(product.id) && item.id !== product.id) {
          setItem(product);
        }
      });
  };

  useEffect(() => {
    handleProductChange(pathname);
  }, [pathname]);

  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  const {
    description,
    name,
    quantity,
    id,
    images,
    variants,
    id: productId,
  } = item;

  const loading = Boolean(loadingItem === productId);
  const variantOptions = variants
    .map(item => {
      const { label, id, prices, options, variant } = item;
      const { amount, currency } = get(prices, 0, {});
      return {
        label:
          (label ? label : formatVariantsString(options)) +
          (amount ? ' @ ' + formatAmountString(amount, currency, true) : ''),
        amount,
        value: item.id,
      };
    })
    .sort(function (a, b) {
      return a.amount - b.amount;
    });

  const [variant, setVariant] = useState(
    get(variantOptions, [0, 'value'], null),
  );

  const priceString = formatPriceString(item, currency);
  const theme = useMuiTheme();
  const matches = useMediaQuery(theme.breakpoints.down(600));
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { items: currCartItems } = useContext(CartContext);

  const isInCart = currCartItems?.some(cartItem =>
    cartItem.variant?.id
      ? cartItem.product === item.id && cartItem.variant?.id === variant
      : cartItem.product === item.id,
  );

  const quantityInCart = currCartItems?.find(cartItem =>
    cartItem.variant?.id
      ? cartItem.product === item.id && cartItem.variant?.id === variant
      : cartItem.product === item.id,
  )?.quantity;

  if (!item) {
    return null;
  }

  const inputStyle = {
    fontSize: 20,
    padding: '5px',
    borderRadius: 8,
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontWeight: 'bold',
    width: '60px',
    border: '2px solid #DDDDDD',
  };

  const iconStyleProps = {
    h: 22,
    w: 22,
    bR: 22,
    aI: 'center',
    display: 'flex',
    jC: 'center',
    flex: 1,
    style: {
      border: '2px solid #DDD',
      color: '#DDD',
    },
  };

  const viewStyle = {
    fD: 'column',
    jC: 'center',
    aI: 'start',
  };

  const iconAndInputStyle = {
    fD: 'column',
    jC: 'center',
    aI: 'center',
  };

  const handleClick = () => {
    if (showModal) {
      showModal(productId);
    }
  }

  if (detail) {
    const isSmallScreen = screenWidth <= 900;
    return (
      <Grid container={!isSmallScreen} rowSpacing={0}>
        <Grid item xs={isSmallScreen ? 12 : 9}>
          <View fD="column">
            <View mb={0.5}>
              <IconLabelButton label="back" onPress={handleBack} />
            </View>

            <View fD={matches ? 'column' : 'row'} w="100%">
              <div className={classes.detailLeftPanel}>
                {images.length ? (
                  <ImageList items={images} />
                ) : (
                  <PlaceholderImage
                    name="product"
                    height={'auto'}
                    width={'100%'}
                  />
                )}
              </div>
              <View
                f={3}
                w={matches ? '100%' : '60%'}
                p={matches ? 0.5 : 0}
                flexGrow={1}>
                <View
                  pb={0.25}
                  aI={'center'}
                  jC={'space-between'}
                  fD={'row'}
                  gap={isSmallScreen ? 6 : 18}>
                  <View>
                    <Text s={18} bold>
                      {name}
                    </Text>
                  </View>

                  <View>
                    {isInCart && !variant ? (
                      <Text
                        myColor={'gray'}
                        s={14}
                        tA={'right'}
                        id={'added_to_cart_quantity'}
                        context={{ quantityInCart }}
                      />
                    ) : null}
                  </View>
                </View>
                {item?.seller && (
                  <View pb={0.25}>
                    <Text s={14} c={'grey4'}>
                      {item?.seller?.name}
                    </Text>
                  </View>
                )}
                <View pb={0.75} w="100%">
                  <Text color="primary" s={18} bold>
                    {priceString}
                  </Text>
                </View>
                <View pv={0.5} w="100%">
                  {variants.length > 0 && (
                    <View mb={0.5} w={'100%'}>
                      <Selector
                        label="select_option"
                        items={variantOptions}
                        responsive
                        value={variant}
                        variant={'outlined'}
                        onValueChange={setVariant}
                      />
                    </View>
                  )}

                  {isInCart ? (
                    <QuantityControl
                      inputStyle={inputStyle}
                      iconStyleProps={iconStyleProps}
                      viewStyle={viewStyle}
                      iconFontSize={{ fontSize: 18 }}
                      loaderStyle={{ marginLeft: 10 }}
                      spinnerSize={23}
                      item={item}
                      variant={variant}
                      showButton={{
                        onlyRead: false,
                      }}
                      iconAndInputStyle={iconAndInputStyle}
                    />
                  ) : (
                    <Button
                      wrapperStyle={{
                        paddingLeft: 0,
                        paddingRight: 0,
                        zIndex: 16,
                      }}
                      color={'primary'}
                      loading={loadingItem && item.id === loadingItem}
                      wide
                      disabled={loading || quantity === 0}
                      id="add_to_cart"
                      capitalize
                      onPress={event =>
                        addToCart({
                          product: item,
                          variantId: variant,
                          quantity: 1,
                          event,
                        })
                      }
                    />
                  )}
                  {quantity < 10 && quantity !== null && (
                    <Text
                      align={'right'}
                      color={'error'}
                      variant={'subtitle2'}
                      style={{ fontWeight: 500 }}
                      id={quantity === 0 ? 'out_if_stock' : 'stock_warning'}
                      context={{ quantity }}
                    />
                  )}
                  {Boolean(description) && (
                    <View fD={'column'} pt={0.75} pb={1} w="100%">
                      {description[0] !== '#' && (
                        <View pb={0.75}>
                          <Text bold id="description" />
                        </View>
                      )}
                      <Markdown style={{ color: colors.grey4 }}>
                        {description}
                      </Markdown>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </Grid>

        <Grid item xs={isSmallScreen ? 12 : 3}>
          {isSmallScreen && (
            <Text id={'more_products'} bold style={{ marginBottom: 14 }} />
          )}
          <View
            fD={isSmallScreen ? 'row' : 'column'}
            jC={isSmallScreen ? 'flex-start' : 'flex-end'}
            ml={!isSmallScreen ? 4 : 0}>
            {!isSmallScreen && (
              <Text id={'more_products'} bold style={{ marginBottom: 14 }} />
            )}
            {featuredItems.map((item, i) => (
              <View mb={2} mr={isSmallScreen ? 4 : 0}>
                <ProductCard
                  showModal={showModal}
                  addToCart={addToCart}
                  item={item}
                  key={i}
                />
              </View>
            ))}
          </View>
        </Grid>
      </Grid>
    );
  }

  const addToCartButtonProps = {
    loading,
    disabled: loading || quantity === 0,
    onPress: event =>
      addToCart({ product: item, variantId: variant, quantity: 1, event }),
  };

  const contentObj = {
    onClick: handleClick,
    disabled: false,
    content: (
      <Hover
        style={{ width: '100%' }}
        render={hover => (
          <div style={{ width: '100%' }}>
            <View fD={'column'} pt={0.5} w="100%" jC="flex-start">
              <View fD={'row'} pt={0.5} w="100%" jC="flex-start" aI={'center'}>
                <Text
                  style={{
                    textDecorationLine: hover ? 'underline' : 'none',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}>
                  {name}
                </Text>
                {isInCart && !variant ? (
                  <Text
                    myColor={'gray'}
                    s={11}
                    tA={'center'}
                    id={'added_to_cart_quantity'}
                    context={{ quantityInCart }}></Text>
                ) : null}
              </View>

              <View fD="row" w="100%" mt={0.5} jC="space-between" aI="flex-end">
                <Text color="primary" style={{ fontWeight: 500 }}>
                  {priceString}
                </Text>
                {quantity < 10 && quantity !== null ? (
                  <Text
                    align={'right'}
                    color={'error'}
                    variant={'subtitle2'}
                    style={{ fontWeight: 500 }}
                    id={quantity === 0 ? 'out_if_stock' : 'stock_warning'}
                    context={{ quantity }}
                  />
                ) : null}
              </View>
            </View>
          </div>
        )}
      />
    ),
    header: noCard ? null : (
      <ProductCardHeader
        id={productId}
        disabled={variants.length > 0}
        items={images}
        addToCartButtonProps={addToCartButtonProps}
      />
    ),
  };

  const cardObj = {
    contentObj,
  };

  return (
    <CardLayout
      noCard={noCard}
      noBorder
      noBorderRadius
      onDismiss={hideModal}
      noContent
      className="card"
      square
      key={id}
      {...cardObj}
    />
  );
}

const useStyles = makeStyles(theme => ({
  detailLeftPanel: {
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginRight: theme.spacing(2),
    [theme.breakpoints.down(600)]: {
      width: '100%',
      marginRight: 0,
    },
  },
}));
