import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { concatBankAccount } from 'util/general';
import { statusText } from 'screens/settings/util';
import { EMPTY_BANK_ACCOUNT } from 'config/empty';
import Inputs from '../../components/inputs';
import { difference } from 'lodash';
import {
  updateItem,
  addBankAccountCurrency,
  deleteBankAccountCurrency,
  getBankAccounts,
  deleteItem,
} from 'util/rehive';
import { getCode, getName } from 'country-list';
import { BankAccountForm } from 'screens/settings/components/BankAccountForm';
// Import required components for styling
import List from '@material-ui/core/List';
import Output from 'components/outputs/Output';
import ResponsiveFlexBox from 'components/layout/ResponsiveFlexBox';
import { View } from 'components/layout/View';
import PageButtons from 'components/layout/page/PageButtons';
import SettingsActions from 'screens/profile/components/ProfileActions';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';
// Import for edit/delete icons
import IconButton from 'components/inputs/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Box } from '@material-ui/core';
// Import custom modal component
import Modal from 'components/layout/Modal';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import ConfirmModal from 'components/layout/ConfirmModal';
import ButtonList from 'components/lists/ButtonList';

// API Functions
async function fetchBankAccounts() {
  try {
    const resp = await getBankAccounts();
    
    // Check different possible response structures
    if (resp?.status === 'success' && resp?.data) {
      return resp.data;
    } else if (Array.isArray(resp)) {
      return resp;
    } else if (resp?.results) {
      return resp.results;
    } else if (resp?.items) {
      return resp.items;
    }
    
    return [];
  } catch (e) {
    console.error('Error fetching bank accounts:', e);
    return [];
  }
}

function mapDefaultValues(values) {
  const { currencies = [] } = values;
  
  // Ensure currencies is always a proper array
  let formattedCurrencies = [];
  
  // Handle different possible currency formats
  if (Array.isArray(currencies)) {
    formattedCurrencies = currencies.map(item => {
      // If item is already a string, return it
      if (typeof item === 'string') return item;
      // If item is an object with a code property, return the code
      return item?.code || '';
    }).filter(Boolean); // Remove empty strings
  } else if (typeof currencies === 'string') {
    // If currencies is a string, split it by comma
    formattedCurrencies = currencies.split(',').map(item => item.trim()).filter(Boolean);
  }
  
  return {
    ...values,
    ...(values?.branch_address ?? {}),
    country: getName(values?.branch_address?.country ?? ''),
    currencies: formattedCurrencies,
  };
}

// Form configuration for adding/editing bank accounts
const formConfig = props => {
  // Get configuration from settingsConfig
  const { reduxContext = {} } = props;
  const { settingsConfig = {} } = reduxContext;
  
  // Try to find the actual config from various sources
  const config = settingsConfig || props.context?.settingsConfig || props.settingsConfig || {};
  const { bank = {}, locales } = config;
  
  // Get field hiding configuration from settings
  const hideFields = bank.hideFields || [];
  
  // Get fields from the bank config if available
  const bankFieldsConfig = bank.fields || [];
  
  // Default fields used if no specific configuration is provided
  const defaultFields = [
    'account_name',
    'account_number',
    'type',
    'bank_name',
    'bank_code',
    'branch_code',
    'bic',
    'swift',
    'iban',
    'routing_number',
    'clabe'
  ];

  // Use configurable fields if available, otherwise use defaults
  let fields = bankFieldsConfig.length > 0 ? bankFieldsConfig : defaultFields;

  // Filter out fields that should be hidden
  fields = fields.filter(item => hideFields.indexOf(item) === -1);

  const sections = [
    { id: 'currencies', fields: ['currencies'] },
    {
      id: 'account',
      title: 'account_details',
      fields,
    },
    {
      id: 'address',
      title: 'address',
      fields: [
        'line_1',
        'line_2',
        'city',
        'state_province',
        'country',
        'postal_code',
      ],
    },
  ];
  
  // If owner section is enabled in the configuration
  if (bank.showOwnerSection) {
    sections.push({
      id: 'owner',
      title: 'account_owner',
      fields: [
        'owner.full_name',
        'owner.email_address',
        'owner.phone_number',
        'owner.company_name',
        'owner.ein_tin',
        'owner.cpf_cpnj',
        // Add additional owner fields from config if present
        ...(bank.ownerFields || [])
      ].filter(item => !hideFields.includes(item.replace('owner.', '')))
    });
  }
  
  // Make sure we have sane default values including empty array for currencies
  const defaultValues = {
    ...EMPTY_BANK_ACCOUNT,
    currencies: [],
  };
  
  return {
    defaultValues,
    submitLabel: 'save',
    submitLabelCapitalize: true,
    actions: true,
    mapDefaultValues,
    inputComponents: Inputs,
    onSubmit: createData,
    sections,
    locales,
  };
};

// Create or update bank account
async function createData(values, control, props) {
  const { itemId, onSuccess, showToast } = props;
  const { setSubmitting, setError } = control;
  const { currencies, country } = values || {};
  
  // Ensure currencies is a valid array
  let parsedCurrencies = [];
  if (currencies) {
    if (Array.isArray(currencies)) {
      parsedCurrencies = currencies.map(curr => 
        typeof curr === 'object' && curr.code ? curr.code : curr
      ).filter(Boolean);
    } else if (typeof currencies === 'string') {
      parsedCurrencies = currencies.split(',').map(c => c.trim()).filter(Boolean);
    }
  }
  
  if (!parsedCurrencies.length > 0) {
    setError('currencies', {
      type: 'manual',
      message: 'Please include account currency',
    });
  } else {
    if (typeof setSubmitting === 'function') setSubmitting(true);
    const newCurrencies = parsedCurrencies;
    
    // Filter out read-only fields and only include editable fields
    const editableFields = {
      name: values.name,
      number: values.number,
      type: values.type,
      bank_name: values.bank_name,
      bank_code: values.bank_code,
      branch_code: values.branch_code,
      swift: values.swift,
      iban: values.iban,
      // Include routing_number if it exists in the form values
      ...(values.routing_number && { routing_number: values.routing_number }),
      // Include clabe if it exists in the form values
      ...(values.clabe && { clabe: values.clabe }),
    };
    
    // Include any nested owner fields if they exist
    Object.keys(values).forEach(key => {
      if (key.startsWith('owner.') || key.startsWith('branch_address.')) {
        editableFields[key] = values[key];
      }
    });
    
    // Include owner if it exists
    if (values.owner) {
      editableFields.owner = values.owner;
    }
    
    // Set branch_address
    editableFields.branch_address = {
      ...(values.branch_address || {}),
      country: getCode(country ? country : ''),
    };
    
    try {
      // First, update the bank account details
      const resp = await updateItem('bankAccounts', editableFields, itemId);
      
      // Add currencies field to the update to avoid separate API calls
      if (resp && resp.id) {
        // Get old currencies from the response
        const oldCurrencies = resp.currencies.map(item => item.code);
        
        // To avoid multiple API calls, only process currencies if there's a difference
        const toAdd = difference(newCurrencies, oldCurrencies);
        const toRemove = difference(oldCurrencies, newCurrencies);
        
        // Only make currency API calls if changes are needed
        if (toAdd.length > 0 || toRemove.length > 0) {
          const promises = [];
          
          // Add currencies in parallel
          if (toAdd.length > 0) {
            for (const currency of toAdd) {
              promises.push(addBankAccountCurrency(resp.id, currency));
            }
          }
          
          // Remove currencies in parallel
          if (toRemove.length > 0) {
            for (const currency of toRemove) {
              promises.push(deleteBankAccountCurrency(resp.id, currency));
            }
          }
          
          // Wait for all currency operations to complete
          if (promises.length > 0) {
            await Promise.all(promises);
          }
        }
      }
      
      onSuccess(resp?.data?.id);
      showToast({
        id: `bank_account_${itemId ? 'edit' : 'add'}_success`,
        variant: 'success',
      });
    } catch (e) {
      console.error('Error updating bank account:', e);
      showToast({
        id: `bank_account_${itemId ? 'edit' : 'add'}_error`,
        variant: 'error',
      });
    }

    if (typeof setSubmitting === 'function') setSubmitting(false);
  }
}

// Delete bank account
async function deleteData(props) {
  const { itemId, onSuccess, showToast, setSubmitting } = props;
  
  if (typeof setSubmitting === 'function') setSubmitting(true);
  
  try {
    await deleteItem('bankAccounts', itemId);
    showToast({
      id: 'bank_account_delete_success',
      variant: 'success',
    });
    onSuccess();
  } catch (error) {
    console.error('Error deleting bank account:', error);
    showToast({
      id: 'bank_account_delete_failed',
      variant: 'error',
    });
  }
  
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

// Skeleton loader component for bank accounts
const BankAccountSkeleton = () => {
  // Create an array of 3 items to simulate a list of bank accounts
  const skeletonItems = [1, 2, 3];
  
  return (
    <>
      {skeletonItems.map((item, index) => (
        <View pv={0.5} w={'100%'} key={index}>
          <ResponsiveFlexBox
            left={
              <View>
                {/* Skeleton for the bank name */}
                <View 
                  style={{
                    height: 18,
                    width: 180,
                    backgroundColor: '#EFEFEF',
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                />
                {/* Skeleton for the bank details */}
                <View 
                  style={{
                    height: 14,
                    width: 120,
                    backgroundColor: '#EFEFEF',
                    borderRadius: 4,
                  }}
                />
              </View>
            }
            right={
              <View jC={'flex-end'} aI={'center'} fD={'row'} pl={0.5}>
                {/* Skeleton for action buttons */}
                <View 
                  style={{
                    height: 36,
                    width: 80,
                    backgroundColor: '#EFEFEF',
                    borderRadius: 4,
                  }}
                />
              </View>
            }
          />
        </View>
      ))}
    </>
  );
};

// Custom component that uses real API data but styled like SettingsList
const ApiBankComponent = (props) => {
  const { t } = useTranslation(['settings']);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const { handleStateChange, showToast, context, reduxData } = props;
  
  // Function to fetch and update accounts
  const refreshAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await fetchBankAccounts();
      setBankAccounts(accounts || []);
    } catch (error) {
      console.error('Error refreshing bank accounts:', error);
    } finally {
      setLoading(false);
      setContentLoaded(true); // Mark content as loaded after first fetch completes
    }
  };

  // Try to get bank accounts from props first, then fetch
  useEffect(() => {
    // Check if bank accounts are already in the props
    const accountsFromProps = reduxData?.bankAccounts?.items || 
                             context?.bankAccounts?.items || 
                             [];
    
    if (accountsFromProps.length > 0) {
      setBankAccounts(accountsFromProps);
      setLoading(false);
      setContentLoaded(true); // Mark content as loaded when using props data
    } else {
      // Otherwise fetch from API
      refreshAccounts();
    }
  }, [context, reduxData]); // Rerun if context or reduxData changes

  // Effect to find the account to edit when state changes
  useEffect(() => {
    console.log('State change detected:', {
      stateId: props.stateId,
      itemId: props.itemId,
      accountsCount: bankAccounts.length,
      modalIsOpen: modalOpen
    });
    
    // Only process state changes if the modal is not already open
    // This prevents the modal from reopening after it's been closed
    if (!modalOpen) {
      // Use a function that groups the state updates to avoid race conditions
      const updateModalState = () => {
        if (props.stateId === 'edit' && props.itemId && bankAccounts.length > 0) {
          // Ensure itemId is treated as a number for comparison
          const itemIdAsNumber = Number(props.itemId);
          const foundAccount = bankAccounts.find(acc => acc.id === itemIdAsNumber);
          console.log('Found account for editing:', foundAccount);
          
          if (foundAccount) {
            setAccountToEdit(foundAccount);
            setTimeout(() => setModalOpen(true), 10); // Delay to avoid state update conflicts
          } else {
            // If account not found but URL has edit state, reset URL
            if (props.history && typeof props.history.push === 'function') {
              props.history.push('/settings/bank/');
            } else if (window.history && typeof window.history.pushState === 'function') {
              const baseUrl = window.location.pathname.split('/settings/bank/')[0];
              window.history.pushState({}, '', `${baseUrl}/settings/bank/`);
            }
          }
        } else if (props.stateId === 'new') {
          console.log('New account state detected, opening modal');
          setAccountToEdit(null); // Reset when adding new
          setTimeout(() => setModalOpen(true), 10); // Delay to avoid state update conflicts
        } else if (props.stateId !== 'edit' && props.stateId !== 'new') {
          console.log('Resetting account edit state');
          // Reset all editing-related states when returning to main view
          setAccountToEdit(null);
          setModalOpen(false);
          setDeleteModalOpen(false);
          setAccountToDelete(null);
        }
      };
      
      // Execute the state updates
      updateModalState();
    }
  }, [props.stateId, props.itemId, bankAccounts, modalOpen]);

  // Monitor changes to bankAccounts array
  useEffect(() => {
    console.log('Bank accounts changed:', bankAccounts.length);
    
    // If we're in edit mode but the account no longer exists, return to list view
    if (props.stateId === 'edit' && props.itemId && bankAccounts.length > 0) {
      const itemIdAsNumber = Number(props.itemId);
      const accountExists = bankAccounts.some(acc => acc.id === itemIdAsNumber);
      
      if (!accountExists) {
        console.log('Account no longer exists, returning to list view');
        // Reset all editing states
        setAccountToEdit(null);
        setModalOpen(false);
        
        // Reset URL state if using handleStateChange
        if (typeof handleStateChange === 'function') {
          handleStateChange(null, '');
        }
        
        // Update URL if using history
        if (props.history && typeof props.history.push === 'function') {
          props.history.push('/settings/bank/');
        } else if (window.history && typeof window.history.pushState === 'function') {
          // Fallback to browser's history API
          const baseUrl = window.location.pathname.split('/settings/bank/')[0] + '/settings/bank/';
          window.history.pushState({}, '', baseUrl);
        }
      }
    }
  }, [bankAccounts, props.stateId, props.itemId]);

  // Callback for BankAccountForm save success
  const handleSaveSuccess = (id) => {
    // Always update the URL first to prevent reopening
    if (props.history && typeof props.history.push === 'function') {
      // If we have access to history from React Router, use it
      props.history.push('/settings/bank/');
    } else if (window.history && typeof window.history.pushState === 'function') {
      // Fallback to browser's history API
      const baseUrl = window.location.pathname.split('/settings/bank/')[0];
      window.history.pushState(
        {}, 
        '', 
        `${baseUrl}/settings/bank/`
      );
    }
    
    // Reset modal states
    setModalOpen(false);
    setAccountToEdit(null);
    
    // Update the handleStateChange if available
    if (typeof handleStateChange === 'function') {
      handleStateChange(null, '');
    }
    
    // Refresh accounts to show updated data
    refreshAccounts();
    
    // Show success message if showToast is available
    if (typeof showToast === 'function') {
      // Determine if this was an edit or add operation
      const isEdit = Boolean(accountToEdit?.id);
      showToast({
        id: `bank_account_${isEdit ? 'edit' : 'add'}_success`,
        variant: 'success',
      });
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    // Reset modal state
    setModalOpen(false);
    setAccountToEdit(null);
    
    // Update URL/state directly
    if (typeof handleStateChange === 'function') {
      handleStateChange(null, '');
    } else if (props.history && typeof props.history.push === 'function') {
      props.history.push('/settings/bank/');
    } else if (window.history && typeof window.history.pushState === 'function') {
      const baseUrl = window.location.pathname.split('/settings/bank/')[0];
      window.history.pushState({}, '', `${baseUrl}/settings/bank/`);
    }
  };

  // Add back the handleModalDismiss function
  const handleModalDismiss = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Call the main close handler directly
    handleModalClose();
  };

  // Formatting functions to match the expected format for SettingsList
  const getLabelForItem = (item) => item?.name || item?.bank_name || 'Unnamed Account';
  const getValueForItem = (item) => concatBankAccount(item, true);
  const getStatusForItem = (item) => statusText(item);
  
  // Handle adding new account
  const handleAddClick = () => {
    console.log('Add New button clicked');
    if (typeof handleStateChange === 'function') {
      console.log('Using handleStateChange to set state to "new"');
      handleStateChange(null, 'new');
    } else {
      // If handleStateChange is not available, open modal directly
      console.log('handleStateChange not available, opening modal directly');
      setAccountToEdit(null);
      setModalOpen(true);
      
      // Update the URL to reflect new account state
      if (props.history && typeof props.history.push === 'function') {
        // If we have access to history from React Router, use it
        props.history.push('/settings/bank/new/');
      } else if (window.history && typeof window.history.pushState === 'function') {
        // Fallback to browser's history API
        const baseUrl = window.location.pathname.split('/settings/bank/')[0];
        window.history.pushState(
          { stateId: 'new' }, 
          '', 
          `${baseUrl}/settings/bank/new/`
        );
      }
    }
  };
  
  // Handle deleting account
  const handleDeleteAccount = async (account) => {
    try {
      await deleteData({
        itemId: account.id,
        onSuccess: () => {
          // Filter out the deleted account from the local state
          const updatedAccounts = bankAccounts.filter(a => a.id !== account.id);
          setBankAccounts(updatedAccounts);
          
          // Reset all editing states
          setAccountToEdit(null);
          setModalOpen(false);
          setDeleteModalOpen(false);
          setAccountToDelete(null);
          
          // Reset URL state if using handleStateChange
          if (typeof handleStateChange === 'function') {
            handleStateChange(null, '');
          }
          
          // Update URL if using history
          if (props.history && typeof props.history.push === 'function') {
            props.history.push('/settings/bank/');
          } else if (window.history && typeof window.history.pushState === 'function') {
            // Fallback to browser's history API
            const baseUrl = window.location.pathname.split('/settings/bank/')[0] + '/settings/bank/';
            window.history.pushState({}, '', baseUrl);
          }
          
          // Show success toast
          if (typeof showToast === 'function') {
            showToast({
              id: 'bank_account_delete_success',
              variant: 'success',
            });
          }
        },
        showToast: showToast || (msg => console.log('Toast message:', msg)),
        setSubmitting: () => {} // Provide empty function if not available
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      if (typeof showToast === 'function') {
        showToast({
          id: 'bank_account_delete_error',
          variant: 'error',
        });
      }
    }
  };

  // Simplify the openDeleteConfirmModal function - ONLY update URL, no state changes
  const openDeleteConfirmModal = (e, account) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // ONLY update the URL, never set state directly
    // This ensures the modal is only opened through the useEffect
    if (typeof handleStateChange === 'function') {
      // Use the handleStateChange function to update the state
      handleStateChange(account, 'delete');
    } else {
      // Fallback to direct URL manipulation
      if (props.history && typeof props.history.push === 'function') {
        props.history.push(`/settings/bank/${account.id}/delete/`);
      } else if (window.history && typeof window.history.pushState === 'function') {
        const baseUrl = window.location.pathname.split('/settings/bank/')[0];
        window.history.pushState(
          { itemId: account.id, stateId: 'delete' }, 
          '', 
          `${baseUrl}/settings/bank/${account.id}/delete/`
        );
      }
      
      // DO NOT set accountToDelete here - let the useEffect handle it
    }
  };

  // Update closeDeleteConfirmModal to handle URL when closing modal
  const closeDeleteConfirmModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // First close the modal
    setDeleteModalOpen(false);
    
    // Then update the URL/state to remove the delete state
    if (typeof handleStateChange === 'function') {
      handleStateChange(null, '');
    } else if (props.history && typeof props.history.push === 'function') {
      props.history.push('/settings/bank/');
    } else if (window.history && typeof window.history.pushState === 'function') {
      const baseUrl = window.location.pathname.split('/settings/bank/')[0];
      window.history.pushState({}, '', `${baseUrl}/settings/bank/`);
    }
  };

  // Simplify the handleConfirmDelete function - direct call to handleDeleteAccount 
  const handleConfirmDelete = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (accountToDelete) {
      setDeleteModalOpen(false);
      handleDeleteAccount(accountToDelete);
    }
  };

  // Update the delete monitoring useEffect to be the ONLY place the modal is opened
  useEffect(() => {
    // Only process delete state changes if the modal is not already open
    if (props.stateId === 'delete' && props.itemId) {
      const itemIdAsNumber = Number(props.itemId);
      const accountToRemove = bankAccounts.find(acc => acc.id === itemIdAsNumber);
      
      if (accountToRemove) {
        console.log('URL-based delete detected, opening modal for account:', accountToRemove);
        
        // This is the ONLY place in the entire code where these two state changes happen
        setAccountToDelete(accountToRemove);
        setDeleteModalOpen(true);
      } else {
        // Account not found, return to main view
        console.log('Account to delete not found, returning to main view');
        if (typeof handleStateChange === 'function') {
          handleStateChange(null, '');
        } else if (props.history && typeof props.history.push === 'function') {
          props.history.push('/settings/bank/');
        } else if (window.history && typeof window.history.pushState === 'function') {
          const baseUrl = window.location.pathname.split('/settings/bank/')[0];
          window.history.pushState({}, '', `${baseUrl}/settings/bank/`);
        }
      }
    } else if (props.stateId !== 'delete') {
      // If we're not in delete state, ensure delete modal is closed
      if (deleteModalOpen) {
        setDeleteModalOpen(false);
      }
    }
  }, [props.stateId, props.itemId, bankAccounts]);

  // Render account list items - extracted to prevent re-renders during modal transitions
  const renderAccountList = () => {
    if (!contentLoaded) return null;
    
    if (bankAccounts.length === 0) {
      return <EmptyListPlaceholderImage name="bankAccounts" text="bank_account_empty" />;
    }
    
    return bankAccounts.map((item, index) => (
      <View pv={0.5} w={'100%'} key={item && item.id ? item.id : index}>
        <ResponsiveFlexBox
          left={
            <Output
              label={getLabelForItem(item)}
              labelBold
              placeholderId="no_details_provided"
              values={getValueForItem(item, true)}
            />
          }
          right={
            <View jC={'flex-end'} aI={'center'} fD={'row'} pl={0.5}>
              <Box display="flex" flexDirection="row" alignItems="center">
                <IconButton
                  style={{ 
                    padding: 4,
                    marginRight: 0
                  }}
                  onClick={(e) => {
                    // Prevent event propagation
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
                    
                    // Create a clean copy of the account data
                    const accountToRemove = {...item};
                    
                    // Always use the URL update pattern, never open modal directly
                    openDeleteConfirmModal(e, accountToRemove);
                  }}
                >
                  <DeleteIcon style={{ fontSize: 22, color: '#757575' }} />
                </IconButton>
                <IconButton
                  style={{ 
                    padding: 4
                  }}
                  onClick={(e) => {
                    // Prevent event propagation
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();
                    
                    // Process click directly without delays
                    if (typeof props.handleStateChange === 'function') {
                      props.handleStateChange(item, 'edit');
                    } else {
                      // Set the local editing state directly
                      setAccountToEdit(item);
                      setModalOpen(true);
                      
                      // Update the URL to reflect edit mode
                      if (props.history && typeof props.history.push === 'function') {
                        props.history.push(`/settings/bank/${item.id}/edit/`);
                      } else if (window.history && typeof window.history.pushState === 'function') {
                        const baseUrl = window.location.pathname.split('/settings/bank/')[0];
                        window.history.pushState(
                          { itemId: item.id, stateId: 'edit' }, 
                          '', 
                          `${baseUrl}/settings/bank/${item.id}/edit/`
                        );
                      }
                    }
                  }}
                >
                  <EditIcon style={{ fontSize: 22, color: '#757575' }} />
                </IconButton>
              </Box>
            </View>
          }
        />
      </View>
    ));
  };
  
  // Otherwise render the list styled like SettingsList
  return (
    <React.Fragment>
      {/* Bank account form modal */}
      <Modal
        close
        maxWidth={450}
        title={props.stateId === 'new' ? t('bank_new') : t('bank_edit')}
        open={modalOpen}
        onDismiss={handleModalDismiss}
        borderRadius={16}
        disableBackdropClick={false}
        disableEscapeKeyDown={false}
      >
        <BankAccountForm
          item={accountToEdit}
          type="bankAccounts"
          onDetailClose={handleModalClose}
          onSaveSuccess={handleSaveSuccess}
          settingsConfig={props.reduxContext?.settingsConfig || props.context?.settingsConfig || props.settingsConfig || {}}
          actionsConfig={{}}
          showComplexFields={true}
          noPadding
          accounts={props.currencies || props.reduxData?.currencies?.items || props.context?.currencies?.items || []}
          initialCurrency={accountToEdit?.currencies?.[0]?.code}
          showToast={showToast}
          formConfig={formConfig(props)}
          reduxContext={props.reduxContext}
          itemId={accountToEdit?.id}
        />
      </Modal>
      
      {/* Direct inclusion of ConfirmModal */}
      <ConfirmModal
        visible={deleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteConfirmModal}
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
      
      <List style={{ width: '100%', paddingLeft: 32, paddingRight: 24 }}>
        {loading && !contentLoaded ? 
          <BankAccountSkeleton /> : 
          renderAccountList()
        }
      </List>

      {!props.stateId && contentLoaded && (
        <PageButtons
          layout="material"
          items={[
            {
              thin: true,
              color: 'primary',
              id: 'add_new',
              capitalize: true,
              onClick: handleAddClick,
            },
          ]}
        />
      )}
    </React.Fragment>
  );
};

// Export the config with our custom component
const bankConfig = {
  id: 'bank',
  title: 'Bank accounts',
  variant: 'custom',
  renderDetail: ApiBankComponent, // Use ApiBankComponent for rendering list/edit/delete
  component: ApiBankComponent, // Also use ApiBankComponent as the main component
  parent: 'externalAccounts'
};

export default bankConfig;
