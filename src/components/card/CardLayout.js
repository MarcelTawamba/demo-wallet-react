import React from 'react';
import PropTypes from 'prop-types';

import Text from 'components/outputs/Text';
// import Card from './CardLayout';
import CardActionArea from '@material-ui/core/CardActionArea';
import OutputList from 'components/lists/OutputList';
import CardTitle from './CardTitle';
import { View } from 'components/layout/View';
import CardActions from './CardActions';
import Card from './Card';
import { makeStyles } from '@material-ui/styles';

const CardLayout = props => {
  const {
    // classes,
    titleObj,
    actionsObj,

    contentObj,
    onDismiss,
    large,
    noCard,
    noContent,
    backgroundColor = 'white',
    ...restProps
  } = props;
  const classes = useStyles();

  let TitleComponent = titleObj ? (
    <CardTitle close={noCard} onDismiss={onDismiss} {...titleObj} />
  ) : null;

  const CardHeader = contentObj.header;

  const hasText = Boolean(contentObj.text);
  let TextComponent = <Text align={'left'}>{contentObj.text}</Text>;
  const CardContent = (
    <React.Fragment>
      {noContent ? null : (
        <View
          p={contentObj?.noPadding ? 0 : 0.5}
          w={'100%'}
          style={{ minHeight: hasText ? 70 : 70 }}
          aI={'flex-start'}>
          {Boolean(TitleComponent) && (
            <View p={0.5} pb={hasText ? 1 : 0} w={'100%'}>
              {TitleComponent}
            </View>
          )}
          <View w={'100%'} aI={'space-between'} h={'100%'}>
            {hasText && (
              <View ph={0.5} h={noCard ? 'auto' : 40}>
                {TextComponent}
              </View>
            )}
            {contentObj?.values?.length > 0 && (
              <OutputList items={contentObj.values} />
            )}
          </View>
        </View>
      )}
    </React.Fragment>
  );
  if (noCard) {
    return (
      <View
        h={'100%'}
        jC={'space-between'}
        bC={backgroundColor}
        // style={{ maxWidth: 500 }}
      >
        {CardContent}
        {contentObj.content}

        {actionsObj && (
          <CardActions
            // variant={cardDesign.actionButtonsType}
            {...actionsObj}
            type={'text'}
            color={'primary'}
          />
        )}
      </View>
    );
  }

  return (
    <Card disabled={contentObj.disabled} large={large} {...restProps}>
      <View h={'100%'} jC={'space-between'} w="100%">
        <CardActionArea
          disableRipple
          disableTouchRipple
          classes={{
            root: classes.action,
            focusHighlight: classes.focusHighlight,
          }}
          disabled={contentObj.disabled}
          onClick={() => contentObj.onClick()}>
          {CardHeader}
          {CardContent}
          {contentObj.content}
        </CardActionArea>

        {actionsObj && (
          <CardActions {...actionsObj} type={'text'} color={'primary'} />
        )}
      </View>
    </Card>
  );
};

const useStyles = makeStyles(theme => ({
  action: {
    '&:hover $focusHighlight': {
      opacity: 0,
    },
    height: '100%',
  },
  focusHighlight: {},
  card: {
    border: '1px solid #EFEFEF',
  },
}));

CardLayout.propTypes = {
  titleObj: PropTypes.object,
  actionOne: PropTypes.object,
  actionTwo: PropTypes.object,
};

CardLayout.defaultProps = {
  titleObj: { title: '', subtitle: '', onPress: () => {}, icon: '', badge: '' },
  actionOne: { label: '', onPress: () => {}, loading: false, disabled: false },
  actionTwo: { label: '', onPress: () => {}, loading: false, disabled: false },
};

export default CardLayout;
