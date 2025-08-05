import React, { useState } from 'react';
import moment from 'moment';
import Skeleton from '@material-ui/lab/Skeleton';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { formatTime } from 'util/general';
import Icon from 'components/outputs/Icon';
import NewIcon from 'components/outputs/NewIcon';
import IconButton from 'components/inputs/IconButton';
import Hover from 'components/layout/Hover';
import { useTheme } from '@material-ui/styles';
import { useMediaQuery, Avatar, makeStyles } from '@material-ui/core';
import Spinner from 'components/outputs/Spinner';

const TransactionListItemSummary = props => {
  const {
    iconName,
    iconColor,
    color,
    text,
    date,
    amountString,
    convAmountString,
    profile,
    loading,
    image,
    // subtype,
    // status,
    // onMenuClicked,
    // setMenuAnchor,
    // loadingQuickAction,
    isOpen,
  } = props;

  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const matches = useMediaQuery(theme.breakpoints.down('480'));
  const classes = useStyles();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <View fD={'row'} w={'100%'} aI={'center'} ph={0.5}>
      {image ? (
        <div>
          {!imgLoaded && (
            <Skeleton
              style={{ height: 32, width: 32, position: 'absolute' }}
              variant="circle"
              width={32}
              height={32}
            />
          )}
          <Avatar
            src={image}
            className={classes.small}
            imgProps={{ onLoad: () => setImgLoaded(true) }}
          />
        </div>
      ) : (
        <div>
          <Icon
            icon={iconName}
            color={iconColor ? iconColor : color}
            size={16}
          />
        </div>
      )}
      <View w={'100%'} ph={1}>
        <Text style={{ wordBreak: 'break-word' }}>{text}</Text>
        <Hover
          render={hover => (
            <Text variant={'subtitle2'} opacity={0.87}>
              {hover
                ? formatTime(date, 'MMMM Do YYYY, h:mm:ss a', profile)
                : moment(date).fromNow()}
            </Text>
          )}
        />
      </View>
      {/* {subtype === 'request' && status.toLowerCase() === 'pending' && (
        <View mr={1}>
          {loadingQuickAction ? (
            <Spinner size={20} />
          ) : (
            <IconButton
              icon="more_vert"
              inverted
              color={'primary'}
              circled={false}
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onPress={event => {
                event.stopPropagation();
                setMenuAnchor(event.currentTarget);
                onMenuClicked();
              }}
            />
          )}
        </View>
      )} */}
      <View aI={'center'} fD={'row'}>
        <View
          aI={'flex-end'}
          fD={'column'}
          mr={isRtl ? 0 : 1}
          ml={isRtl ? 1 : 0}>
          <Text
            width={'auto'}
            style={{ whiteSpace: matches ? 'normal' : 'nowrap' }}
            align={'right'}
            myColor={color}>
            {amountString}
          </Text>

          {convAmountString && (
            <View h={14} style={{ opacity: loading ? 0.3 : 0.8 }}>
              {loading && !convAmountString ? (
                <Spinner w={'auto'} ph={0.5} size={12} />
              ) : (
                <Text
                  width={'auto'}
                  style={{ whiteSpace: 'nowrap' }}
                  variant={'subtitle2'}>
                  {convAmountString}
                </Text>
              )}
            </View>
          )}
        </View>
        <NewIcon
          icon={isOpen ? 'remove' : 'add'}
          size={16}
          circled={false}
          color={'primary'}
          outlined
        />
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  small: {
    width: 32,
    height: 32,
  },
}));

export default TransactionListItemSummary;
