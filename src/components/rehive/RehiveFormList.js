import React, { Component } from 'react';
import { connect } from 'react-redux';

/* redux */
import { fetchData } from 'redux/rehive/actions';
import { currentCompanySelector } from 'redux/auth/selectors';

/* components */
import RehiveFormCard from './RehiveFormCard';
import { CardList } from './CardListNew';
import { useToast } from 'components/contexts/ToastContext';
import { View } from 'components/layout/View';
import Text from 'components/outputs/Text';
import { Button } from '@material-ui/core';
import Card from 'components/card/Card';
import { RehiveForm } from './RehiveForm';

/* util */
import {
  standardizeString,
  safe,
  concatAddress,
  concatBankAccount,
  getCurrencyCode,
} from 'util/general';
import {
  primaryItem,
  setActiveCurrency,
  deleteItem,
  resendVerification,
  submitOTP,
} from 'util/rehive';
import { AddressForm } from './AddressForm';

class RehiveFormList extends Component {
  state = {
    modalType: '',
    modalVisible: false,
    detail: false,
    index: 0,
    indexLoading: false,
    error: '',
  };

  async handleSubmitOTP(code) {
    const { showToast } = useToast();

    this.setState({ loading: true });
    try {
      await submitOTP(code);
      showToast({
        text: 'Mobile number verified successfully',
      });
      this.setState({ modalVisible: false });
    } catch (e) {
      this.setState({ error: e.message, loading: false });
      this._pinInput.clear();
      console.log(e);
    }
  }

  renderModalContent() {
    const { type, data, company } = this.props;
    const { modalType, index, error } = this.state;
    const { showToast } = useToast();
    const item = data.items[index];
    let content = null;
    let text = '';
    switch (modalType) {
      case 'verify':
        switch (type) {
          case 'mobile':
            content = (
              <View>
                <Text p={0.5} tA={'center'}>
                  {safe(item, 'number', '')}
                </Text>
                {/* <TextField
                  ref={input => {
                    this.mobile2fa = input;
                  }}
                  fullWidth
                  label="Mobile number"
                  placeholder="e.g. +278412345687"
                  helperText={'Please include country code'}
                  value={props.values.mobile2fa}
                  error={props.touched.mobile2fa && props.errors.mobile2fa}
                  type={'mobile'}
                  onBlur={() => props.setFieldTouched('mobile2fa')}
                  onChangeText={value =>
                    props.setFieldValue('mobile2fa', value)
                  }
                  // tintColor={colors.primary}
                  // onSubmitEditing={() => onSuccess(props.values.mobile2fa)}
                  selectTextOnFocus
                  spellCheck={false}
                  name={'mobile2fa'}
                  key={'mobile2fa'}
                /> */}
                {/* <CodeInput
                  ref={component => (this._pinInput = component)}
                  secureTextEntry={false}
                  activeColor="gray"
                  autoFocus
                  inactiveColor="lightgray"
                  className="border-b"
                  codeLength={5}
                  space={7}
                  size={30}
                  inputPosition="center"
                  onFulfill={code => this.handleSubmitOTP(code)}
                /> */}
                {error ? (
                  <Text p={0.5} tA={'center'} c={'error'} s={12}>
                    {error}
                  </Text>
                ) : null}
                <View p={1} aI={'center'}>
                  <Button
                    label="RESEND SMS"
                    wide
                    color={'primary'}
                    onPress={() => {
                      resendVerification(type, item, company);
                      showToast({
                        text: 'SMS resent',
                      });
                    }}
                  />
                </View>
              </View>
            );
            break;
          case 'email':
            content = (
              <Text p={0.5} tA={'center'}>
                {item.email}
              </Text>
            );
            // content = ( //TODO:
            //   <Button
            //     label="Open email app"
            //     textColor={company_config.colors.primaryContrast}
            //     backgroundColor={company_config.colors.primary}
            //     onPress={() =>
            //       maybeOpenURL('mailto:', {}).catch(err => {
            //         console.log(err);
            //       })
            //     }
            //   />
            // );
            break;
          case 'address':
          case 'bank_account':
          case 'crypto_address':
          default:
        }
        break;
      case 'delete':
      case 'primary':
      case 'active':
        switch (type) {
          case 'mobile':
            text = safe(item, 'number', '');
            break;
          case 'address':
            text = concatAddress(item);
            break;
          case 'bank_account':
            text = concatBankAccount(item);
            break;
          case 'wallet':
            text =
              standardizeString(item.account_name) +
              ': ' +
              getCurrencyCode(item.currency);
            break;
          default:
            text = item[type];
        }
        content = (
          <Text p={0.5} tA={'center'}>
            {text}
          </Text>
        );
        break;
      default:
    }

    return content;
  }

  modalContentText() {
    const { data, type } = this.props;
    const { modalType } = this.state;
    let text = '';
    switch (modalType) {
      case 'verify':
        switch (type) {
          case 'mobile':
            text =
              'An SMS containing a OTP to verify your mobile has been sent to ';
            break;
          case 'email':
            text =
              'Instructions on how to verify your email have been sent to ';
            break;
          case 'address':
          case 'bank_account':
          case 'crypto_address':
          default:
        }
        break;
      case 'delete':
        text = 'You are about to delete ' + standardizeString(type, false);
        break;
      case 'primary':
        text =
          'You are about to set your primary ' +
          standardizeString(type, false) +
          ' to';
        break;
      case 'active':
        text = 'You are about to set your active currency to';
        break;
      default:
    }
    return text;
  }

  async confirmDelete() {
    const { type, data } = this.props;
    const { index } = this.state;
    const id = safe(data.items[index], 'id', '');
    const { showToast } = useToast();

    try {
      await deleteItem(type, id);
      this.props.fetchData(type);
      showToast({
        text: standardizeString(type) + ' deleted',
      });
      this.hideModal();
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message, modalLoading: false });
    }
  }

  async confirmActive() {
    const { type, data } = this.props;
    const { index } = this.state;
    const item = data.items[index];
    const { showToast } = useToast();

    try {
      await setActiveCurrency(item.account, item.currency.code);
      this.props.fetchAccounts();
      showToast({
        text: standardizeString(type) + ' set as active',
      });
      this.hideModal();
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message, modalLoading: false });
    }
  }

  async confirmPrimary() {
    const { type, data } = this.props;
    const { index } = this.state;
    const item = data.items[index];
    const { showToast } = useToast();

    try {
      await primaryItem(type, item);
      this.props.fetchData(type);
      showToast({
        text: standardizeString(type) + ' set as primary',
        variant: 'success',
      });
      this.hideModal();
    } catch (error) {
      console.log(error);
      this.setState({ error: error.message, modalLoading: false });
    }
  }

  modalActionOne() {
    const { type } = this.props;
    const { modalType } = this.state;
    let text = '';
    let onPress = () => {};
    let disabled = false;
    switch (modalType) {
      case 'delete':
        text = 'DELETE';
        onPress = () => {
          this.setState({ modalLoading: true });
          this.confirmDelete();
        };
        break;
      case 'primary':
        text = 'MAKE PRIMARY';
        onPress = () => {
          this.setState({ modalLoading: true });
          this.confirmPrimary();
        };
        disabled = false;
        break;
      case 'active':
        text = 'MAKE ACTIVE';
        onPress = () => {
          this.setState({ modalLoading: true });
          this.confirmActive();
        };
        disabled = false;
        break;
      default:
    }
    return {
      text,
      onPress,
      disabled,
    };
  }

  modalActionTwo() {
    const { type } = this.props;
    const { modalType } = this.state;
    let text = 'CANCEL';
    let onPress = () => this.hideModal();
    let disabled = false;
    if (type === 'email' && modalType === 'verify') {
      text = 'CLOSE';
    }
    return {
      text,
      onPress,
      disabled,
    };
  }

  hideModal = modalType => {
    this.setState({ modalVisible: false, modalType, modalLoading: false });
  };

  showModal = (modalType, index) => {
    this.setState({
      modalVisible: true,
      index,
      modalType,
      modalLoading: false,
      error: '',
    });
  };

  showDetail = index => {
    this.setState({ detail: true, index, toScroll: true });
  };

  hideDetail = () => {
    this.setState({ detail: false });
  };

  render() {
    const { data, type, company, newHook } = this.props;
    const { modalLoading, detail, modalVisible, modalType, index } = this.state;

    const modal = {
      contentText: this.modalContentText(),
      content: this.renderModalContent(),
      type: modalType,
      loading: modalLoading,
      visible: modalVisible,
      // error,
      actionOne: this.modalActionOne(),
      actionTwo: this.modalActionTwo(),
      onDismiss: this.modalActionTwo().onPress,
    };

    const detailObj = {
      visible: detail,
      hideDetail: this.hideDetail,
      showDetail: index => this.showDetail(index),
    };

    if (detail || (newHook && newHook.value)) {
      return (
        <Card onPressContentDisabled>
          {type === 'addresses' ? (
            <AddressForm
              initial={data.items[index]}
              onDetailClose={this.hideDetail}
              onSaveSuccess={() => {
                this.props.fetchData(type);
                if (type === 'mobile') {
                  this.showModal('verify', index);
                }
              }}
            />
          ) : (
            <RehiveForm
              type={type}
              initial={data.items[index]}
              onDetailClose={this.hideDetail}
              onSaveSuccess={() => {
                this.props.fetchData(type);
                if (type === 'mobile') {
                  this.showModal('verify', index);
                }
              }}
            />
          )}
        </Card>
      );
    }

    return (
      <React.Fragment>
        <CardList
          data={data}
          detailObj={detailObj}
          ref={this.props.myRef}
          onRefresh={() => this.props.fetchData(type)}
          renderItem={(item, index) => (
            <RehiveFormCard
              key={index}
              company={company}
              type={type}
              item={item}
              index={index}
              detailObj={detailObj}
              showModal={this.showModal}
              onSaveSuccess={() => {
                this.props.fetchData(type);
                if (type === 'mobile') {
                  this.showModal('verify', index);
                }
              }}
            />
          )}
          modal={modal}
          keyExtractor={item => (item.id ? item.id.toString() : '')}
          emptyListMessage={'No ' + type + ' added yet'}
        />
        {/* <Toast /> */}
      </React.Fragment>
    );
  }
}

// export default RehiveFormList;

const mapStateToProps = state => {
  return {
    company: currentCompanySelector(state),
  };
};

export default connect(
  mapStateToProps,
  {
    fetchData,
  },
  null,
)(RehiveFormList);
