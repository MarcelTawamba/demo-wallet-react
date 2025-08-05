import React, { Component } from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import Big from 'big.js';
import moment from 'moment';
import { get } from 'lodash';

import * as Inputs from 'config/inputs';
import { getRecipientType, detectCryptoAddressType } from 'util/validation';
import { createCryptoTransfer, createTransfer, createDebit } from 'util/rehive';
import { getCurrencyCode, arrayToPlaceholder, toDivisibility } from 'util/general';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';

import Input from 'components/inputs/Input';
import stellarHelp from '../../config/stellarHelp';
import StellarAddressType from 'components/inputs/StellarAddressType';
import Icon from 'components/outputs/Icon';
import PageButtons from 'components/layout/page/PageButtons';
import PageContent from 'components/layout/page/PageContent';
import PageTitle from 'components/layout/page/PageTitle';
import ConfirmPage from 'components/layout/page/ConfirmPageNew';
import SuccessPage from 'components/layout/page/SuccessPageNew';
import FailedPage from 'components/layout/page/FailedPageNew';
import SendPending from './SendPending';
import {
  calculateRate,
  formatDecimals,
  renderRate,
  formatAmountString,
} from 'util/rates';
import IconButton from 'components/inputs/IconButton';
import AmountInput from '../AmountInput';
import {
  useFee as _useFee,
  useFeeWithConversion as _useFeeWithConversion,
  getFees,
} from 'util/fees';
import Info from 'components/outputs/Info';
import { checkIfStellar } from 'util/crypto';

const CHAINS = [
  { value: 'solana', label: 'Solana' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'avalanche_c_chain', label: 'Avalanche C-Chain' },
  { value: 'base', label: 'Base' },
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'stellar', label: 'Stellar' },
];

// Filter chains based on detected address type
const filterChains = (addressType) => {
  if (!addressType) return CHAINS;
  
  switch (addressType) {
    case 'solana':
      return CHAINS.filter(chain => chain.value === 'solana');
    case 'stellar':
      return CHAINS.filter(chain => chain.value === 'stellar');
    case 'ethereum':
      // For Ethereum addresses, show Ethereum and all ERC20-compatible chains
      return CHAINS.filter(chain => 
        ['ethereum', 'arbitrum', 'avalanche_c_chain', 'base', 'optimism', 'polygon'].includes(chain.value)
      );
    default:
      return CHAINS;
  }
};

class SendForm extends Component {
  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  state = {
    formState: 'send',
    result: null,
    pinVisible: false,
    helpNo: 0,
    metadata: {},
    resultCurrency: null,
  };

  componentDidUpdate(prevProps, prevState) {
    // Check if the form exists
    if (this.sendForm) {
      const { formState } = this.state;
      const currentValues = this.sendForm.values;
      const prevValues = prevProps.initialValues || {};

      // If the currency code changed, reset or validate the form
      if (
        prevProps.currency?.currency?.code !==
          this.props.currency?.currency?.code
      ) {
        if (formState === 'result') {
          this.setState({ formState: 'send' });
          this.sendForm.resetForm();
        } else {
          this.sendForm.validateForm();
        }
      }

      // Handle updating destination_chain based on detected address type
      const currentRecipient = currentValues.recipient;
      const prevRecipient = prevProps.initialValues?.recipient;
      const cryptoAddressType = detectCryptoAddressType(currentRecipient);
      const currentChain = currentValues.chain;
      
      if (currentRecipient !== prevRecipient && cryptoAddressType) {
        const evmChains = ['ethereum', 'arbitrum', 'avalanche_c_chain', 'base', 'optimism', 'polygon'];
        
        if (cryptoAddressType === 'ethereum') {
          // Default to 'ethereum' only if no chain is selected or the current selection is not an EVM chain.
          if (!currentChain || !evmChains.includes(currentChain)) {
            this.sendForm.setFieldValue('chain', 'ethereum');
          }
        } else if (['solana', 'stellar'].includes(cryptoAddressType)) {
          // For solana and stellar, set it directly if it's not already set correctly
          if (!currentChain || currentChain !== cryptoAddressType) {
             this.sendForm.setFieldValue('chain', cryptoAddressType);
          }
        }
      }
    }
  }

  async handleFormSubmit(props) {
    const { onSuccess, currency, services, rates, actionsConfig } = this.props;
    const { values, setSubmitting } = props; // FormikProps
    const { amount, recipient, note, memo, memoSkip, display, chain } = values;

    setSubmitting(true);

    let response = null;
    let recipientType = getRecipientType(recipient, currency);
    let amountValue = Big(amount);

    // Define isCrypto, isBridgeEnabled, and showChainSelect
    const isBridgeEnabled = services?.bridge_service;
    const isCrypto = Boolean(currency.crypto);
    const cryptoAddressType = detectCryptoAddressType(recipient);
    const showChainSelect = isCrypto && isBridgeEnabled && 
                          recipientType === 'crypto' && 
                          cryptoAddressType !== null;

    if (
      services?.conversion_service &&
      rates.rates &&
      rates.displayCurrency.code &&
      display
    ) {
      const convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      amountValue = amountValue.div(convRate);
    }
    amountValue = toDivisibility(amountValue, currency.currency.divisibility);

    if (recipientType === 'mobile') {
      if (recipient.indexOf('+') === -1) {
        values.recipient = '+' + recipient;
      }
    }

    try {
      let data = {
        amount: amountValue,
        to_reference: recipient,
        currency: currency?.currency?.code,
        debit_account: currency?.account,
        crypto: currency.crypto?.code,
        credit_note: note,
        debit_note: note,
        debit_subtype: 'send_' + recipientType,
        credit_subtype: 'receive_' + recipientType,
      };

      const metadataConfigs = actionsConfig?.send?.config?.metadata ?? [];
      if (metadataConfigs.length > 0) {
        let metadataValues = {};
        metadataConfigs.forEach(metadataField => {
          metadataValues[metadataField.id] = {
            label: metadataField.label,
            value: props.values[metadataField.id] ?? '',
          };
        });
        data['debit_metadata'] = {
          send_context: metadataValues,
        };
        data['credit_metadata'] = {
          send_context: metadataValues,
        };
      }

      // Memo is handled differently now based on bridge/chain
      if (currency.crypto?.blockchain === 'stellar') data.memo = memo;

      switch (recipientType) {
        case 'crypto':
          // If bridge is enabled or it's not Stellar, always use createDebit for crypto sends
          if (isBridgeEnabled || currency.crypto?.blockchain !== 'stellar') {
            // Create a debit transaction with metadata for crypto sends
            const cryptoData = {
              amount: amountValue,
              to_reference: recipient,
              currency: currency?.currency?.code,
              debit_account: currency?.account,
              subtype: 'send_crypto',
              metadata: {
                native_context: {
                  processing_details: {
                    destination: recipient,
                    ...(showChainSelect && chain && { chain: chain }),
                    ...(chain === 'stellar' && !memoSkip && { memo: memo }),
                  },
                  display_details: {
                    destination: {
                      label: 'Recipient address',
                      value: recipient
                    },
                    ...(showChainSelect && chain && {
                      chain: {
                        label: 'Destination Chain',
                        value: CHAINS.find(c => c.value === chain)?.label ?? chain
                      }
                    }),
                    ...(chain === 'stellar' && !memoSkip && memo && {
                      memo: {
                        label: 'Memo',
                        value: memo
                      }
                    }),
                    ...(note && !(chain === 'stellar') && {
                      note: {
                        label: 'Note',
                        value: note
                      }
                    }),
                  }
                }
              }
            };
            response = await createDebit(cryptoData);
          } else {
            // Original Stellar transfer logic (if bridge not enabled)
            data.memo = memo; // Add memo here for direct Stellar transfer
            response = await createCryptoTransfer(
              data,
              currency?.metadata?.native_context?.crypto,
            );
          }
          break;

        default:
          if (recipientType === 'account') data.credit_account = recipient;
          else data.recipient = recipient;

          delete data.to_reference;
          response = await createTransfer(data);
          break;
      }

      if (
        response?.status === 'Pending' &&
        !response?.partner?.user?.temporary
      ) {
        this.setState({ formState: 'pending', result: response });
      } else {
        this.setState({ formState: 'result', result: response });
        onSuccess(currency);
      }
    } catch (error) {
      console.log(error);
      this.setState({ formState: 'result', result: error });
    }
    setSubmitting(false);
  }

  handleButtonPress = (props, type) => {
    props && props.setStatus({ error: '' });

    const { formState } = this.state;

    let nextFormState = formState;
    const metadataConfigs =
      this.props.actionsConfig?.send?.config?.metadata ?? [];
    switch (formState) {
      case 'send':
        nextFormState = metadataConfigs.length > 0 ? 'metadata' : 'confirm';
        break;
      case 'metadata':
        nextFormState = 'confirm';
        break;
      case 'confirm':
        if (type === 'confirm') this.handleFormSubmit(props);
        else nextFormState = metadataConfigs.length > 0 ? 'metadata' : 'send';
        break;
      case 'result':
        if (type === 'try_again') {
          this.handleFormSubmit(props);
        } else if (type === 'back') {
          nextFormState = 'confirm';
        } else {
          nextFormState = 'send';
          if (type === 'success') this.props.handleStateChange({ state: '' });
        }
        break;
      default:
    }

    this.setState({ formState: nextFormState });
  };

  renderInput(props, item) {
    const { currency, actionsConfig, currencySubtypes } = this.props;

    const recipientType =
      actionsConfig?.send?.config?.recipient?.[0] ?? 'email';

    const id = item === 'recipient' ? recipientType + 'Recipient' : item;

    const field = { ...Inputs[id] };

    // Calculate placeholder for recipient field
    const recipients = this.buildRecipients(currencySubtypes || []);
    const isCrypto = Boolean(currency?.crypto);
    const placeholderRecipients = recipients.filter(x =>
      isCrypto ? x : x !== 'crypto',
    );

    const placeholder = arrayToPlaceholder(placeholderRecipients);

    switch (item) {
      case 'recipient':
        field.placeholder = placeholder;
        break;
      default:
    }
    return <Input field={field} key={item} formikProps={props} />;
  }

  renderSend = formikProps => {
    const {
      currency,
      services,
      knownAddresses,
      tierFees,
      accountFees,
      groupFees,
      currencySubtypes,
      actionsConfig
    } = this.props;

    const { values, setFieldValue } = formikProps;
    const { stellarTransactionType, recipient, chain } = values;

    const recipientType = getRecipientType(recipient, currency);
    const cryptoAddressType = detectCryptoAddressType(recipient);
    const isStellar = recipientType === 'crypto' && checkIfStellar(currency);
    
    // Define isCrypto, isBridgeEnabled, and showChainSelect
    const isBridgeEnabled = services?.bridge_service;
    const isCrypto = Boolean(currency.crypto);
    const showChainSelect = isCrypto && isBridgeEnabled && recipientType === 'crypto';
    
    // Calculate placeholder for recipient field
    const recipients = this.buildRecipients(currencySubtypes || []);
    const placeholderRecipients = recipients.filter(x =>
      isCrypto ? x : x !== 'crypto',
    );
    const recipientPlaceholder = arrayToPlaceholder(placeholderRecipients);

    const fees = getFees(
      tierFees,
      `send_${recipientType}`,
      currency,
      accountFees,
      groupFees,
    );

    const amountInputProps = {
      services,
      formikProps,
      currency,
      onSubmitEditing: this.onSubmitEditing,
      enableMax: true,
      subtype: `send_${recipientType}`,
      fees,
    };

    return (
      <Form style={{ width: '100%' }}>
        <PageContent>
          {/* Amount input is not wrapped to avoid interference with its functionality */}
          <AmountInput {...amountInputProps} key="send" />
          
          {/* Other fields use standard spacing */}
          {isStellar && (
            <View style={{ marginTop: 4, marginBottom: 4 }}>
              <StellarAddressType
                handleChange={event =>
                  formikProps.setFieldValue(
                    'stellarTransactionType',
                    event.target.value,
                  )
                }
                value={stellarTransactionType}
              />
            </View>
          )}

          <View width={'100%'} style={{ width: '100%', display: 'block' }}>
            {this.renderInput(formikProps, 'recipient')}
          </View>

          {/* Destination Chain Dropdown - Appears below Recipient */}
          {showChainSelect && (
            <View style={{ marginTop: 4, marginBottom: 4 }}>
              <Input
                field={{
                  name: 'chain',
                  type: 'dropdown',
                  options: filterChains(cryptoAddressType),
                  placeholder: 'select_chain',
                  required: true,
                }}
                formikProps={formikProps}
              />
            </View>
          )}

          {isStellar && stellarTransactionType === 'public' ? (
            <View w={'100%'}>
              {!(
                knownAddresses?.find(
                  item => item.public_address === formikProps.values.recipient,
                )?.requires_memo ?? false
              ) ? (
                <View style={{ marginTop: -8 }}>
                  <Input
                    field={{
                      ...Inputs.memoSkip,
                      noPadding: true,
                      alignCenter: true
                    }}
                    formikProps={formikProps}
                    value={values.memo_skip_transaction_label}
                    helper={''}
                    placeholder={''}
                    key={'memoSkip'}
                  />
                </View>
              ) : (
                <View>
                  <Info
                    variant="warning"
                    mb={1}
                    id="third_party_wallet_or_exchange_requires_info"
                  />
                </View>
              )}
              {stellarTransactionType === 'public' &&
                  !values.memo_skip_transaction_label && (
                  <View width={'100%'} style={{ width: '100%', display: 'block' }}>
                    <Input
                      field={{
                        ...Inputs.memo,
                        fullWidth: true,
                        required: true,
                        width: '100%'
                      }}
                      formikProps={formikProps}
                      style={{ width: '100%' }}
                      wrapperStyle={{ width: '100%' }}
                      containerStyle={{ width: '100%' }}
                    />
                  </View>
                )}
            </View>
          ) : null}
          
          {/* Show memo field and memoSkip when Stellar is selected destination chain */}
          {!(isStellar && stellarTransactionType === 'public') && 
            showChainSelect && 
            chain === 'stellar' && (
              <View w={'100%'} style={{ width: '100%', display: 'block' }}>
                {!(
                  knownAddresses?.find(
                    item => item.public_address === formikProps.values.recipient,
                  )?.requires_memo ?? false
                ) ? (
                  <View style={{ marginTop: -8 }}>
                    <Input
                      field={{
                        ...Inputs.memoSkip,
                        noPadding: true,
                        alignCenter: true
                      }}
                      formikProps={formikProps}
                      value={values.memo_skip_transaction_label}
                      helper={''}
                      placeholder={''}
                      key={'memoSkip'}
                    />
                  </View>
                ) : (
                  <View>
                    <Info
                      variant="warning"
                      mb={1}
                      id="third_party_wallet_or_exchange_requires_info"
                    />
                  </View>
                )}
                {!values.memo_skip_transaction_label && (
                  <View width={'100%'} style={{ width: '100%', display: 'block' }}>
                    {this.renderInput(formikProps, 'memo')}
                  </View>
                )}
              </View>
            )}
          
          {/* Always show note field unless it's a Stellar chain */}
          {!(showChainSelect && chain === 'stellar') && (
            <View width={'100%'} style={{ width: '100%', display: 'block' }}>
              {this.renderInput(formikProps, 'note')}
            </View>
          )}
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'send',
              capitalize: true,
              type: 'submit',
              size: 'large',
              disabled: !formikProps.isValid,
              onPress: () => this.handleButtonPress(formikProps),
            },
          ]}
        />
      </Form>
    );
  };

  renderMetadata(formikProps) {
    const { actionsConfig } = this.props;
    const { values } = formikProps;
    const metadataConfigs = actionsConfig?.send?.config?.metadata ?? [];
    const disableNext = metadataConfigs.some(metadataField => {
      return Boolean(metadataField.required && !values[metadataField.id]);
    });
    return (
      <Form>
        <PageContent>
          <Text style={{ marginBottom: 8 }} id="add_metadata" />
          {metadataConfigs.map(metadataField => (
            <Input
              key={metadataField.id}
              field={{
                name: metadataField.id,
                value: values[metadataField.id],
                placeholder: metadataField.placeholder,
                label: metadataField.label,
              }}
              formikProps={formikProps}
            />
          ))}
        </PageContent>
        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'new_transaction',
              capitalize: true,
              type: 'submit',
              size: 'large',
              disabled: disableNext,
              onPress: () => this.handleButtonPress(formikProps),
            },
            {
              id: 'back',
              size: 'large',
              variant: 'text',
              disabled: false,
              onPress: () => this.setState({ formState: 'send' }),
            },
          ]}
        />
      </Form>
    );
  }

  renderConfirm = props => {
    const { currency, rates, tierFees, actionsConfig, accountFees, groupFees } =
      this.props;
    const { values } = props;
    const { amount, recipient, memo, memoSkip, note, display, chain } = values;

    const recipientType = getRecipientType(recipient, currency);

    // Assume bridge enabled status comes from services prop
    const isBridgeEnabled = this.props.services?.bridge_service;
    const isCrypto = Boolean(currency.crypto);
    const cryptoAddressType = detectCryptoAddressType(recipient);
    const showChainSelect = isCrypto && isBridgeEnabled && 
                          recipientType === 'crypto' && 
                          cryptoAddressType !== null;

    // Calculate conversion rate
    let convRate = 1;
    const { hasConversion } = rates;
    const showConversionRate =
      hasConversion &&
      currency?.currency?.code !== rates?.displayCurrency?.code;

    if (showConversionRate) {
      convRate = calculateRate(
        currency?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
    }

    // Amount
    let amountValue = Big(0);
    let amountString = '';
    let amountConvString = '';
    let sentenceString = '';
    if (display) {
      amountValue = amount.div(convRate);
    } else {
      amountValue = Big(amount);
    }
    amountString = formatAmountString(amountValue, currency.currency);
    if (showConversionRate && convRate) {
      amountConvString =
        '~' + formatAmountString(amountValue.mul(convRate), rates.displayCurrency);
    }
    sentenceString =
      amountString + (amountConvString ? ' (' + amountConvString + ')' : '');
    const items = [
      {
        id: 'amount',
        labelId: 'send',
        value: amountString,
        value2: amountConvString,
      },
      {
        id: 'recipient',
        labelId: 'to',
        value: '',
        value2: recipient,
      },
      ...(showChainSelect && chain
        ? [
            {
              id: 'chain',
              labelId: 'chain',
              value: '',
              value2:
                CHAINS.find(c => c.value === chain)?.label ?? chain,
            },
          ]
        : []),
    ];
    if (!memoSkip && memo) {
      if (chain === 'stellar') {
        items.push({
          id: 'memo',
          labelId: 'memo',
          value: memo,
        });
      }
    }
    if (note) {
      if (!(showChainSelect && chain === 'stellar')) {
        items.push({
          id: 'note',
          labelId: 'for',
          value: note,
          labelBold: true,
        });
      }
    }

    const { totalString, fees, totalConvString } = _useFeeWithConversion(
      display ? amountValue.div(convRate) : amountValue,
      tierFees || [],
      currency,
      'send_' + recipientType,
      convRate,
      rates.displayCurrency,
      accountFees || [],
      groupFees || [],
    );

    const itemsExtra = [
      {
        id: 'account',
        labelId: 'account',
        value: currency.account,
        horizontal: true,
        align: 'right',
      },
      {
        id: 'amount',
        labelId: 'spending_amount',
        value: amountString,
        value2: amountConvString,
        horizontal: true,
        align: 'right',
      },
    ];
    if (showConversionRate) {
      const rate = rates.rates['USD:' + currency?.currency?.code];
      if (rate) {
        itemsExtra.push({
          id: 'rate',
          labelId: 'rate',
          value: renderRate({
            fromCurrency: currency.currency,
            toCurrency: rates?.displayCurrency,
            rate: convRate,
          }),
          textTransform: 'initial',
          value2: 'Last updated ' + moment(rate.created).fromNow(),
        });
      }
    }
    if (fees && fees.length > 0) {
      fees.forEach(fee => {
        itemsExtra.push({
          id: 'fee',
          labelId: fee.name ? fee.name : 'service_fee',
          value: fee.feeString,
          value2: fee.feeConvString,
          horizontal: true,
        });
      });
      itemsExtra.push({
        id: 'total_amount',
        labelId: 'total_amount',
        value: totalString,
        value2: totalConvString,
        horizontal: true,
        bold: true,
      });
    }

    // Add chain back to itemsExtra for rendering in the details section
    if (showChainSelect && chain) {
      itemsExtra.push({
        id: 'chain',
        label: 'Destination Chain', // Use label directly as ConfirmPageNew expects
        value:
          CHAINS.find(c => c.value === chain)?.label ??
          chain,
        horizontal: true,
        align: 'right',
      });
    }

    const metadataConfigs = actionsConfig?.send?.config?.metadata ?? [];
    if (metadataConfigs.length > 0) {
      metadataConfigs.forEach(metadataField => {
        if (values[metadataField.id]) {
          itemsExtra.push({
            id: metadataField.id,
            label: metadataField.label,
            value: values[metadataField.id],
          });
        }
      });
    }

    return (
      <Form>
        <ConfirmPage
          pageStyle={{ marginTop: -16 }}
          handleButtonPress={this.handleButtonPress}
          formikProps={props}
          fromAccount={currency.account_label || currency.account_name}
          items={items}
          itemsExtra={itemsExtra}
        />
      </Form>
    );
  };

  renderResult(props) {
    const { result, resultCurrency } = this.state;
    const {
      currency,
      services,
      rates,
      tierFees,
      actionsConfig,
      accountFees,
      groupFees,
    } = this.props;
    const { values } = props;

    // Use stored currency data if props.currency is undefined
    const currencyData = currency || resultCurrency;

    // Add safety check for currency data
    if (!currencyData || !currencyData.currency) {
      console.error('Currency data is missing in renderResult');
      return null;
    }

    const { amount, recipient: initialRecipient, display, memo, memoSkip, note, chain } =
      values;
    const { divisibility } = currencyData.currency;

    let recipient = get(
      this.state.result,
      ['destination_transaction', 'user', 'email'],
      initialRecipient,
    );

    // Assume bridge enabled status comes from services prop
    const isBridgeEnabled = this.props.services?.bridge_service;
    const isCrypto = Boolean(currencyData.crypto);
    const recipientType = getRecipientType(recipient, currencyData);
    const cryptoAddressType = detectCryptoAddressType(recipient);
    const showChainSelect = isCrypto && isBridgeEnabled && 
                          recipientType === 'crypto' && 
                          cryptoAddressType !== null;

    let convRate = 1;
    let sentenceString = '';
    let amountString = '';
    let amountConvString = '';
    let amountBig = Big(amount)

    if (
      services?.conversion_service &&
      rates?.rates &&
      rates?.displayCurrency?.code &&
      currencyData?.currency?.code !== rates?.displayCurrency?.code
    ) {
      convRate = calculateRate(
        currencyData?.currency?.code,
        rates.displayCurrency.code,
        rates.rates,
      );
      if (display) {
        amountString =
          formatDecimals(amountBig.div(convRate), divisibility) +
          ' ' +
          getCurrencyCode(currencyData?.currency);
        sentenceString = amountString;

        if (convRate)
          amountConvString =
            formatDecimals(amountBig, rates.displayCurrency.divisibility) +
            ' ' +
            getCurrencyCode(rates.displayCurrency);
      } else {
        amountString =
          formatDecimals(amountBig, divisibility) +
          ' ' +
          getCurrencyCode(currencyData?.currency);
        sentenceString = amountString;

        if (convRate)
          amountConvString =
            formatDecimals(
              amountBig.mul(convRate),
              rates.displayCurrency.divisibility,
            ) +
            ' ' +
            getCurrencyCode(rates.displayCurrency);
        amountConvString = '~' + amountConvString;
        sentenceString = amountString + ' (' + amountConvString + ')';
      }
    } else {
      amountString =
        formatDecimals(amountBig, divisibility) +
        ' ' +
        getCurrencyCode(currencyData?.currency);
      sentenceString = amountString;
    }

    const items = [
      {
        id: 'amount',
        labelId: 'send',
        value: amountString,
        value2: amountConvString,
        horizontal: true,
        align: 'right',
      },
      {
        id: 'recipient',
        labelId: 'to',
        value: '',
        value2: recipient,
        labelBold: true,
      },
    ];
    if (showChainSelect && chain) {
      items.push({
        id: 'chain',
        labelId: 'chain',
        value: '',
        value2:
          CHAINS.find(c => c.value === chain)?.label ??
          chain,
        labelBold: true,
      });
    }
    if (note) {
      if (!(showChainSelect && chain === 'stellar')) {
        items.push({
          id: 'note',
          labelId: 'for',
          value: note,
          labelBold: true,
        });
      }
    }
    if (!memoSkip && memo) {
      if (chain === 'stellar') {
        items.push({
          id: 'memo',
          labelId: 'memo',
          value: memo,
        });
      }
    }

    const { totalString, fees, totalConvString } = _useFeeWithConversion(
      display ? amountBig.div(convRate) : amountBig,
      tierFees || [],
      currencyData,
      'send_' + recipientType,
      convRate,
      rates?.displayCurrency,
      accountFees || [],
      groupFees || [],
    );

    const itemsExtra = [
      {
        id: 'account',
        labelId: 'account',
        value: currencyData.account,
        horizontal: true,
        align: 'right',
      },
      {
        id: 'amount',
        labelId: 'spending_amount',
        value: amountString,
        value2: amountConvString,
        horizontal: true,
        align: 'right',
      },
    ];
    if (
      rates?.hasConversion &&
      currencyData?.currency?.code !== rates?.displayCurrency?.code
    ) {
      const rate = rates?.rates['USD:' + currencyData?.currency?.code];
      if (rate) {
        itemsExtra.push({
          id: 'rate',
          labelId: 'rate',
          value: renderRate({
            fromCurrency: currencyData.currency,
            toCurrency: rates?.displayCurrency,
            rate: convRate,
          }),
          textTransform: 'initial',
          value2: 'Last updated ' + moment(rate.created).fromNow(),
        });
      }
    }
    if (fees && fees.length > 0) {
      fees.forEach(fee => {
        itemsExtra.push({
          id: 'fee',
          labelId: fee.name ? fee.name : 'service_fee',
          value: fee.feeString,
          value2: fee.feeConvString,
          horizontal: true,
        });
      });
      itemsExtra.push({
        id: 'total_amount',
        labelId: 'total_amount',
        value: totalString,
        value2: totalConvString,
        horizontal: true,
        bold: true,
      });
    }

    if (
      (this.state.result?.id && this.state.result?.status?.toLowerCase() !== 'failed') ||
      this.state.result?.status === 'success' ||
      this.state.result?.status === 'succeeded'
    ) {
      const metadataConfigs = actionsConfig?.send?.config?.metadata ?? [];
      if (metadataConfigs.length > 0) {
        metadataConfigs.forEach(metadataField => {
          if (props.values[metadataField.id]) {
            itemsExtra.push({
              id: metadataField.id,
              label: metadataField.label,
              value: props.values[metadataField.id],
            });
          }
        });
      }
      return (
        <Form>
          <SuccessPage
            pageStyle={{ marginTop: -16 }}
            result={this.state.result}
            handleButtonPress={this.handleButtonPress}
            formikProps={props}
            items={items}
            itemsExtra={itemsExtra}
            fromAccount={currencyData.account_label || currencyData.account_name}
            successMessageId={undefined}
            performedDate={
              this.state.result?.created
                ? moment(this.state.result.created).format('h.mm A, D MMMM YYYY')
                : null
            }
            onNext={() => {
              props.setFieldValue('recipient', '');
              props.setFieldValue('memo', '');
              props.setFieldValue('note', '');
              this.handleButtonPress(props, '');
            }}
          />
        </Form>
      );
    } else {
      return (
        <Form>
          <FailedPage
            pageStyle={{ marginTop: -16 }}
            result={this.state.result}
            handleButtonPress={this.handleButtonPress}
            formikProps={props}
            items={items}
            itemsExtra={itemsExtra}
            performedDate={moment().format('h.mm A, D MMMM YYYY')}
            failedMessageId="send_failed"
          />
        </Form>
      );
    }
  }

  validate(values, schema) {
    let result = {};
    try {
      result = schema.validateSync(values, { abortEarly: false });
    } catch (e) {
      result = e;
      // console.log('e', e);
    }
    return result;
  }

  validation = (values, initial) => {
    try {
      const {
        currency,
        rates,
        tierFees,
        services,
        actionsConfig,
        accountFees,
        groupFees,
      } = this.props;
      let schema = null;
      const { recipient, display, amount, chain, memoSkip } = values;
      const recipientType = getRecipientType(recipient, currency);

      schema = yup.object().shape({
        amount: yup
          .number()
          .typeError('Please enter a valid number')
          .moreThan(0, 'Amount must be more than 0')
          .required('Amount is required'),
        recipient: yup
          .string()
          .required('Recipient is required')
      });
      
      // Add memo validation for Stellar transactions - only for crypto recipients, not P2P
      const isStellarCrypto = recipientType === 'crypto' && checkIfStellar(currency);
      const isRecipientStellar = recipient && recipientType === 'crypto' && 
        (detectCryptoAddressType(recipient) === 'stellar' || chain === 'stellar');
        
      if ((isStellarCrypto || isRecipientStellar) && 
          values.stellarTransactionType === 'public' && 
          !values.memo_skip_transaction_label) {
        schema = schema.shape({
          memo: yup.string().required('Memo is required unless "No memo required" is checked')
        });
      }

      // Assume bridge enabled status comes from services prop
      const isBridgeEnabled = services?.bridge_service;
      const isCrypto = currency.crypto;
      const cryptoAddressType = detectCryptoAddressType(recipient);
      const showChainSelect = isCrypto && isBridgeEnabled && recipientType === 'crypto';

      if (showChainSelect) {
        schema = schema.shape({
          chain: yup.string()
            .required('Destination chain is required')
            .notOneOf([''], 'Destination chain is required')
            .test(
              'is-compatible-chain',
              'Selected chain is not compatible with the address type',
              function(value) {
                // Skip validation if no crypto address type detected
                if (!cryptoAddressType) return true;
                
                const filteredChains = filterChains(cryptoAddressType);
                return filteredChains.some(chain => chain.value === value);
              }
            ),
        });
      }

      let errors = this.validate(values, schema);
      if (errors.inner && errors.inner.length > 0) {
        // Return all validation errors
        let validationErrors = {};
        errors.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        return validationErrors;
      }

      let convRate = 1;
      const hasConversion =
        services?.conversion_service &&
        rates?.rates &&
        rates?.displayCurrency?.code;
      if (hasConversion) {
        convRate = calculateRate(
          currency?.currency?.code,
          rates?.displayCurrency?.code,
          rates?.rates,
        );
      }

      let amountValue = amount;

      if (display) amountValue = amount.div(convRate);

      const { totalAmount, feeAmount } = _useFee(
        amountValue,
        tierFees || [],
        currency,
        accountFees || [],
        groupFees || [],
        'send_' + recipientType,
      );

      const availableAmount = currency.available_balance;

      if (totalAmount > availableAmount) {
        return {
          amount:
            'Available balance exceeded: ' +
            formatAmountString(availableAmount, currency.currency, true) +
            (feeAmount
              ? ' (fee: ' +
                formatAmountString(feeAmount, currency.currency, true) +
                ')'
              : ''),
        };
      }

      if (!recipient) return { recipient: 'Please include recipient' };

      let recipientConfig = actionsConfig?.send?.config?.recipient ?? [
        'email',
        'mobile',
        'account',
        'crypto',
      ];

      if (recipientConfig.length === 0)
        recipientConfig = ['email', 'mobile', 'account', 'crypto'];

      if (!currency?.crypto)
        recipientConfig = recipientConfig?.filter(x => x !== 'crypto');

      if (!recipientType || !recipientConfig?.includes(recipientType))
        return {
          recipient: `Please enter a valid ${recipientConfig
            ?.map(x => this.mapRecipientTypeToString(x, currency))
            ?.slice(0, recipientConfig?.length - 1)
            ?.join(', ')} or ${this.mapRecipientTypeToString(
            recipientConfig[recipientConfig?.length - 1],
            currency,
          )}`,
        };

      if (initial) return true;

      return {};
    } catch (e) {
      console.error('Form validation error:', e);
      return { form: 'An error occurred while validating the form' };
    }
  };

  mapRecipientTypeToString(value, currency) {
    switch (value) {
      case 'email':
      case 'mobile':
      default:
        return value;
      case 'account':
        return 'account reference';
      case 'crypto':
        return `${currency?.crypto?.code} address`;
    }
  }

  hidePin() {
    this.setState({ pinVisible: false });
  }

  renderHelp() {
    const { helpNo } = this.state;
    return (
      <Form>
        <React.Fragment>
          <PageContent>
            <View pb={0.5}>
              <Text variant={'h6'}>{stellarHelp[helpNo].title}</Text>
            </View>
            <Text>{stellarHelp[helpNo].description}</Text>
          </PageContent>
          <PageButtons
            layout={'material'}
            items={[
              {
                id: 'close',
                capitalize: true,
                onPress: () => this.setState({ formState: 'send' }),
                variant: 'text',
                color: 'default',
              },
              {
                autoFocus: true,
                id: helpNo === 2 ? 'done' : 'next',
                capitalize: true,
                type: 'submit',
                variant: 'text',
                onPress: () =>
                  this.setState(
                    this.state.helpNo === 2
                      ? { formState: 'send' }
                      : { helpNo: helpNo + 1 },
                  ),
              },
            ]}
          />
        </React.Fragment>
      </Form>
    );
  }

  setFormStateResult = (failedResult = this.state.result) => {
    // Store currency data in state when transitioning to result
    const { currency } = this.props;
    this.setState({ 
      formState: 'result', 
      result: failedResult,
      resultCurrency: currency // Store currency data
    });
  };

  renderPending(props) {
    const { onSuccess, currency, profile } = this.props;
    const { items: user } = profile || {};
    const { result } = this.state;
    return (
      <Form>
        <PageContent>
          <SendPending
            user={user}
            currency={currency}
            onSuccess={onSuccess}
            result={result}
            setFormStateResult={this.setFormStateResult}
          />
        </PageContent>
      </Form>
    );
  }

  buildRecipients(currencySubtypes) {
    const recipients = [];
    // Safety check for undefined currencySubtypes
    if (!currencySubtypes || !Array.isArray(currencySubtypes)) {
      return ['email', 'mobile', 'account', 'crypto']; // Default values
    }
    
    for (let i = 0; i < currencySubtypes.length; i++) {
      const item = currencySubtypes[i];
      if (item.name === 'send_email') {
        recipients.push('email');
      } else if (item.name === 'send_mobile') {
        recipients.push('mobile');
      } else if (item.name === 'send_account') {
        recipients.push('account');
      } else if (item.name === 'send_crypto') {
        recipients.push('crypto');
      }
    }

    return recipients;
  }

  render() {
    const { initialValues = {}, currency, services } = this.props;
    const { formState } = this.state;

    // --- Determine initial default for chain --- 
    const initialRecipient = initialValues.recipient;
    const initialRecipientType = initialRecipient ? getRecipientType(initialRecipient, currency) : null;
    const initialIsCrypto = Boolean(currency?.crypto);
    const initialIsBridgeEnabled = services?.bridge_service;
    const initialCryptoAddressType = initialRecipient ? detectCryptoAddressType(initialRecipient) : null;
    const initialShowChainSelect = initialIsCrypto && initialIsBridgeEnabled && initialRecipientType === 'crypto';
    
    // Set initial chain based on detected address type
    let initialChain = 'solana';
    if (initialCryptoAddressType) {
      initialChain = initialCryptoAddressType;
    }
    // ----------------------------------------------------

    const formInitialValues = {
      amount: initialValues.amount ? initialValues.amount : '',
      recipient: initialValues.recipient,
      chain: initialChain,
      search: '',
      note: initialValues.note,
      memo: initialValues.memo,
      memo_skip_transaction_label: false,
      stellarTransactionType: 'public',
      display: false,
    };

    const isInitialValid = this.validation(formInitialValues, true);

    return (
      <Formik
        innerRef={form => (this.sendForm = form)}
        initialValues={formInitialValues}
        onSubmit={this.handleFormSubmit.bind(this)}
        validate={values => this.validation(values)}
        validateOnMount={true}
        validateOnChange={true}
        enableReinitialize>
        {props => (
          <>
            <PageTitle
              titleId={formState === 'send' ? 'send' : ''}
              actions={
                formState === 'send' &&
                currency && // Add a safety check for currency
                getRecipientType(props.values.recipient, currency) ===
                  'crypto' &&
                currency.crypto?.code?.match(/XLM|TXLM/) && (
                  <IconButton
                    style={{ marginBottom: 8, marginRight: 8 }}
                    onClick={() =>
                      this.setState({ formState: 'help', helpNo: 0 })
                    }>
                    <Icon //TODO:
                      icon={'help'}
                      color="primary"
                      size={20}
                      inverted
                    />
                  </IconButton>
                )
              }
            />
            {this.state.formState === 'send'
              ? this.renderSend(props)
              : this.state.formState === 'confirm'
              ? this.renderConfirm(props)
              : this.state.formState === 'pending'
              ? this.renderPending(props)
              : this.renderResult(props)}
          </>
        )}
      </Formik>
    );
  }
}

const SendFormWithRef = React.forwardRef((props, ref) => {
  return <SendForm {...props} ref={ref} />;
});

function SendWrapper(props) {
  return <SendFormWithRef {...props} />;
}

export default SendWrapper;

