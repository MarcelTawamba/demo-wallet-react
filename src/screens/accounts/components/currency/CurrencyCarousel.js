import React from 'react';
import { useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';

import { View } from 'components/layout/View';

import CurrencyHeader from './CurrencyHeader';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import IconLabelButton from '../IconLabelButton';

const CurrencyCarousel = ({
  item,
  onPress,
  handleNext,
  handlePrevious,
  onClose,
  disabled,
  rates,
  wallets,
  layout,
}) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(736));

  if (!item) {
    return null;
  }
  return (
    <View w={'100%'} fD="column">
      {matches ? (
        <IconLabelButton
          id="back_to_currencies"
          onPress={() => onClose()}
          variant={'link'}
          show
          color={'primary'}
        />
      ) : null}
      <View
        w={'100%'}
        aI={'center'}
        fD="row"
        jC={'space-around'}
        pt={0.5}
        pb={0.5}>
        <Hidden smUp implementation="css">
          <View w={56}>
            <IconButton onClick={handlePrevious} style={{ padding: 4 }}>
              <ArrowBackIcon size={32} />
            </IconButton>
          </View>
        </Hidden>
        <CurrencyHeader
          currency={item}
          onClick={onPress}
          rates={rates}
          wallets={wallets}
          layout={layout}
        />
        <Hidden smUp implementation="css">
          <View>
            <IconButton onClick={handleNext} style={{ padding: 4 }}>
              <ArrowForwardIcon size={32} />
            </IconButton>
          </View>
        </Hidden>
      </View>
    </View>
  );
};

export default CurrencyCarousel;
