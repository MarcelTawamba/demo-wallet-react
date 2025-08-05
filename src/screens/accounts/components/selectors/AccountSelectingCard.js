import React from 'react';
import AccountCard from '../currency/AccountCard';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Status from 'components/outputs/Status';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { useTheme } from 'components/app/context';
import { Button } from 'components/inputs/Button';
import EditIcon from '@material-ui/icons/Edit';

const AccountSelectingCard = props => {
  const {
    data = [],
    currency,
    selectedAccount,
    crypto,
    trustlineHook,
    badgeRightAlign,
    setShowTrustlineError,
    disableHover,
    requireVerifiedBankAccountForWithdraw,
  } = props;
  const hasData = data.length > 0;
  const { colors } = useTheme();

  const isDisabled = 
    requireVerifiedBankAccountForWithdraw && 
    (selectedAccount?.status === 'pending' || selectedAccount?.status === 'declined');

  return (
    <React.Fragment>
      {hasData ? (
        <View style={{ width: '100%' }}>
          <AccountCard
            item={selectedAccount}
            crypto={crypto}
            currency={currency}
            trustlineHook={trustlineHook}
            badgeRightAlign={badgeRightAlign}
            setShowTrustlineError={setShowTrustlineError}
            disabled={isDisabled}
            disableHover={disableHover}
          />
        </View>
      ) : (
        <EmptyListMessage id="add_new_account" />
      )}
    </React.Fragment>
  );
};

export default AccountSelectingCard;
