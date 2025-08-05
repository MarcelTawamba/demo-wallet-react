import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Box, Grid } from '@material-ui/core';
import Text from 'components/outputs/Text';
import PageContent from './PageContent';
// import { SimpleImg } from 'react-simple-img';
import Badge from 'components/outputs/Badge';
import { arrayToObject } from 'util/general';
import PageButtons from 'components/layout/page/PageButtons';
import Info from 'components/outputs/Info';
import { View } from '../View';
import PageTitle from './PageTitle';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    width: '100%',
    wordBreak: 'break-all',
  },
  headerWrapper: { display: 'flex', alignItems: 'center', marginBottom: 48 },
  headerBackIcon: { fontSize: 14, cursor: 'pointer', zIndex: 99 },
  title: { paddingTop: theme.spacing(1), paddingBottom: theme.spacing(3) },
  partnerTitle: {
    color: theme.palette.primary.main,
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
  timerTitle: {
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'right',
    width: 'initial !important',
  },
  receiverWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
  },
  partnerTextWrapper: { marginLeft: 14, flex: 1 },
  receiver: { fontSize: 16, fontWeight: 500, wordBreak: 'break-all' },
  receiverEmail: { color: '#777777', wordBreak: 'break-all' },
  detailsWrapper: {
    margin: '10px 0',
    border: '1px solid #BEBEBE',
    borderRadius: 15,
    padding: '18px 24px',
  },
  detailsItemWrapper: {
    marginTop: 12,
    display: 'flex',
    justifyContent: 'space-between',
  },
  detailsItemValueWrapper: {
    minWidth: '50%',
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
  pageButtonWrapper: {
    marginTop: 20,
    marginBottom: 16,
  },
  cancelButton: {
    borderRadius: 100,
    color: theme.palette.primary.main,
    border: '1px solid',
  },
  confirmButton: {
    borderRadius: 100,
    backgroundColor: theme.palette.primary.main,
    color: '#FFFFFF',
  },
  pt0: { paddingTop: '0 !important' },
  text: {
    paddingBottom: theme.spacing(3),
    width: '100%',
    wordBreak: 'break-word',
  },
  gridVGap: {
    marginTop: 5,
    marginBottom: 5,
  },
}));

const ConfirmPage = props => {
  const {
    pageStyle = {},
    children,
    showHeader = true,
    fromAccount,
    items = [],
    itemsExtra = [],
    groupItemsExtra = [],
    timerItem,
    formikProps,
    handleButtonPress,
    onConfirm,
    onBack,
    disabled = false,
    isValid,
    isSubmitting,
    infoMessage,
    confirmMessageId,
    confirmMessageStyle,
  } = props;
  const classes = useStyles(props);
  const itemsObj = arrayToObject(items, 'id');
  const amountItem = itemsObj['amount'];
  const amount2Item = itemsObj['amount2'];
  const recipientItem = itemsObj['recipient'];
  const noteItem = itemsObj['note'];
  const memoItem = itemsObj['memo'];
  // transferFromItem & transferToItem only coming from Transfer view
  const transferFromItem = itemsObj['transfer_from'];
  const transferToItem = itemsObj['transfer_to'];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (handleButtonPress) {
      handleButtonPress(formikProps);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else if (handleButtonPress) {
      handleButtonPress(formikProps, 'confirm');
    }
  };

  const partnerGridRender = itemObject => {
    return (
      <Grid item md={6} xs={12}>
        <Text
          id={itemObject?.labelId ?? itemObject.label}
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

  const disableSubmit =
    (formikProps.isSubmitting || !formikProps.isValid || disabled) &&
    (!isValid || isSubmitting);
  const loading = formikProps.isSubmitting || isSubmitting;

  const showDetails =
    fromAccount || itemsExtra.length > 0 || groupItemsExtra.length > 0;

  return (
    <PageContent style={pageStyle}>
      {!showDetails && !!infoMessage && (
        <View pt={0.5}>
          <Info id={infoMessage} />
        </View>
      )}
      {showHeader && (
        <PageTitle
          titleId="confirm"
          titleVariant="h6"
          back
          noPadding
          mb={3}
          handleBack={handleBack}
          actions={
            timerItem !== undefined && (
              <Text variant="h5" className={classes.timerTitle}>
                {timerItem}
              </Text>
            )
          }
        />
      )}
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
                className={classes.partnerTitle}
                id={noteItem.labelId}>
                {noteItem.label}
              </Text>
              <Text
                className={classes.greyTextColor}
                variant="body2">
                {noteItem.value}
              </Text>
            </Grid>
          )}
          {memoItem && (
            <Grid item md={6} xs={12}>
              <Text
                variant="h5"
                className={classes.partnerTitle}
                id={memoItem.labelId}>
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

      {confirmMessageId && (
        <View mt={1} aI={'center'}>
          <Text
            id={confirmMessageId}
            style={{ ...confirmMessageStyle, textAlign: 'center' }}
            myColor={'primary'}
          />
        </View>
      )}

      {showDetails && (
        <Box className={classes.detailsWrapper}>
          <Text
            id="details"
            variant="h6"
            style={{ marginBottom: groupItemsExtra.length ? 0 : 12 }}
          />
          {!!infoMessage && <Info id={infoMessage} />}
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
            <Box key={item.id} className={classes.detailsItemWrapper}>
              <Text id={item.labelId} variant="body2" s={12}>
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
                    style={{ textTransform: item.textTransform || 'none' }}
                    className={classes.detailsItemValue2}>
                    {item.value2}
                  </Text>
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
                    <Text id={item.labelId} variant="body2" s={12}>
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
        </Box>
      )}
      {children}
      <PageButtons
        items={[
          {
            id: 'cancel',
            onPress: handleBack,
            variant: 'outlined',
            wide: true,
          },
          {
            id: 'confirm',
            type: 'submit',
            onPress: handleConfirm,
            wide: true,
            disabled: disableSubmit,
            loading: loading,
            capitalize: true,
          },
        ]}
      />
    </PageContent>
  );
};
export default ConfirmPage;
