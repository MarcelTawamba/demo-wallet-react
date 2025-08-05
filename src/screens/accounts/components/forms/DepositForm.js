import React, { useState, useRef, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useMediaQuery, useTheme as muiUseTheme, IconButton, Modal, Paper } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Image from 'components/outputs/Image';
import CompanyBankAccountsSelector from '../selectors/CompanyBankAccountSelector';
import AccountReference from 'screens/settings/components/AccountReference';
import PageContent from 'components/layout/page/PageContent';
import PageTitle from 'components/layout/page/PageTitle';
import PageButtons from 'components/layout/page/PageButtons';
import DepositList from './DepositPages/DepositList';
import { useTheme } from 'components/app/context';
import { Formik } from 'formik';
import Close from '@material-ui/icons/Close';
import { useQuery } from 'react-query';
import * as yup from 'yup';
import HelpCenterPage from 'screens/help_center';
import ManualDepositAccountCard from './DepositPages/ManualDepositAccountCard';
import { concat } from 'lodash';
import { useSelector } from 'react-redux';
import { configActionsStateSelector } from 'redux/rehive/selectors';
import { currentCompanyServicesSelector } from 'redux/auth/selectors';
import InfoOutlined from '@material-ui/icons/InfoOutlined';

import { getBankAccountsByFilter } from 'util/rehive';

const ViewNames = {
  manualDepositInit: 'manualDepositInit',
  manualDepositForm: 'manualDepositForm',
  help: 'help',
  manualMethodSelection: 'manualMethodSelection',
  depositNotAvailable: 'depositNotAvailable',
};

function DepositForm(props) {
  const classes = useStyles(props);
  const { colors } = useTheme();
  const muiTheme = muiUseTheme();
  const xs = useMediaQuery(muiTheme.breakpoints.down(500));
  const depositForm = useRef();
  const [viewName, setViewName] = useState(ViewNames.manualDepositInit);
  const [combinedManualAccounts, setCombinedManualAccounts] = useState([]);
  const [selectedManualAccount, setSelectedManualAccount] = useState();
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const actionsConfig = useSelector(configActionsStateSelector);
  const services = useSelector(currentCompanyServicesSelector);

  // Check if this currency has crypto bank support for deposit
  const cryptoAllowed = useMemo(() => {
    const currencyCode = props.currency?.currency?.code;
    const isCrypto = Boolean(props.currency?.crypto);
    
    // If it's not crypto, always allow bank deposits
    if (!isCrypto) return true;
    
    // If it is crypto, check if it's in the cryptoBankSupport array
    return Boolean(
      actionsConfig?.deposit?.config?.cryptoBankSupport?.some(
        item => item === currencyCode
      )
    );
  }, [props.currency, actionsConfig]);

  const screenTitle = useMemo(() => {
    switch (viewName) {
      case ViewNames.manualMethodSelection:
        return 'deposit_method';
      case ViewNames.help:
        return 'having_trouble_';
      default:
        return 'deposit_funds';
    }
  }, [viewName]);

  const bankAccounts = useMemo(() => {
    const { companyBankAccounts, currency } = props;
    
    // If it's a crypto currency and not in the allowed list, return empty array
    const isCrypto = Boolean(currency?.crypto);
    if (isCrypto && !cryptoAllowed) {
      return [];
    }
    
    return companyBankAccounts?.items.filter(
      acc =>
        acc.currencies.findIndex(
          curr => curr.code === currency?.currency?.code,
        ) !== -1,
    );
  }, [props.companyBankAccounts, props.currencyCode, props.currency, cryptoAllowed]);

  function handleInitialViewSet() {
    if (actionsConfig.deposit?.config?.hideDepositReference) {
      setViewName(ViewNames.manualDepositForm);
    } else {
      setViewName(ViewNames.manualDepositInit);
    }
  }

  const showBackButton = useMemo(() => {
    if (
      [
        ViewNames.manualMethodSelection,
        ViewNames.depositNotAvailable,
      ].includes(viewName)
    ) {
      return false;
    } else if (viewName === ViewNames.manualDepositInit) {
      return false;
    }
    return true;
  }, [viewName]);

  const {
    data: userBankAccounts,
    isLoading: loadingUserBankAccounts,
    refetch: refetchUserBankAccounts,
  } = useQuery(
    [props?.profile?.items?.id, props.currencyCode, props.account, 'deposit-bank-accounts'],
    async () => {
      // If it's a crypto currency and not in the allowed list, return empty array
      const isCrypto = Boolean(props.currency?.crypto);
      if (isCrypto && !cryptoAllowed) {
        return { data: [] };
      }
      
      // Fetch all bank accounts with action=deposit
      const response = await getBankAccountsByFilter('action=deposit');
      
      // Filter bank accounts that match either:
      // 1. The currency matches the currency code
      // 2. The account_currency matches the account and currency
      const filteredAccounts = response?.data?.filter(bankAccount => {
        const currencyMatch = bankAccount.currencies?.some(
          curr => curr.code === props.currencyCode
        );
        
        const accountCurrencyMatch = bankAccount.account_currencies?.some(
          accCurr => 
            accCurr.account.reference === props.account && 
            accCurr.currency.code === props.currencyCode
        );
        
        return currencyMatch || accountCurrencyMatch;
      });
      
      return { data: filteredAccounts };
    },
    {
      enabled: Boolean(props?.profile?.items?.id && props.currencyCode && props.account),
      staleTime: 2500,
    },
  );

  useEffect(() => {
    handleInitialViewSet();
    refetchUserBankAccounts();
    setCombinedManualAccounts([]);
    setSelectedManualAccount();
  }, [props.currencyCode]);

  useEffect(() => {
    if (userBankAccounts?.data) {
      // Combine bank accounts regardless of count - we'll show UI even if no accounts exist
      const combinedAccounts = concat(bankAccounts, userBankAccounts?.data);
      
      if (combinedAccounts.length === 1) {
        setSelectedManualAccount(combinedAccounts[0]);
      } else {
        setCombinedManualAccounts(combinedAccounts);
      }
    }
  }, [userBankAccounts, bankAccounts]);


  const renderManualMethodSelection = () => {
    // Always show method selection, even if no accounts exist
    return (
      <PageContent>
        <Text
          tA="center"
          id="deposit_method_description"
          style={{ marginBottom: 16 }}
        />
        {combinedManualAccounts.length > 0 ? (
          combinedManualAccounts.map(accountItem => (
            <ManualDepositAccountCard
              key={accountItem.id}
              account={accountItem}
              onAccountSelect={acc => {
                setSelectedManualAccount(acc);
                setViewName(ViewNames.manualDepositForm);
              }}
            />
          ))
        ) : (
          <Text tA="center" id="no_bank_accounts_available" />
        )}
      </PageContent>
    );
  };

  const renderDepositNotAvailable = () => {
    return (
      <PageContent>
        <Text tA="center" id="deposit_not_available" />
      </PageContent>
    );
  };

  const renderManualDepositInitial = () => {
    return (
      <React.Fragment>
        <PageContent>
          {!actionsConfig.deposit?.config?.hideDepositReference && (
            <Text id="deposit_info" />
          )}
        </PageContent>
        <PageButtons
          layout={'material'}
          items={[
            {
              id: 'okay',
              capitalize: true,
              type: 'submit',
              variant: 'text',
              loading: loadingUserBankAccounts,
              onPress: () =>
                setViewName(
                  combinedManualAccounts.length < 2 && selectedManualAccount
                    ? ViewNames.manualDepositForm
                    : ViewNames.manualMethodSelection,
                ),
            },
          ]}
        />
      </React.Fragment>
    );
  };

  const InfoModal = () => (
    <Modal
      open={infoModalOpen}
      onClose={() => setInfoModalOpen(false)}
      className={classes.modal}
    >
      <Paper className={classes.modalContent}>
        <IconButton
          className={classes.infoButton}
          size="small"
          onClick={() => setInfoModalOpen(false)}
        >
          <Close />
        </IconButton>
        <Text variant="h6" style={{ marginBottom: 8 }}>Your US Bank Account</Text>
        
        <div className={classes.logoContainer} style={{ marginBottom: 24 }}>
          <Text variant="body2" color="textSecondary" style={{ textAlign: 'center', width: '100%' }}>Powered by</Text>
          <Image
            src="/images/bridge-logo.svg"
            className={classes.bridgeLogo}
            alt="Bridge Logo"
            width={160}
            height={42}
            style={{ objectFit: 'contain' }}
          />
        </div>

        <View className={classes.modalBody}>
          <Text style={{ marginBottom: 16 }}>
            This is your dedicated US bank account, provided through our partnership with Bridge and Lead Bank. You can use it just like any standard US bank account to receive funds.
          </Text>
          <Text style={{ marginBottom: 12, fontWeight: 500 }}>
            Key benefits:
          </Text>
          <Text style={{ marginBottom: 8, paddingLeft: 16 }}>• Receive domestic US bank transfers (ACH) and wire transfers</Text>
          <Text style={{ marginBottom: 8, paddingLeft: 16 }}>• Funds are automatically converted to stablecoins in your account</Text>
          <Text style={{ marginBottom: 8, paddingLeft: 16 }}>• Secure and fully regulated banking service</Text>
        </View>
        <a 
          href="https://www.bridge.xyz/legal" 
          target="_blank" 
          rel="noopener noreferrer"
          className={classes.termsLink}
          style={{ textAlign: 'center', width: '100%', marginTop: 16 }}
        >
          <Text variant="caption" color="textSecondary">View Bridge Terms</Text>
        </a>
      </Paper>
    </Modal>
  );

  const renderManualDeposit = () => {
    const { account } = props;

    return (
      <React.Fragment>
        <PageContent>
            <React.Fragment>
              <View pv={1}>
                <Text align="center" id={actionsConfig.deposit?.config?.hideDepositReference ? "deposit_form_message_no_reference" : "deposit_form_message"} />
                <Text
                  id={'deposit_message'}
                  align="center"
                  myColor={'primary'}
                  style={{ marginTop: 16 }}
                />
                {!actionsConfig.deposit?.config?.hideDepositReference && (
                  <AccountReference>{account}</AccountReference>
                )}
              </View>
              {selectedManualAccount ? (
                <DepositList bankAcc={selectedManualAccount} />
              ) : loadingUserBankAccounts ? (
                <View style={{ padding: 16 }}>
                  <Skeleton variant="rect" width="100%" height={60} style={{ marginBottom: 12 }} />
                  <Skeleton variant="text" width="80%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton variant="text" width="60%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton variant="text" width="90%" height={20} />
                </View>
              ) : (
                <Text tA="center" id="no_bank_account_selected" />
              )}
            </React.Fragment>
          <View p={0.5} />
        </PageContent>
      </React.Fragment>
    );
  };

  const [sectionId, setSectionId] = useState('');

  const renderPageContent = formikProps => {
    switch (viewName) {
      case ViewNames.manualDepositInit:
        return renderManualDepositInitial();
      case ViewNames.manualMethodSelection:
        return renderManualMethodSelection();
      case ViewNames.depositNotAvailable:
        return renderDepositNotAvailable();
      case ViewNames.manualDepositForm:
        return renderManualDeposit();
      case 'help':
        return (
          <PageContent>
            <HelpCenterPage
              params={{ tab: 'depositing_money' }}
              sectionId={sectionId}
              setSectionId={setSectionId}
            />
          </PageContent>
        );
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (sectionId) setSectionId('');
    else
      switch (viewName) {
        case ViewNames.manualDepositInit:
          setViewName(ViewNames.manualMethodSelection);
          break;
        case ViewNames.manualDepositForm:
          if (actionsConfig.deposit?.config?.hideDepositReference) {
            // Exit the deposit flow entirely using browser history
            window.history.back();
          } else {
            setViewName(
              combinedManualAccounts.length > 1
                ? ViewNames.manualMethodSelection
                : ViewNames.manualDepositInit,
            );
          }
          break;
        default:
          break;
      }
  };

  let schema = yup.object().shape({
    amount: yup
      .number()
      .typeError('Please enter a valid number')
      .moreThan(0, 'Amount must be more than 0')
      .required('Amount is required'),
  });

  return (
    <React.Fragment>
      <PageTitle
        id={screenTitle}
        backButtonVisible={showBackButton}
        onBack={handleBack}
        actions={
          services?.bridge_service ? (
            <IconButton
              size="small"
              onClick={() => setInfoModalOpen(true)}
            >
              <InfoOutlined />
            </IconButton>
          ) : null
        }
      />
      {renderPageContent(props)}
      {services?.bridge_service && <InfoModal />}
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  depositFromWrapper: {
    border: '1px solid #DADADA',
    padding: '12px 14px',
    marginTop: 10,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 90,
    [theme.breakpoints.down(1050)]: {
      height: 100,
    },
    [theme.breakpoints.down(980)]: {
      height: 90,
    },
  },
  depositFromInfoWrapper: {
    textTransform: 'uppercase',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  currencyDescription: {
    fontSize: 10,
  },
  currencyAvailableBalance: {
    fontSize: 14,
    color: theme.palette.primary.main,
  },
  currencyConvBalance: {
    fontSize: 12,
    color: '#777777',
  },

  depositToWrapper: {
    border: '1px solid #DADADA',
    // padding: '12px 14px',
    marginTop: 10,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    [theme.breakpoints.down(1050)]: {
      height: 100,
    },
    [theme.breakpoints.down(980)]: {
      height: 90,
    },
  },
  feeWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  feeAmountText: {
    color: theme.palette.primary.main,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  modalContent: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    maxWidth: 480,
    width: '100%',
    position: 'relative',
    outline: 'none',
    margin: theme.spacing(2),
    overflow: 'hidden',
  },
  modalBody: {
    '& p': {
      fontSize: '0.95rem',
    },
  },
  logoContainer: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    opacity: 0.7,
    width: '100%',
  },
  bridgeLogo: {
    display: 'block',
  },
  termsLink: {
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

export default DepositForm;
