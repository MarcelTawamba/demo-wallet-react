import { createUserToken, getUserTokens, deleteUserToken } from 'util/rehive';

const defaultValues = {
  'password-new': '',
  token_duration: '',
};

async function createData(values, control, props) {
  const { history, onSuccess, showToast, setModal } = props;
  const { setSubmitting, setErrors } = control;

  if (typeof setSubmitting === 'function') setSubmitting(true);
  const { 'password-new': password, duration } = values;
  let data = {
    password,
    duration: parseInt(duration === '' ? 0 : duration),
    auth_method: 'token',
  };
  const resp = await createUserToken(data);
  if (resp.status === 'success') {
    const hasChallenge = resp.data?.challenges?.length > 0;

    if (!hasChallenge) {
      onSuccess();
      showToast({ id: 'token_add_success', variant: 'success' });
      history.push('/developers/api_tokens/');
    }
    setModal({
      id: hasChallenge ? 'token' : 'verified_token',
      item: resp?.data,
      title: 'Verify API Token',
      onSuccess,
    });
  } else {
    let errorMessages = [];
    if (resp.data && typeof resp.data === 'object') {
      for (const key in resp.data) {
        errorMessages = errorMessages.concat(resp.data[key]);
      }
    }
    showToast({
      id:
        errorMessages.length > 0 ? errorMessages.join(' ') : 'token_add_error',
      variant: 'error',
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const formConfig = props => {
  const { company } = props;
  let fields = ['password-new'];
  if (company?.settings?.allow_session_durations) {
    fields.push('token_duration');
  }
  return {
    title: 'add_token',
    description: 'add_token_password_description',
    defaultValues,
    variant: 'tabs',
    submitLabel: 'add',
    onSubmit: createData,
    fields,
  };
};

async function fetchData(cnt, event) {
  try {
    let resp = await getUserTokens();
    if (resp.status === 'success') {
      return resp?.data;
    }
  } catch (e) {
    console.log('fetchData -> e', e);
  }
}

async function onDelete(event, id, props) {
  const { onSuccess, showToast } = props;
  const resp = await deleteUserToken(id);
  if (resp.status === 'success') {
    onSuccess();
    showToast({ id: 'token_delete_success', variant: 'success' });
  } else {
    showToast({ id: 'token_delete_error', variant: 'error' });
  }
}
const exportConfigs = {
  id: 'api_tokens',
  title: 'api_tokens',
  value: '',
  services: {
    fetchData,
    createData,
  },
  components: {
    list: {
      variant: 'table',
      actions: [{ label: 'new_token', id: 'new' }],
      pagination: true,
      columns: [
        {
          label: 'token',
          value: 'token_key',
          props: {
            cellStyle: {
              paddingRight: 180,
            },
          },
        },
        {
          label: 'created_short',
          value: 'created',
          variant: 'date_time',
          width: 100,
          props: {
            cellStyle: {
              paddingRight: 180,
            },
          },
        },
        {
          label: 'expires',
          value: 'expires',
          variant: 'date_time',
          placeholder: 'Permanent token',
          width: 100,
          props: {
            cellStyle: {
              paddingRight: 180,
            },
          },
        },
      ],
      onDelete,

      emptyListMessage: 'no_tokens',
      initialFilters: { page_size: { value: 15 } },
    },
    form: formConfig,
    // detail: detailConfig,
  },
};

export default exportConfigs;
