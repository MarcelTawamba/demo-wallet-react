import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box } from '@material-ui/core';
import ArrowBackIosOutlined from '@material-ui/icons/ArrowBackIosOutlined';
import Text from 'components/outputs/Text';
import PageContent from './PageContent';
import LottieImage from 'components/outputs/LottieImage';
import Scrollbars from 'react-custom-scrollbars-better';
import PageButtons from 'components/layout/page/PageButtons';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    width: '100%',
  },
  headerWrapper: { display: 'flex', alignItems: 'center' },
  headerBackIcon: { fontSize: 14, zIndex: 99, cursor: 'pointer' },
  failedIconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  failedDate: {
    color: '#777777',
    fontSize: 15,
    marginTop: -12,
    fontWeight: 400,
  },
  pageTitle: { marginLeft: -20 },
  partnerTitle: {
    color: '#f54c6f',
    // fontFamily: 'Helvetica Neue',
    fontSize: 16,
  },
  sendingAmountTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 23,
    fontFamily: 'Roboto',
    color: '#222222',
  },
  sendingAmountUSDTitle: { color: '#777777' },
  receiverWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  receiver: { fontSize: 16, fontWeight: 500, wordBreak: 'break-all' },
  receiverEmail: { color: '#777777', wordBreak: 'break-all' },

  pageButtonWrapper: {
    marginTop: 40,
    marginBottom: 16,
  },
  cancelButton: {
    borderRadius: 100,
    color: '#f54c6f',
    border: '1px solid',
  },
  confirmButton: {
    borderRadius: 100,
    backgroundColor: '#f54c6f',
    color: '#FFFFFF',
  },
  pt0: { paddingTop: '0 !important' },
  text: {
    paddingBottom: theme.spacing(3),
    width: '100%',
    wordBreak: 'break-word',
  },
  detailsWrapper: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(9),
    border: '1px solid #FF4C6F',
    borderRadius: 15,
    padding: '18px 24px 24px 24px',
  },
  detailsTitle: {
    color: '#FF4C6F',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 11,
  },
  detailsDescription: {
    textAlign: 'center',
    padding: '0 16px',
    marginTop: 4,
  },
  labeledErrorItem: {
    display: 'flex',
    marginTop: 4,
  },
  errorLabel: {
    fontSize: 15,
  },
  errorMessage: {
    color: '#FF4C6F',
    fontSize: 15,
  },
}));

const FailedPage = props => {
  const {
    failedMessageId = 'failed',
    failedSecondaryMessage = 'transaction_failed_common',
    pageStyle = {},
    labeledErrors = [], // [{label: '', message: ''}]
    formikProps,
    showHeader = true,
    handleButtonPress,
    onBack,
    onContinue,
    disabled = false,
    isValid,
    isSubmitting,
    result = {},
    performedDate,
  } = props;
  const classes = useStyles(props);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      handleButtonPress(formikProps, 'back');
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      handleButtonPress(formikProps, '');
    }
  };

  return (
    <PageContent style={pageStyle}>
      {showHeader && (
        <Box className={classes.headerWrapper}>
          <ArrowBackIosOutlined
            className={classes.headerBackIcon}
            onClick={handleBack}
          />
          <Text
            align="center"
            variant="h6"
            className={classes.pageTitle}
            id="failed"
          />
        </Box>
      )}
      <Box className={classes.failedIconWrapper}>
        <LottieImage name="error" size={200} />
        <Text align="center" variant="h5" className={classes.failedDate}>
          {performedDate}
        </Text>
      </Box>
      <Box className={classes.detailsWrapper}>
        <Text
          align="center"
          variant="h5"
          className={classes.detailsTitle}
          id={failedMessageId}
        />
        <Text
          id={failedSecondaryMessage}
          variant="body1"
          className={classes.detailsDescription}
        />
        <Text variant="body1" className={classes.detailsDescription}>
          {result.message}
        </Text>
        {labeledErrors && labeledErrors.length > 0 && (
          <Scrollbars autoHeight rtl={document.dir === 'rtl'}>
            <Box>
              {labeledErrors.map((labeledError, index) => (
                <Box key={index} className={classes.labeledErrorItem}>
                  <Text className={classes.errorLabel}>
                    {labeledError.label}:
                  </Text>
                  <Text className={classes.errorMessage}>
                    {labeledError.message}
                  </Text>
                </Box>
              ))}
            </Box>
          </Scrollbars>
        )}
      </Box>
      <div style={{ marginTop: 20 }} />
      <PageButtons
        items={[
          {
            id: 'try_again',
            onPress: handleContinue,
            variant: 'outlined',
            wide: true,
            capitalize: true,
          },
          {
            id: 'continue',
            type: 'submit',
            onPress: handleContinue,
            wide: true,
            capitalize: true,
          },
        ]}
      />
    </PageContent>
  );
};
export default FailedPage;
