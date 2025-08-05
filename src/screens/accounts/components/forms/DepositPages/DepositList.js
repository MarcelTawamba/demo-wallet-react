import React, { Fragment, useEffect } from 'react';
import { concatAddress } from 'util/general';
import { useSelector } from 'react-redux';
import { configSettingsSelector, configActionsStateSelector } from 'redux/rehive/selectors';
import OutputList from 'components/lists/OutputList';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { useTranslation } from 'react-i18next';
import { isArray } from 'lodash';

export default function DepositList(props) {
  const { t } = useTranslation(['common']);
  const { bankAcc = {} } = props;

  const {
    bank_name,
    bank_code,
    name,
    number,
    type,
    branch_code,
    swift,
    iban,
    bic,
    branch_address = {},
    branch_address_text,
    routing_number,
    owner = {},
  } = bankAcc;

  const settingsConfig = useSelector(configSettingsSelector);
  const actionsConfig = useSelector(configActionsStateSelector);
  const { bank = {}, legal = {}, locales } = settingsConfig;
  
  // Get hideFields from settings config
  const settingsHideFields = isArray(bank.hideFields) ? bank.hideFields : [];
  
  // Get hideFields from actions config
  const actionsHideFields = isArray(actionsConfig?.deposit?.config?.hideBankFields) 
    ? actionsConfig.deposit.config.hideBankFields 
    : [];
  
  // Combine both hideFields arrays
  const hideBankFields = Array.from(new Set([...settingsHideFields, ...actionsHideFields]));
  
  // Format branch address
  const branchAddress = branch_address_text || concatAddress(branch_address);
  
  // Format owner name
  const ownerName = owner ? (
    owner.full_name || 
    (owner.first_name || owner.last_name ? 
      `${owner.first_name || ''} ${owner.middle_name ? owner.middle_name + ' ' : ''}${owner.last_name || ''}`.trim() : 
      owner.company_name || '')
  ) : '';
  
  // Format owner address
  const ownerAddress = owner ? (
    owner.address_text || 
    (owner.address ? concatAddress(owner.address) : '')
  ) : '';

  // Create display fields array
  const displayFields = [];
  
  // Add basic fields directly
  if (name && hideBankFields.indexOf('name') === -1) {
    displayFields.push({
      label: t('account_name'),
      value: name,
      copy: true
    });
  }
  
  if (number && hideBankFields.indexOf('number') === -1) {
    displayFields.push({
      label: t('account_number'),
      value: number,
      copy: true
    });
  }
  
  if (type && hideBankFields.indexOf('type') === -1) {
    displayFields.push({
      label: t('account_type'),
      value: type,
      copy: true
    });
  }
  
  if (bank_name && hideBankFields.indexOf('bank_name') === -1) {
    displayFields.push({
      label: t('bank_name'),
      value: bank_name,
      copy: true
    });
  }
  
  if (routing_number && hideBankFields.indexOf('routing_number') === -1) {
    displayFields.push({
      label: t('routing_number'),
      value: routing_number,
      copy: true
    });
  }
  
  // Add branch address if available
  if (branchAddress && hideBankFields.indexOf('branch_address') === -1) {
    displayFields.push({
      label: t('branch_address'),
      value: branchAddress,
      copy: true
    });
  }
  
  // Add owner name if available
  if (ownerName && hideBankFields.indexOf('owner_name') === -1) {
    displayFields.push({
      label: t('owner_full_name'),
      value: ownerName,
      copy: true
    });
  }
  
  // Add owner address if available
  if (ownerAddress && hideBankFields.indexOf('owner_address') === -1) {
    displayFields.push({
      label: t('owner_address_address_text'),
      value: ownerAddress,
      copy: true
    });
  }
  
  // Add remaining fields
  if (bank_code && hideBankFields.indexOf('bank_code') === -1) {
    displayFields.push({
      label: t('bank_code'),
      value: bank_code,
      copy: true
    });
  }
  
  if (branch_code && hideBankFields.indexOf('branch_code') === -1) {
    displayFields.push({
      label: t('branch_code'),
      value: branch_code,
      copy: true
    });
  }
  
  if (bic && hideBankFields.indexOf('bic') === -1) {
    displayFields.push({
      label: t('bic'),
      value: bic,
      copy: true
    });
  }
  
  if (swift && hideBankFields.indexOf('swift') === -1) {
    displayFields.push({
      label: t('swift'),
      value: swift,
      copy: true
    });
  }
  
  if (iban && hideBankFields.indexOf('iban') === -1) {
    displayFields.push({
      label: t('iban'),
      value: iban,
      copy: true
    });
  }

  return bankAcc ? (
    <Fragment>
      <View w={'100%'}>
        <OutputList outputProps={{ locales }} items={displayFields} />
      </View>
    </Fragment>
  ) : (
    <View pv={1} w={'100%'}>
      <Text align="center" id="wallet_has_no_bank_accounts_to_deposit">
        {t('wallet_has_no_bank_accounts_to_deposit')}
      </Text>
    </View>
  );
}
