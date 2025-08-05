import React from 'react';
import { View } from 'components/layout/View';
import { Button } from 'components/inputs/Button';
import Menu from '@material-ui/core/Menu';
import { useModal } from 'hooks/general';
import { Divider } from '@material-ui/core';
import { useFetchCurrencyDetails } from 'hooks/accountsAPI';

export default function AccountsActionList(props) {
  const {
    state,
    vertical,
    buttons,
    services,
    profile,
    currency,
    currencies,
    companyBankAccounts,
    userBankAccounts,
    handleStateChange,
    conversionPairs,
    businessServiceSettings,
    actionsConfig,
    tier,
    currencySubtypes,
  } = props;
  const {
    modalVisible: anchorEl,
    hideModal: handleClose,
    showModal: handleClick,
  } = useModal();
  
  function onButtonPress(type) {
    handleClose();
    handleStateChange(type === 'history' ? '' : type, { currencySubtypes });
  }

  function renderButton({ id, condition, label, labelId, disabled }) {
    let selected = false;
    if (state === id || (id === 'history' && !state)) {
      selected = true;
    }
    return (
      <Button
        key={id}
        id={labelId}
        tooltipId={disabled && disabled(currency) && 'available_in_fiat'}
        wide
        capitalize
        color={'primary'}
        onPress={() => onButtonPress(id)}
        disabled={disabled && disabled(currency)}
        size="small"
        variant={selected ? 'contained' : 'outlined'}
        data-testid="action-button"
      />
    );
  }

  const open = Boolean(anchorEl);

  let actions = buttons.filter(
    ({ condition, id }) =>
      !(
        condition &&
        !condition({
          services,
          profile,
          currency,
          companyBankAccounts,
          userBankAccounts,
          currencies,
          conversionPairs,
          actionsConfig,
          businessServiceSettings,
          tier,
          currencySubtypes,
        })
      ),
  );
  let visibleActions = [];
  let moreActions = [];

  if (!vertical && actions && actions.length && actions.length > 3) {
    visibleActions = actions.slice(0, 2); //.concat([{ id: 2, type: 'more' }]);
    moreActions = actions.slice(2);
  } else {
    visibleActions = actions;
  }

  if (
    !visibleActions.length ||
    (visibleActions.length === 1 && visibleActions[0].id === 'history')
  ) {
    return null;
  }

  return (
    <View
      fD={vertical ? 'column' : 'row'}
      p={vertical ? 0 : 1}
      style={
        vertical
          ? {}
          : {
              borderBottom: '1px solid #EFEFEF',
              overflow: 'hidden',
            }
      }>
      {visibleActions.map(renderButton)}
      {moreActions.length > 0 && (
        <Button
          wide
          color={'secondary'}
          variant={'outlined'}
          // onPress={onPress}
          label={'• • •'}
          size="small"
          aria-label="More"
          aria-owns={open ? 'long-menu' : undefined}
          aria-haspopup="true"
          onClick={event => handleClick(event?.currentTarget)}
        />
      )}
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            paddingLeft: 8,
            // left: -24,
            paddingRight: 8,
            maxHeight: 250,
            width: 200,
          },
        }}>
        {moreActions.map(renderButton)}
      </Menu>
      <Divider />
      {/* {this.renderModal()} */}
    </View>
  );
}
