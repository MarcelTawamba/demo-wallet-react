import { setActiveCurrency } from 'util/rehive';
import Inputs from '../../components/inputs';
import { fetchAccounts } from 'screens/accounts/redux/actions';

const formConfig = props => {
  const { reduxContext: context = {} } = props;
  const { primaryCurrency } = context;

  return {
    defaultValues: { primaryCurrency: primaryCurrency?.primary?.code },
    submitLabel: 'save',
    submitLabelCapitalize: true,
    inputComponents: Inputs,
    onSubmit,
    fields: ['primaryCurrency'],
  };
};

async function onSubmit(values, control, props) {
  const { dispatch, showToast, history, context = {} } = props;
  const { setSubmitting, reset, setError } = control;
  const { primaryCurrency = {} } = values;
  const currency = primaryCurrency?.code ?? primaryCurrency;

  try {
    const resp = await setActiveCurrency(
      context?.primaryCurrency?.primary?.account,
      currency,
    );
    showToast({ id: `primary_currency_update_success`, variant: 'success' });
    dispatch(fetchAccounts());
    history.push('/settings/preferences/');
  } catch (e) {
    reset();
    setError('primaryCurrency', {
      type: 'custom',
      message: e?.message ?? 'Unable to update primary currency',
    });

    showToast({ id: `primary_currency_update_fail`, variant: 'error' });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  title: 'primaryCurrency',
  variant: 'form',
  image: 'currency',
  id: 'primaryCurrency',
  parent: 'preferences',
  components: {
    form: formConfig,
  },
};

export default exportConfigs;
