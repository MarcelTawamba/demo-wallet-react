import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { View } from 'components/layout/View';
import FileUpload from 'components/inputs/FileUpload';
import Text from 'components/outputs/Text';
import {
  uploadMassSendCSV,
  getUploadCsvStatus,
  getMassTransactionStatus,
} from 'util/rehive';
import IconButton from 'components/inputs/IconButton';
import Icon from 'components/outputs/Icon';
import PageContent from 'components/layout/page/PageContent';
import PageTitle from 'components/layout/page/PageTitle';
import PageButtons from 'components/layout/page/PageButtons';
import SuccessPage from 'components/layout/page/SuccessPageNew';
import FailedPage from 'components/layout/page/FailedPageNew';
import moment from 'moment';
import { useQuery } from 'react-query';

export default function BatchSendForm(props) {
  const { account, history, currency } = props;

  const [formState, setFormState] = useState(''); // '', 'result', 'inProgress'
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);
  const [failedTransactions, setFailedTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState();
  const [checkUploadedStatus, setCheckUploadedStatus] = useState(false);

  function handleSubmit() {
    setLoading(true);
    handleUpload(file);
  }

  const uploadedCsvStatus = useQuery(
    ['massSendStatus', result?.data?.id],
    async () => getUploadCsvStatus(result.data.id),
    {
      enabled: checkUploadedStatus && !!result?.data?.id,
      refetchInterval: 5000,
    },
  );

  useEffect(() => {
    if (
      checkUploadedStatus &&
      uploadedCsvStatus.isFetching &&
      uploadedCsvStatus.data
    ) {
      if (uploadedCsvStatus.data?.data?.status === 'Completed') {
        getMassTransactionStatus(result.data.id)
          .then(massTransactionStatus => {
            if (massTransactionStatus?.status === 'success') {
              const _failedTransactions =
                massTransactionStatus.data.results.filter(
                  item => item.rehive_error,
                );
              if (_failedTransactions.length > 0) {
                setFailedTransactions(
                  _failedTransactions.map(item => ({
                    label: `Recipient - ${item.recipient}`,
                    message: item.rehive_error,
                  })),
                );
              } else {
                setMessage('All transactions are completed successfully.');
                setResult(massTransactionStatus);
              }
              setFormState('result');
            } else {
              setResult({
                message: 'Failed to get mass send transaction status',
              });
              setFormState('result');
            }
          })
          .catch(err => {
            setResult({
              message: 'Failed to get mass send transaction status',
            });
            setFormState('result');
          });
        setCheckUploadedStatus(false);
      }
    }
  }, [uploadedCsvStatus.isFetching]);

  async function handleUpload(file) {
    const resp = await uploadMassSendCSV(file);

    if (resp.status === 'success') {
      setFormState('inProgress');
      setResult(resp);
      setCheckUploadedStatus(true);
    } else {
      setResult(resp);
      setFormState('result');
    }

    setLoading(false);
  }

  function renderUpload() {
    return (
      <React.Fragment>
        <PageContent>
          <Text>
            <Text id="upload_csv_title" inline />{' '}
            <a
              href="https://dashboard.rehive.com/assets/files/Mass%20send%20example%20csv.csv"
              target="_blank"
              rel="noopener noreferrer">
              (example.csv)
            </a>
          </Text>
          <div
            style={{
              width: '100%',
              textAlign: 'left',
              marginBottom: 16,
              marginTop: 16,
            }}>
            <FileUpload
              onFileLoad={files => {
                var file = files[0];

                let f = window.URL.createObjectURL(file);

                var reader = new FileReader();

                reader.addEventListener(
                  'load',
                  function () {
                    setFile(file);
                    setPreview(f);
                  },
                  false,
                );

                if (file) {
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </PageContent>
      </React.Fragment>
    );
  }

  function renderConfirm() {
    return (
      <React.Fragment>
        <PageContent>
          <Text id="upload_csv_confirmation" inline />{' '}
          <Text inline>
            <b>{file.name}</b>
          </Text>
        </PageContent>

        <PageButtons
          layout={'vertical'}
          items={[
            {
              id: 'submit',
              capitalize: true,
              type: 'submit',
              size: 'large',
              disabled: loading,
              loading: loading,
              onPress: () => handleSubmit(),
            },
            {
              id: 'cancel',
              capitalize: true,
              variant: 'text',
              disabled: loading,
              onPress: () => {
                setPreview(null);
                setFile(null);
                setMessage('');
              },
            },
          ]}
        />
      </React.Fragment>
    );
  }

  function handleButtonPress(props, type) {
    if (type === 'success')
      return history.push(`/accounts/${account}/${currency?.currency?.code}`);

    setPreview(null);
    setFile(null);
    setMessage('');
    setFormState('');
    setResult(null);
    setFailedTransactions([]);
  }

  function renderInProgress() {
    const statusData = uploadedCsvStatus.data?.data;
    return (
      <PageContent>
        <Text id="upload_csv_success" />
        <View aI="center" mt={4} mb={3}>
          <CircularProgress size={32} />
        </View>
        {statusData && (
          <View mt={3}>
            <Text
              id="total_transactions_number"
              context={{ transactions: statusData.transactions_total }}
            />
            <Text
              id="transactions_completed_number"
              context={{ transactions: statusData.transactions_succeeded }}
            />
            <Text
              id="transactions_remaining_number"
              context={{
                transactions:
                  statusData.transactions_total -
                  statusData.transactions_succeeded,
              }}
            />
          </View>
        )}
      </PageContent>
    );
  }

  function renderResult() {
    if (result?.status === 'success' && failedTransactions.length === 0) {
      return (
        <SuccessPage
          pageStyle={{ marginTop: 32 }}
          fromAccount={currency.account_label || currency.account_name}
          handleButtonPress={handleButtonPress}
          successMessage={message}
          performedDate={moment().format('h.mm A, D MMMM YYYY')}
        />
      );
    } else {
      return (
        <FailedPage
          pageStyle={{ marginTop: 32 }}
          failedMessageId="transactions_failed"
          failedSecondaryMessage={null}
          result={result}
          labeledErrors={failedTransactions}
          handleButtonPress={handleButtonPress}
          performedDate={moment().format('h.mm A, D MMMM YYYY')}
        />
      );
    }
  }

  function renderRouter() {
    if (formState === 'inProgress') return renderInProgress();
    else if (formState === 'result') return renderResult();
    else if (file) return renderConfirm();
    else return renderUpload();
  }

  function ActionList() {
    const items = [
      {
        id: 'qr',
        icon: 'help-outline',
        onPress: () =>
          window.open(
            'https://rehive.intercom.help/en/articles/4367876-the-mass-send-extension-explained',
          ),
      },
    ];

    return (
      <div>
        {items.map(({ id, icon, onPress }) => (
          <IconButton
            key={id}
            style={{ padding: 4, margin: 4 }}
            onClick={onPress}>
            <Icon icon={icon} color={'primary'} inverted size={20} />
          </IconButton>
        ))}
      </div>
    );
  }

  return (
    <React.Fragment>
      {['', 'inProgress'].includes(formState) && (
        <PageTitle titleId="mass_send" actions={<ActionList />} />
      )}
      {renderRouter()}
    </React.Fragment>
  );
}
