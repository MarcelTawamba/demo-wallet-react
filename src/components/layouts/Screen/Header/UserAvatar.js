import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { Tooltip } from '@material-ui/core';
import Icon from 'components/outputs/Icon';
import { SimpleImg } from 'react-simple-img';
import AvatarSkeleton from './AvatarSkeleton';
import { configAppSelector } from 'redux/rehive/selectors';
import { useSelector } from 'react-redux';

export default function UserAvatar(props) {
  const classes = useStyles(props);
  const { context = {}, noEmail, loading, imageSize = 36, marginLeft } = props;
  const { business, user } = context;

  const { first_name, email, last_name, groups } = user ?? {};
  const userGroup = groups?.[0] ?? { name: '', label: '' };
  const appConfig = useSelector(configAppSelector);
  const hide = appConfig?.menu?.hide ?? [];
  const hideGroup = hide?.includes('group') || noEmail || business;

  const photoLink = business?.icon ?? business?.logo ?? user?.profile;
  const name = business?.name ?? `${first_name || ''} ${last_name || ''}`.trim();

  if (loading) return <AvatarSkeleton />;

  return (
    <div className={classes.row}>
      <View
        style={{
          height: imageSize,
          maxHeight: imageSize,
          maxWidth: imageSize,
          width: imageSize,
          borderRadius: imageSize,
          marginLeft: marginLeft,
          overflow: 'hidden',
        }}>
        {photoLink ? (
          <SimpleImg
            style={{
              maxHeight: imageSize,
              maxWidth: imageSize,
            }}
            imgStyle={{
              width: imageSize,
              height: imageSize,
              maxHeight: imageSize,
              maxWidth: imageSize,
              objectFit: 'cover',
            }}
            src={photoLink}
            key={photoLink}
            height={imageSize}
            width={imageSize}
          />
        ) : (
          <AccountCircleIcon
            fontSize={'inherit'}
            style={{ fontSize: imageSize + 2 }}
            color={'primary'}
          />
        )}
      </View>
      {!hideGroup && (
        <Tooltip title={userGroup?.label ?? 'User'}>
          <div
            style={{
              position: 'absolute',
              left: 30,
              bottom: 4,
            }}>
            <Icon
              icon={userGroup?.name ?? 'user'}
              size={10}
              color="primary"
              iconColor="white"
            />
          </div>
        </Tooltip>
      )}

      <div>
        <Text
          className={classes.text}
          bold
          align="left"
          s={14}
          style={{
            color: '#333333',
          }}>
          {name}
        </Text>
        {!noEmail && (
          <Text
            className={classes.text}
            align="left"
            style={{
              fontSize: 11,
            }}
            variant={'subtitle2'}>
            {email}
          </Text>
        )}
      </div>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 148,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
}));
