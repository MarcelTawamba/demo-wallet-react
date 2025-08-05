import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import MuiListItem from '@material-ui/core/ListItem';
import Text from 'components/outputs/Text';
import { View } from 'components/layout/View';
import Icon from 'components/rehive/Icon';

const ListItem = props => {
  const {
    id,
    image,
    title = '',
    subtitle,
    onClick,
    color,
    icon,
    inverted,
    selected,
    disabled,
  } = props;
  const classes = useStyles();
  return (
    <MuiListItem
      button
      disableGutters
      dense
      onClick={onClick}
      disabled={disabled}>
      <View key={id} flex fD={'row'} w={'100%'} jC={'flex-start'} aI={'center'}>
        {image ? (
          <Avatar
            alt={title}
            src={image}
            className={classes.avatar}
            imgProps={{ style: { objectFit: 'contain' } }}
          />
        ) : icon ? (
          <div className={classes.avatar}>
            <Icon inverted={inverted} icon={icon} color={color} size={16} />
          </div>
        ) : (
          <Avatar className={classes.avatar}>{title?.slice(0, 1)}</Avatar>
        )}
        <View fD={'column'} jC={'flex-end'}>
          {title && (
            <Text
              align={'left'}
              color={color}
              bold={selected}
              style={{
                // maxWidth: 150,
                flexWrap: 'wrap',
                flex: 1,
                wordBreak: 'break-all',
              }}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              variant="subtitle2"
              align={'left'}
              color={color}
              style={{
                // maxWidth: 170,
                flexWrap: 'wrap',
                flex: 1,
                wordBreak: 'break-all',
              }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </MuiListItem>
  );
};

const useStyles = makeStyles(theme => ({
  avatar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1.5),
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    maxHeight: theme.spacing(4),
    maxWidth: theme.spacing(4),
  },
}));

export default ListItem;
