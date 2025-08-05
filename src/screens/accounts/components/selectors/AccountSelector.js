import React, { useMemo, useState } from 'react';
import AccountCard from '../currency/AccountCard';
import Text from 'components/outputs/Text';
import Box from '@material-ui/core/Box';
import { Button } from 'components/inputs/Button';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import PageContent from 'components/layout/page/PageContent';
import Label from 'components/outputs/Label';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import PageTitle from 'components/layout/page/PageTitle';
import { useTheme } from 'components/app/context';
import Help from '@material-ui/icons/Help';
import { View } from 'components/layout/View';
import Status from 'components/outputs/Status';
import Divider from '@material-ui/core/Divider';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment';
import { useMediaQuery } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmModal from 'components/layout/ConfirmModal';
import IconButton from 'components/inputs/IconButton';

const useStyles = makeStyles(theme => ({
  headerWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 28,
  },
  headerBackIcon: { fontSize: 14, zIndex: 99, cursor: 'pointer' },
  addButton: {
    color: theme.palette.primary.main,
    fontSize: 14,
    textTransform: 'none',
    fontWeight: 500,
    padding: '8px 16px',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  pendingAccountCard: {
    opacity: 0.9,
    position: 'relative',
    marginBottom: 16,
    border: 'none',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    boxSizing: 'border-box',
  },
  pendingOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: '4px 8px',
    zIndex: 10,
    backgroundColor: '#F5F5F5',
    color: '#8C8C8C',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  pendingSection: {
    marginTop: 32,
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    border: '1px solid #E8E8E8',
    [theme.breakpoints.down('xs')]: {
      padding: '12px',
    },
  },
  pendingSectionTitle: {
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingInfo: {
    fontSize: 12,
    color: '#8C8C8C',
    marginLeft: 8,
  },
  declinedAccountCard: {
    opacity: 0.9,
    position: 'relative',
    marginBottom: 16,
    border: 'none',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(1),
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    boxSizing: 'border-box',
  },
  declinedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: '4px 8px',
    zIndex: 10,
    backgroundColor: '#F5F5F5',
    color: '#8C8C8C',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  declinedSection: {
    marginTop: 32,
    padding: '16px',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    border: '1px solid #E8E8E8',
    [theme.breakpoints.down('xs')]: {
      padding: '12px',
    },
  },
  declinedSectionTitle: {
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  declinedInfo: {
    fontSize: 12,
    color: '#8C8E8C',
    marginLeft: 8,
  },
  declinedReason: {
    padding: '8px 12px',
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    border: '1px solid #E8E8E8',
  },
  declinedReasonText: {
    color: '#5F5F5F',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    lineHeight: '1',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    lineHeight: '1',
  },
  verifiedSection: {
    marginBottom: 32,
  },
  submissionDate: {
    fontSize: 12,
    color: '#8C8C8C',
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
  },
  dateIcon: {
    fontSize: 16,
    marginRight: 4,
    color: '#8C8C8C',
    display: 'flex',
    alignItems: 'center',
    lineHeight: '1',
  },
  expectedTime: {
    fontSize: 12,
    color: '#5F5F5F',
    marginTop: 4,
    fontStyle: 'italic',
    display: 'flex',
    alignItems: 'center',
  },
  accountCard: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  statusContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editButton: {
    padding: 4,
  },
  accountActions: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  declineReason: {
    backgroundColor: 'rgba(255, 76, 111, 0.1)',
    border: '1px solid rgba(255, 76, 111, 0.3)',
    borderRadius: 4,
    padding: '8px 12px',
    marginTop: 4,
    marginBottom: 16,
  },
  pendingMessage: {
    backgroundColor: 'rgba(250, 173, 20, 0.1)',
    border: '1px solid rgba(250, 173, 20, 0.3)',
    borderRadius: 4,
    padding: '8px 12px',
    marginTop: 4,
    marginBottom: 16,
  },
  selectedCard: {
    // Remove the border property
    // border: `1px solid ${theme.palette.primary.main}`,
  },
}));

const AccountSelector = ({
  accounts,
  pendingAccounts = [],
  declinedAccounts = [],
  selectedAccount,
  currency,
  onAddClick,
  handleAccountSelection,
  isCrypto,
  onHelp,
  allowCryptoBankWithdraw,
  hideCryptoAccounts,
  colors,
  onEditAccount,
  onDeleteAccount = null,
  requireVerifiedBankAccountForWithdraw,
  showEditForVerified = false,
  ...props
}) => {
  const classes = useStyles(props);
  const { colors: themeColors } = useTheme();
  const appColors = colors || themeColors;
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('xs'));

  // Add state for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  // Helper function to extract decline reason from account metadata
  const getDeclineReason = (account) => {
    try {
      // Check for service_bridge errors
      if (account?.metadata?.service_bridge?.errors?.non_field_errors?.length > 0) {
        return account.metadata.service_bridge.errors.non_field_errors[0];
      }
      
      // Check for other error locations in metadata
      if (account?.metadata?.errors?.non_field_errors?.length > 0) {
        return account.metadata.errors.non_field_errors[0];
      }
      
      // Check for error message directly in metadata
      if (account?.metadata?.error_message) {
        return account.metadata.error_message;
      }
      
      // Default message if no specific reason found
      return "Account was declined. Please try adding a new account.";
    } catch (error) {
      return "Account was declined. Please try adding a new account.";
    }
  };

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeDate = (dateString) => {
    try {
      if (!dateString) return '';
      return moment(dateString).fromNow();
    } catch (error) {
      return '';
    }
  };

  // Get submission date from account
  const getSubmissionDate = (account) => {
    try {
      // First check if there's a specific submission date in metadata
      if (account?.metadata?.submission_date) {
        return formatRelativeDate(account.metadata.submission_date);
      }
      
      // Otherwise use the created date
      return formatRelativeDate(account.created);
    } catch (error) {
      return '';
    }
  };

  const handleEditClick = (account, event) => {
    // Prevent the click from propagating to the parent (which would select the account)
    event.stopPropagation();
    if (onEditAccount) {
      onEditAccount(account);
    }
  };

  // Add handle delete click function
  const handleDeleteClick = (account, event) => {
    // Prevent the click from propagating to the parent (which would select the account)
    event.stopPropagation();
    setAccountToDelete(account);
    setShowDeleteConfirm(true);
  };

  // Add handle confirm delete function
  const handleConfirmDelete = () => {
    if (onDeleteAccount && accountToDelete) {
      onDeleteAccount(accountToDelete);
    }
    setShowDeleteConfirm(false);
    setAccountToDelete(null);
  };

  // --- DEBUG LOGGING START ---
  console.log('[AccountSelector] Props Received:');
  console.log('  requireVerifiedBankAccountForWithdraw:', requireVerifiedBankAccountForWithdraw);
  console.log('  Accounts:', accounts?.map(a => ({ id: a.id, status: a.status, name: a.name || a.bank_name })) );
  console.log('  Pending Accounts:', pendingAccounts?.map(a => ({ id: a.id, status: a.status, name: a.name || a.bank_name })) );
  console.log('  Declined Accounts:', declinedAccounts?.map(a => ({ id: a.id, status: a.status, name: a.name || a.bank_name })) );
  // --- DEBUG LOGGING END ---

  // Add console log here to check the received prop value
  console.log('[AccountSelector] requireVerifiedBankAccountForWithdraw:', requireVerifiedBankAccountForWithdraw);

  return (
    <>
      <PageTitle
        titleId="select_withdraw_accounts"
        titleVariant="h6"
        back
        handleBack={props.onBack}
        actions={
          <View
            style={{ 
              display: 'flex', 
              alignItems: 'baseline', 
              cursor: 'pointer'
            }}
            onClick={onHelp}>
            <Text
              color="primary"
              style={{
                textDecoration: 'underline',
                fontSize: 14,
              }}
              id="need_help"
              fallback="Need help?"
            />
          </View>
        }
      />
      <PageContent>
        {/* Conditional Rendering based on the flag */}
        {requireVerifiedBankAccountForWithdraw ? (
          // === SECTIONED LAYOUT - Render when flag is TRUE ===
          <>
            {/* Verified Accounts Section */}
            <Box className={classes.verifiedSection}>
              <Label id="verified_accounts" fallback="Verified Accounts" style={{ fontSize: 16, fontWeight: 500, color: '#424242' }} />
              <Divider style={{ margin: '8px 0 16px 0' }} />
              <Box>
                {accounts?.length ? (
                  accounts.map(item => (
                    <Box 
                      key={item.id} 
                      position="relative" 
                      className={`${classes.accountCard} ${selectedAccount?.id === item.id ? classes.selectedCard : ''}`}
                      onClick={() => handleAccountSelection(item)}
                    >
                      <AccountCard
                        item={item}
                        currency={currency}
                        crypto={isCrypto}
                        selected={selectedAccount?.id === item.id}
                      />
                      {showEditForVerified && (
                        <Box className={classes.statusContainer}>
                          {onDeleteAccount && (
                            <IconButton
                              className={classes.editButton}
                              onClick={(e) => handleDeleteClick(item, e)}
                            >
                              <DeleteIcon style={{ fontSize: 18, color: '#757575' }} />
                            </IconButton>
                          )}
                          <IconButton
                            className={classes.editButton}
                            onClick={(e) => handleEditClick(item, e)}
                          >
                            <EditIcon style={{ fontSize: 18, color: '#757575' }} />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  ))
                ) : (
                  <EmptyListMessage
                    id={
                      allowCryptoBankWithdraw
                        ? 'crypto_and_bank_empty'
                        : isCrypto
                        ? 'crypto_empty'
                        : 'bankAccounts_empty'
                    }
                  />
                )}
              </Box>
            </Box>

            {/* Pending Accounts Section */}
            {pendingAccounts?.length > 0 && (
              <Box className={classes.pendingSection}>
                <Label id="pending_accounts" fallback="Awaiting Verification" style={{ fontSize: 16, fontWeight: 500, color: '#424242' }} />
                <Divider style={{ margin: '8px 0 16px 0' }} />
                <Text 
                  id="pending_accounts_description" 
                  variant="body2" 
                  style={{ marginBottom: 16, color: '#5F5F5F', fontSize: 14 }}
                  fallback="These accounts are awaiting verification and will become available for withdrawals once approved."
                />
                <Box>
                  {pendingAccounts.map(item => (
                    <Box 
                      key={item.id} 
                      position="relative" 
                      className={`${classes.pendingAccountCard} ${selectedAccount?.id === item.id ? classes.selectedCard : ''}`}
                    >
                      <AccountCard
                        item={item}
                        currency={currency}
                        crypto={isCrypto}
                        selected={false}
                        disabled={true}
                      />
                      {/* Add Edit/Delete buttons for Pending Accounts */}
                      <Box className={classes.statusContainer}>
                        {onDeleteAccount && (
                          <IconButton
                            className={classes.editButton}
                            onClick={(e) => handleDeleteClick(item, e)}
                          >
                            <DeleteIcon style={{ fontSize: 18, color: '#757575' }} />
                          </IconButton>
                        )}
                        <IconButton
                          className={classes.editButton}
                          onClick={(e) => handleEditClick(item, e)}
                        >
                          <EditIcon style={{ fontSize: 18, color: '#757575' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Declined Accounts Section */}
            {declinedAccounts?.length > 0 && (
              <Box className={classes.declinedSection}>
                <Label id="declined_accounts" fallback="Declined Accounts" style={{ fontSize: 16, fontWeight: 500, color: '#424242' }} />
                <Divider style={{ margin: '8px 0 16px 0' }} />
                <Text 
                  id="declined_accounts_description" 
                  variant="body2" 
                  style={{ marginBottom: 16, color: '#5F5F5F', fontSize: 14 }}
                  fallback="These accounts were declined and cannot be used for withdrawals. Please check the reason for decline or add a new account."
                />
                <Box>
                  {declinedAccounts.map(item => (
                    <Box 
                      key={item.id} 
                      position="relative" 
                      className={`${classes.declinedAccountCard} ${selectedAccount?.id === item.id ? classes.selectedCard : ''}`}
                    >
                      <AccountCard
                        item={item}
                        currency={currency}
                        crypto={isCrypto}
                        selected={false}
                        disabled={true}
                      />
                      <Box className={classes.statusContainer}>
                        {onDeleteAccount && (
                          <IconButton
                            className={classes.editButton}
                            onClick={(e) => handleDeleteClick(item, e)}
                          >
                            <DeleteIcon style={{ fontSize: 18, color: '#757575' }} />
                          </IconButton>
                        )}
                        <IconButton
                          className={classes.editButton}
                          onClick={(e) => handleEditClick(item, e)}
                        >
                          <EditIcon style={{ fontSize: 18, color: '#757575' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        ) : (
          // === NEW LAYOUT (Single List) - Render when flag is FALSE ===
          <Box>
            <Label id="withdraw_to_account" fallback="Withdraw to Account" style={{ fontSize: 16, fontWeight: 500, color: '#424242' }} />
            <Divider style={{ margin: '8px 0 16px 0' }} />
            
            {accounts?.length ? (
              accounts.map(item => {
                const isSelectable = true;
                
                return (
                  <Box 
                    key={item.id} 
                    position="relative" 
                    className={`${classes.accountCard} ${selectedAccount?.id === item.id ? classes.selectedCard : ''}`}
                    onClick={() => handleAccountSelection(item)}
                  >
                    <AccountCard
                      item={item}
                      currency={currency}
                      crypto={isCrypto}
                      selected={selectedAccount?.id === item.id}
                    />
                    <Box className={classes.statusContainer}>
                      {onDeleteAccount && (
                        <IconButton
                          className={classes.editButton}
                          onClick={(e) => handleDeleteClick(item, e)}
                        >
                          <DeleteIcon style={{ fontSize: 18, color: '#757575' }} />
                        </IconButton>
                      )}
                      <IconButton
                        className={classes.editButton}
                        onClick={(e) => handleEditClick(item, e)}
                      >
                        <EditIcon style={{ fontSize: 18, color: '#757575' }} />
                      </IconButton>
                    </Box>
                  </Box>
                )
              })
            ) : (
              <EmptyListMessage
                id={
                  allowCryptoBankWithdraw
                    ? 'crypto_and_bank_empty'
                    : isCrypto
                    ? 'crypto_empty'
                    : 'bankAccounts_empty'
                }
              />
            )}
          </Box>
        )}

        <Box style={{ marginTop: 24 }}>
          {allowCryptoBankWithdraw && (
            <Button
              startIcon={<AddCircleIcon />}
              className={classes.addButton}
              onClick={() => onAddClick(true)}
              id="add_bank_account"
              variant="text"
              wrapperStyle={{ paddingBottom: 0, paddingTop: 16 }}
            />
          )}
          {(!isCrypto || !hideCryptoAccounts.includes(currency?.code)) && (
            <Button
              startIcon={<AddCircleIcon />}
              className={classes.addButton}
              onClick={() => onAddClick(false)}
              id={isCrypto ? 'add_crypto_account' : 'add_bank_account'}
              variant="text"
            />
          )}
        </Box>
      </PageContent>
      
      {/* Add Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setAccountToDelete(null);
        }}
        title="confirm_delete"
        buttonText="confirm"
      >
        <Text
          id="are_you_sure_to_delete"
          style={{ textAlign: 'center', marginBottom: 16 }}
        />
        {accountToDelete && (
          <View fD="column" aI="center" style={{ padding: '8px 16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <Text style={{ fontWeight: 'bold' }}>
              {accountToDelete.bank_name || accountToDelete.name || 'Account'}
            </Text>
            <Text style={{ fontSize: 14 }}>
              {accountToDelete.number || accountToDelete.address || ''}
            </Text>
          </View>
        )}
      </ConfirmModal>
    </>
  );
};

export default AccountSelector;
