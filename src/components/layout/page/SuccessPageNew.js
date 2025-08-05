import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Text from 'components/outputs/Text';
import PageContent from './PageContent';
// import { SimpleImg } from 'react-simple-img';
import Badge from 'components/outputs/Badge';
import LottieImage from 'components/outputs/LottieImage';
import { arrayToObject, copyToClipboard } from 'util/general';
import PageButtons from 'components/layout/page/PageButtons';
import PageTitle from './PageTitle';
import { View } from '../View';
import { useToast } from 'components/contexts/ToastContext';
import Icon from 'components/outputs/NewIcon';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  headerWrapper: { display: 'flex', alignItems: 'center' },
  headerBackIcon: { fontSize: 14, zIndex: 99, cursor: 'pointer' },
  successIconWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  successIcon: { fontSize: 140, color: '#2BB292' },
  successDate: {
    color: '#777777',
    fontSize: 15,
    marginTop: -16,
    fontWeight: 400,
  },
  pageTitle: { marginLeft: -20 },
  partnerTitle: {
    color: '#2BB292',
    textTransform: 'uppercase',
    fontSize: 16,
  },
  sendingAmountTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontSize: 23,
    fontFamily: 'Roboto',
    color: '#222222',
  },
  greyTextColor: { color: '#777777' },
  detailsWrapper: {
    width: '100%',
    marginTop: -12,
    marginBottom: 10,
  },
  detailsItemWrapper: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailsItemValueWrapper: {
    width: '50%',
    textAlign: 'right',
  },
  detailsItemValue: {
    fontSize: 12,
    wordBreak: 'break-word',
  },
  detailsItemValue2: {
    fontSize: 10,
    marginTop: 5,
    color: '#777777',
    wordBreak: 'break-word',
  },
  receiverWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  partnerTextWrapper: { marginLeft: 14, flex: 1 },
  receiver: { fontSize: 16, fontWeight: 500, wordBreak: 'break-all' },
  receiverEmail: { color: '#777777', wordBreak: 'break-all' },
  accordionStyle: {
    margin: '32px 6px !important',
    border: '1px solid #BEBEBE',
    boxShadow: 'none',
    borderRadius: 16,
    '&::before': {
      backgroundColor: 'initial',
    },
  },
  successMessage: {
    marginTop: 32,
    textAlign: 'center',
  },
  gridVGap: {
    marginTop: 20,
    marginBottom: 20,
  },
}));

const SuccessPage = props => {
  const {
    pageStyle = {},
    items = [],
    itemsExtra = [],
    groupItemsExtra = [],
    fromAccount,
    successMessage,
    formikProps,
    showHeader = true,
    handleButtonPress,
    performedDate,
    leftButtonAction,
    onNext,
    secondaryAction,
    successMessageId,
    successMessageStyle,
    customButtons,
  } = props;
  const classes = useStyles(props);
  const { showToast } = useToast();
  
  // Details section starts collapsed by default
  const [expanded, setExpanded] = useState(false);
  const itemsObj = arrayToObject(items, 'id');
  const amountItem = itemsObj['amount'];
  const amount2Item = itemsObj['amount2'];
  const recipientItem = itemsObj['recipient'];
  const noteItem = itemsObj['note'];
  const memoItem = itemsObj['memo'];
  // transferFromItem & transferToItem only coming from Transfer view
  const transferFromItem = itemsObj['transfer_from'];
  const transferToItem = itemsObj['transfer_to'];

  const handleViewTransaction = () => {
    if (leftButtonAction) {
      leftButtonAction();
    } else if (handleButtonPress) {
      handleButtonPress(formikProps, 'success');
    }
  };

  const handleContinue = () => {
    if (onNext) {
      onNext();
    } else if (handleButtonPress) {
      handleButtonPress(formikProps, '');
    }
  };

  const partnerGridRender = itemObject => {
    return (
      <Grid item md={6} xs={12}>
        <Text
          id={itemObject.labelId}
          variant="h5"
          className={classes.partnerTitle}>
          {itemObject.label}
        </Text>
        <Box className={classes.receiverWrapper}>
          {/* <SimpleImg
                style={{
                  maxHeight: 44,
                  maxWidth: 44,
                }}
                imgStyle={{
                  width: 44,
                  height: 44,
                  borderRadius: 24,
                  objectFit: 'cover',
                }}
                src={'https://dummyimage.com/44X44/1280c9/e4e5f5.png'}
              /> */}
          <Badge
            text={itemObject.value || itemObject.value2}
            radius={20}
            maxLength={1}
          />
          <Box className={classes.partnerTextWrapper}>
            {itemObject.value && (
              <Text variant="subtitle2" className={classes.receiver}>
                {itemObject.value}
              </Text>
            )}
            {itemObject.value2 && (
              <Text variant="body2" className={classes.receiverEmail}>
                {itemObject.value2}
              </Text>
            )}
          </Box>
        </Box>
      </Grid>
    );
  };

  const amountGridRender = itemObject => {
    return (
      <Grid item md={6} xs={12}>
        <Text
          id={itemObject.labelId}
          variant="h5"
          className={classes.partnerTitle}>
          {itemObject.label}
        </Text>
        <Text variant="h5" className={classes.sendingAmountTitle}>
          {itemObject?.value}
        </Text>
        {itemObject.value2 && (
          <Text variant="body2" className={classes.greyTextColor}>
            {itemObject.value2}
          </Text>
        )}
      </Grid>
    );
  };

  return (
    <PageContent style={pageStyle}>
      {showHeader && (
        <PageTitle
          titleId="success"
          titleVariant="h6"
          noPadding
          mb={3}
          back
          handleBack={handleContinue}
        />
      )}
      <Box className={classes.successIconWrapper}>
        <LottieImage name="success" size={200} />
        <Text align="center" variant="h5" className={classes.successDate}>
          {performedDate}
        </Text>
      </Box>
      <Grid container spacing={3}>
        {amountItem && amountGridRender(amountItem)}
        {amount2Item && amountGridRender(amount2Item)}
        {recipientItem && partnerGridRender(recipientItem)}
      </Grid>
      {(transferFromItem || transferToItem) && (
        <Grid container spacing={3} className={classes.gridVGap}>
          {transferFromItem && partnerGridRender(transferFromItem)}
          {transferToItem && partnerGridRender(transferToItem)}
        </Grid>
      )}
      {(noteItem || memoItem) && (
        <Grid container spacing={3} className={classes.gridVGap}>
          {noteItem && (
            <Grid item md={6} xs={12}>
              <Text
                variant="h5"
                id={noteItem.labelId}
                className={classes.partnerTitle}>
                {noteItem.label}
              </Text>
              <Text
                className={classes.greyTextColor}
                variant="body2"
                style={{ marginTop: 4 }}>
                {noteItem.value}
              </Text>
            </Grid>
          )}
          {memoItem && (
            <Grid item md={6} xs={12}>
              <Text
                variant="h5"
                id={memoItem.labelId}
                className={classes.partnerTitle}>
                {memoItem.label}
              </Text>
              <Text
                className={classes.greyTextColor}
                variant="body2"
                style={{ marginTop: 4 }}>
                {memoItem.value}
              </Text>
            </Grid>
          )}
        </Grid>
      )}
      {successMessage && (
        <Text className={classes.successMessage}>{successMessage}</Text>
      )}
      {successMessageId && (
        <View mt={2} aI={'center'}>
          <Text
            id={successMessageId}
            style={{ ...successMessageStyle, textAlign: 'center' }}
            myColor={'primary'}
          />
        </View>
      )}
      {(fromAccount || itemsExtra.length > 0 || groupItemsExtra.length > 0) && (
        <Accordion 
          className={classes.accordionStyle}
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Text id="details" variant="h6" />
          </AccordionSummary>
          <AccordionDetails>
            <Box className={classes.detailsWrapper}>
              {fromAccount && (
                <Box className={classes.detailsItemWrapper}>
                  <Text id="from_account" variant="body2" s={12} />
                  <Box className={classes.detailsItemValueWrapper}>
                    <Text
                      variant="body2"
                      color="primary"
                      className={classes.detailsItemValue}>
                      {fromAccount}
                    </Text>
                  </Box>
                </Box>
              )}
              {itemsExtra.map(item => (
                <Box
                  id={item.id}
                  key={item.id}
                  className={classes.detailsItemWrapper}>
                  <Text variant="body2" id={item.labelId} s={12}>
                    {item.label}
                  </Text>
                  <Box 
                    className={classes.detailsItemValueWrapper}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Box style={{ flex: 1 }}>
                      <Text
                        variant="body2"
                        color="primary"
                        className={classes.detailsItemValue}
                        style={{
                          textTransform: item.textTransform || 'inherit',
                          wordBreak: item.copyable ? 'break-all' : 'normal',
                          fontSize: item.copyable ? '11px' : '12px'
                        }}>
                        {item.value}
                      </Text>
                      {item.value2 && (
                        <Text
                          variant="body2"
                          color="primary"
                          style={{
                            textTransform: item.textTransform || 'inherit',
                          }}
                          className={classes.detailsItemValue2}>
                          {item.value2}
                        </Text>
                      )}
                    </Box>
                    {item.copyable && (
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(item.value, showToast)}
                        style={{ padding: '4px' }}
                      >
                        <Icon 
                          icon={'link'}
                          circled={false}
                          color={'primary'}
                          style={{ fontSize: 16 }}
                        />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              ))}
              {groupItemsExtra.map(groupItem =>
                groupItem.items.length > 0 ? (
                  <Box key={groupItem.id}>
                    <Text
                      id={groupItem.labelId}
                      variant="h6"
                      style={{ marginTop: 24 }}>
                      {groupItem.label}
                    </Text>
                    {groupItem.items.map(item => (
                      <Box key={item.id} className={classes.detailsItemWrapper}>
                        <Text
                          id={item.labelId}
                          variant="body2"
                          s={12}>
                          {item.label}
                        </Text>
                        <Box className={classes.detailsItemValueWrapper}>
                          <Text
                            variant="body2"
                            color="primary"
                            className={classes.detailsItemValue}>
                            {item.value}
                          </Text>
                          {item.value2 && (
                            <Text
                              variant="body2"
                              color="primary"
                              className={classes.detailsItemValue2}>
                              {item.value2}
                            </Text>
                          )}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                ) : null,
              )}
              {secondaryAction && secondaryAction()}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      <div style={{ marginTop: 20 }} />
      <PageButtons
        items={customButtons || [
          {
            id: 'view_transaction',
            onPress: handleViewTransaction,
            variant: 'outlined',
            wide: true,
            capitalize: true,
          },
          {
            id: 'new_transaction',
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
export default SuccessPage;
