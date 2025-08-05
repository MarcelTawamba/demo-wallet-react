import React, { Component } from 'react';
import { get } from 'lodash';

import { Formik } from 'formik';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import PageButtons from 'components/layout/page/PageButtons';
import AmountInput from '../AmountInput';

import Modal from 'components/layout/Modal';
import ReceivePaymentQR from './ReceivePaymentQR';
import ReceivePaymentDisplayModal from './ReceivePaymentDisplayModal';

class ReceivePaymentForm extends Component {
  state = {
    formState: '',
  };

  renderReceive = formikProps => {
    const { currency, showToast, rates, services } = this.props;
    const amountInputProps = {
      services,
      // rates,
      formikProps,
      currency,
    };

    const qrProps = {
      currency,
      showToast,
      rates,
      services,
      formikProps,
      size: 250,
    };

    return (
      <React.Fragment>
        <ReceivePaymentQR {...qrProps} />
        <AmountInput {...amountInputProps} />
        {/* <View aI={'flex-start'} w={'100%'} pv={0.5}>
          <OutputList items={receiveItems} />
        </View> */}
      </React.Fragment>
    );
  };

  copyToClipboard = text => {
    const { showToast } = this.props;
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = text;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = { position: 'absolute', left: '-9999px' };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
    showToast({ text: 'Copied to clipboard: ' + text });
  };

  renderDisplayModal(formikProps) {
    const { modalVisible } = this.state;
    const { currency, showToast, rates, services } = this.props;

    const profile = get(formikProps, ['values', 'profile']);

    const modalProps = {
      currency,
      showToast,
      rates,
      services,
      formikProps,
      profile,
    };
    return (
      <Modal
        close
        fullScreen
        maxWidth={2000}
        open={modalVisible}
        onDismiss={() => this.setState({ modalVisible: false })}>
        <ReceivePaymentDisplayModal {...modalProps} />
      </Modal>
    );
  }

  render() {
    const { profile } = this.props;

    return (
      <Formik
        initialValues={{
          profile: get(profile, ['items']),
          amount: '',
        }}>
        {props => (
          <React.Fragment>
            <PageTitle titleId="receive_payment" />
            <PageContent>{this.renderReceive(props)}</PageContent>

            <PageButtons
              layout={'vertical'}
              items={[
                {
                  id: 'display_print',
                  type: 'submit',
                  onPress: () => this.setState({ modalVisible: true }),
                  capitalize: true,
                },
              ]}
            />
            {this.renderDisplayModal(props)}
          </React.Fragment>
        )}
      </Formik>
    );
  }
}

export default ReceivePaymentForm;
