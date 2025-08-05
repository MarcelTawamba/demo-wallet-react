import React from 'react';
import { copyLink, remind, RenderConfirm } from '../common/paymentRequests';

const TransactionQuickActionConfig = ({
  request,
  currency,
  services,
  rates,
  user,
  accountRef,
  setLoading,
  setActionContentVisible,
  getTransactions,
  showToast,
}) => {
  return {
    request: {
      actions: {
        neutral_debit: [
          {
            label: 'pay',
            id: `request_pay_${request.id}`,
            get onPress() {
              return () => {
                setLoading && setLoading(this.id);
                setActionContentVisible(this.id);
              };
            },
            renderedOutput: ({ visible }) =>
              visible && (
                <RenderConfirm
                  {...{
                    request,
                    action: 'pay',
                    currency,
                    services,
                    rates,
                    user,
                    accountRef,
                    showToast,
                    onConfirm: () => {
                      setActionContentVisible(null);
                    },
                    onCancel: () => {
                      setLoading && setLoading(null);
                      setActionContentVisible(null);
                    },
                    onError: () => {
                      setLoading && setLoading(null);
                      setActionContentVisible(null);
                    },
                    onSuccess: () => {
                      showToast({
                        text: `Successful payment to ${
                          request.payer_email || request.payer_mobile
                        }`,
                        variant: 'success',
                      });

                      getTransactions && getTransactions();
                      setLoading && setLoading(null);
                      setActionContentVisible(null);
                    },
                  }}
                />
              ),
          },
        ],
        neutral_credit: [
          {
            label: 'remind',
            id: `request_remind_${request.id}`,
            get onPress() {
              return async () => {
                setLoading && setLoading(this.id);
                await remind({ request, showToast });
                setLoading && setLoading(null);
              };
            },
          },
        ],
        both: [
          {
            label: 'copy_link',
            onPress: () => copyLink({ request, showToast }),
          },
          {
            label: request.tx_type === 'neutral_debit' ? 'decline' : 'cancel',
            id: `request_cancel_${request.id}`,
            get onPress() {
              return () => {
                setLoading && setLoading(this.id);
                setActionContentVisible(this.id);
              };
            },
            renderedOutput: ({ visible }) =>
              visible && (
                <RenderConfirm
                  {...{
                    request,
                    action: 'cancel',
                    currency,
                    services,
                    rates,
                    user,
                    accountRef,
                    showToast,
                    onConfirm: () => {
                      setActionContentVisible(null);
                    },
                    onCancel: () => {
                      setLoading && setLoading(null);
                      setActionContentVisible(null);
                    },
                    onSuccess: () => {
                      getTransactions && getTransactions();
                      setLoading && setLoading(null);
                      setActionContentVisible(null);
                    },
                  }}
                />
              ),
          },
        ],
      },
    },
  };
};

export default TransactionQuickActionConfig;
