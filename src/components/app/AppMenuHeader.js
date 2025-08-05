import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { get } from 'lodash';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Tooltip } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Image from 'components/outputs/Image';
import AppMenuCompany from './AppMenuCompany';
import Icon from 'components/outputs/Icon';

export default function AppMenuHeader(props) {
  const { company, user, isBusinessGroup, loading, hideGroup } = props;
  let services = {};
  const classes = useStyles();
  if (!user || !company) return null;

  const userGroup = get(user, ['groups', 0], { name: '', label: '' });
  const { name = '', label = '' } = userGroup;
  const { mode = '' } = company;

  company.services.map(service => {
    services[service.slug] = true;
    return { [service.slug]: true };
  });

  const { first_name, email } = user;
  const photoLink = user.profile;
  const fotoSize = 70;

  return (
    <View w={'100%'} pb={0.75}>
      <AppMenuCompany company={company} />
      {!isBusinessGroup && !loading && (
        <>
          <div className={classes.avatar}>
            <View
              aI={'center'}
              jC={'center'}
              style={{
                height: fotoSize,
                width: fotoSize,
                borderRadius: fotoSize,

                overflow: 'hidden',
              }}>
              {photoLink ? (
                <Image
                  src={photoLink}
                  key={photoLink}
                  height={fotoSize}
                  width={fotoSize}
                  backgroundColor={'secondary'}
                />
              ) : (
                <AccountCircleIcon
                  fontSize={'inherit'}
                  style={{ fontSize: fotoSize }}
                  color={'primary'}
                />
              )}
            </View>
            {!hideGroup && (
              <Tooltip title={label ? label : 'User'}>
                <div
                  style={{
                    position: 'absolute',
                    right: 92,
                    top: 120,
                  }}>
                  <Icon
                    icon={
                      name.match(/merchant|business|supplier|admin/)
                        ? name
                        : 'user'
                    }
                    size={12}
                    color="primary"
                    iconColor={'white'}
                  />
                </div>
              </Tooltip>
            )}
          </div>
          <Text
            align={'center'}
            variant={'h6'}
            style={{
              wordBreak: 'break-word',
              fontSize: 20,
              color: '#333333',
            }}
            id="greet_user"
            context={{ name: first_name ? ' ' + first_name : '' }}
          />

          <Text
            style={{
              wordBreak: 'break-word',
              fontSize: 11,
            }}
            align={'center'}
            variant={'subtitle2'}>
            {email}
          </Text>
        </>
      )}
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  avatar: {
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    display: 'flex',
    height: 80,
    maxHeight: 80,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  test: {
    width: '100%',
    maxHeight: 22,
    padding: theme.spacing(0.125),
    backgroundColor: theme.palette.error.main,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}));
