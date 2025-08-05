import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Text from 'components/outputs/Text';
import PageButtons from './PageButtons';
import PageContent from './PageContent';
import LottieImage from 'components/outputs/LottieImage';
import { useSelector } from 'react-redux';
import { configActionsSelector } from 'redux/rehive/selectors';

export default function ResultPage(props) {
  const {
    amount,
    recipient,
    recipientDirection = 'to',
    result = {},
    formikProps,
    handleButtonPress,
    action,
    text,
    text2,
    textComp,
    secondaryAction,
    buttonSuccessText = 'VIEW TRANSACTION',
    nextLabel,
    onNext,
  } = props;

  let { id, status, message, error } = result;
  const actionsConfig = useSelector(configActionsSelector);
  const actionsMessage = actionsConfig?.[action]?.config?.successMessage;
  const classes = useStyles(props);

  let title = 'FAILED';
  let icon = 'error';
  let errorMessage = '';
  let color = 'gray1';

  if (
    (id && status !== 'failed') ||
    status === 'success' ||
    status === 'succeeded'
  ) {
    title = 'SUCCESS';
    color = 'positive';
    icon = 'success';
  } else {
    errorMessage = error ? error : message;
  }

  return (
    <React.Fragment>
      <PageContent>
        <div className={classes.title}>
          <Text align="center" variant="h6">
            {title}
          </Text>
        </div>
        <div>
          {textComp ? (
            textComp
          ) : (
            <Text
              variant="body1"
              align={'center'}
              style={{
                wordBreak: 'break-word',
              }}>
              {text}
              {amount && <b>{amount}</b>}
              {recipient && ` ${recipientDirection} `}
              {recipient && <b>{recipient}</b>}
            </Text>
          )}
          {actionsMessage && (
            <Text align="center" className={classes.text}>
              {actionsMessage}
            </Text>
          )}
        </div>

        {text2 && (
          <Text align="center" className={classes.text}>
            {text2}
          </Text>
        )}
        {errorMessage && (
          <Text align={'center'} color={'error'} className={classes.text}>
            {errorMessage}
          </Text>
        )}

        <div className={classes.icon}>
          <LottieImage name={icon} size={250} />
          {/* <PlaceholderSvg name={icon} /> */}
        </div>
        <PageButtons
          layout={'vertical'}
          noPadding
          items={[
            {
              children: nextLabel
                ? nextLabel
                : (id && status !== 'failed') ||
                  status === 'success' ||
                  status === 'succeeded'
                ? buttonSuccessText
                : 'TRY AGAIN',
              onPress: onNext
                ? onNext
                : () =>
                    handleButtonPress(
                      formikProps,
                      id || status === 'success' ? 'success' : '',
                    ),
              variant: 'contained',
            },
          ]}
        />
        {secondaryAction && secondaryAction()}
      </PageContent>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  title: { paddingTop: theme.spacing(2), paddingBottom: theme.spacing(4) },
  icon: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    paddingTop: theme.spacing(3),
  },
}));
