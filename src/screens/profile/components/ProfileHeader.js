import React, { Component } from 'react';
import { View } from 'components/layout/View';
import OutputList from 'components/lists/OutputList';
import { Button } from 'components/inputs/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Image from 'components/outputs/Image';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { getName } from 'country-list';
import makeStyles from '@material-ui/styles/makeStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function ProfileHeader(props) {
  const { profile, profilePictureLoading, profileConfig } = props;
  const photoLink = profile.profile;
  const classes = useStyles();

  const { first_name, last_name, id_number, birth_date, nationality } = profile;
  let profileOutputs = [
    {
      label: 'Name',
      value: first_name + (last_name && ' ' + last_name),
      placeholder: 'Not yet provided',
    },
  ];
  try {
    profileOutputs.push({
      label: 'country',
      value: getName(nationality),
      placeholder: 'Not yet provided',
    });
  } catch (e) {
    console.log('TCL: ProfileHeader -> render -> e', e);
  }

  const profileOutputs2 = [
    {
      label: 'Date of birth',
      value: birth_date,
      placeholder: 'Not yet provided',
    },
  ];

  if (!profileConfig.hideID) {
    profileOutputs2.push({
      label: profileConfig.labelID ? profileConfig.labelID : 'ID number',
      value: id_number,
      placeholder: 'Not yet provided',
    });
  }
  const matches = useMediaQuery('(min-width:600px)');

  const buttonProps = {
    tooltip: 'Edit personal details',
    variant: 'text',
    style: {
      borderRadius: 10,
      paddingTop: 0,
      paddingBottom: 0,
    },
    wrapperStyle: {
      padding: 0,
    },
    wide: true,
    onPress: props.onClick,
  };

  return (
    <div className={classes.container}>
      <div className={classes.top}>
        <Tooltip title={'Upload new profile picture'}>
          <IconButton component="label">
            <input
              type="file"
              onChange={e => {
                const file = e.target.files[0];
                props.updateProfileImage(file);
              }}
              style={{ display: 'none' }}
            />
            <div className={classes.avatar}>
              {photoLink ? (
                <Image
                  src={photoLink}
                  key={photoLink}
                  height={100}
                  width={100}
                  backgroundColor={'secondary'}
                  loading={profilePictureLoading}
                />
              ) : (
                <AccountCircleIcon
                  fontSize={'inherit'}
                  style={{ fontSize: 100 }}
                  color={'primary'}
                />
              )}
            </div>
          </IconButton>
        </Tooltip>
        {!matches && (
          <Button {...buttonProps}>
            <OutputList items={profileOutputs} />
          </Button>
        )}
      </div>
      <Button {...buttonProps}>
        <div className={classes.bottom}>
          {matches && <OutputList items={profileOutputs} />}
          <OutputList items={profileOutputs2} />
        </div>
      </Button>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(3),
    // paddingLeft: theme.spacing(3),
    // paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(1),
    width: '100%',
    [theme.breakpoints.down(600)]: {
      flexDirection: 'column',
      paddingBottom: 0,
    },
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 100,
    overflow: 'hidden',
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // [theme.breakpoints.down(600)]: {
    //   flexDirection: 'column',
    //   alignItems: 'center',
    //   paddingBottom: 0,
    // },
  },
  top: {
    display: 'flex',
    width: 'auto',
    [theme.breakpoints.down(600)]: {
      flexDirection: 'row',
      paddingBottom: 0,
    },
  },
}));
