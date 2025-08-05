import React from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import PageButtons from './PageButtons';
import OutputList from '../../lists/OutputList';
import PageContent from './PageContent';
import { configActionsSelector } from 'redux/rehive/selectors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    width: '100%',
  },
  title: { paddingTop: theme.spacing(1), paddingBottom: theme.spacing(3) },
  text: {
    paddingBottom: theme.spacing(3),
    width: '100%',
    wordBreak: 'break-word',
  },
  items: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    width: '100%',
    borderTop: '1px solid lightgray',
    // borderBottom: '1px solid lightgray',
  },
  itemsExtra: {
    borderTop: '1px solid lightgray',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    width: '100%',
  },
}));

const ConfirmPage = props => {
  const {
    text,
    textComp = null,
    items,
    itemsExtra,
    itemsExtra2,
    formikProps,
    handleButtonPress,
    onConfirm,
    onBack,
    backButtonText,
    disabled = false,
    children,
    action,
    href,
    hideBack,
    content,
    textVariant,
    isValid,
    isSubmitting,
    align = 'right',
  } = props;
  const classes = useStyles(props);

  const actionsConfig = useSelector(configActionsSelector);
  const confirmMessage = get(
    actionsConfig,
    [action, 'config', 'confirmMessage'],
    '',
  );

  let actions = [
    {
      children: 'CONFIRM',
      type: 'submit',
      size: 'large',
      disabled:
        (formikProps.isSubmitting || !formikProps.isValid || disabled) &&
        (!isValid || isSubmitting),
      loading: formikProps.isSubmitting || isSubmitting,
      href,
      newTab: true,
      onPress: onConfirm
        ? onConfirm
        : () =>
            handleButtonPress
              ? handleButtonPress(formikProps, 'confirm')
              : null,
    },
  ];
  if (!hideBack) {
    actions.push({
      children: backButtonText ? backButtonText : 'Back',
      onPress: onBack
        ? onBack
        : () => (handleButtonPress ? handleButtonPress(formikProps) : null),
      variant: 'text',
    });
  }

  return (
    <React.Fragment>
      <PageContent>
        <Text align="center" variant="h6" className={classes.title}>
          Confirm
        </Text>

        {Boolean(text) && (
          <Text
            align="center"
            className={classes.text}
            variant={textVariant ? textVariant : 'body1'}>
            {text}
          </Text>
        )}
        {textComp}
        {confirmMessage && (
          <Text align="center" className={classes.text}>
            {confirmMessage}
          </Text>
        )}
        {content}
        {Boolean(items) && (
          <div className={classes.items}>
            <OutputList items={items} outputProps={{ align }} />
          </div>
        )}
        {itemsExtra && (
          <div className={classes.itemsExtra}>
            <OutputList items={itemsExtra} outputProps={{ align }} />
          </div>
        )}
        {itemsExtra2 && (
          <div className={classes.itemsExtra}>
            <OutputList items={itemsExtra2} outputProps={{ align }} />
          </div>
        )}
      </PageContent>
      {children}
      <PageButtons layout={'vertical'} items={actions} />
    </React.Fragment>
  );
};
export default ConfirmPage;
