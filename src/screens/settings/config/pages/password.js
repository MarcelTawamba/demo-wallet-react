import { EMPTY_PASSWORD } from 'config/empty';
import { changePassword } from 'util/rehive';

const formConfig = props => {
  const { authConfig } = props?.reduxContext ?? {};
  let fields = ['old_password', 'new_password1'];

  if (authConfig.confirm_password) {
    fields.push('new_password2');
  }

  return {
    defaultValues: EMPTY_PASSWORD,
    submitLabel: 'save',
    submitLabelCapitalize: true,
    onSubmit,
    fields,
  };
};

async function onSubmit(values, control, props) {
  const { reduxData, showToast, history } = props;
  const { setSubmitting, reset, setError } = control;
  const { old_password, new_password1, new_password2 } = values;

  try {
    const data = {
      old_password,
      new_password: new_password1,
    };
    await changePassword(data);
    showToast({ id: `password_update_success`, variant: 'success' });
    reset();
    history.push('/settings/security/');
  } catch ({ message }) {
    reset();
    // setError('old_password', { type: 'custom', message });

    showToast({ id: `password_update_fail`, variant: 'error' });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  title: 'changePassword',
  variant: 'form',
  parent: 'security',
  components: {
    form: formConfig,
  },
};

export default exportConfigs;
