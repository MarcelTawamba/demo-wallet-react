import { setConversionSettings } from 'util/rehive';
import Inputs from '../../components/inputs';
import { fetchData } from 'redux/rehive/actions';

const formConfig = props => {
  const { reduxContext: context = {} } = props;
  const { displayCurrency } = context;

  return {
    defaultValues: { displayCurrency: displayCurrency?.code },
    submitLabel: 'save',
    submitLabelCapitalize: true,
    inputComponents: Inputs,
    onSubmit,
    fields: ['displayCurrency'],
  };
};

async function onSubmit(values, control, props) {
  const { dispatch, showToast, history } = props;
  const { setSubmitting, reset, setError } = control;
  const { displayCurrency = {} } = values;
  const display_currency = displayCurrency?.code ?? displayCurrency;

  const resp = await setConversionSettings({ display_currency });
  if (resp.status === 'success') {
    showToast({ id: `display_currency_update_success`, variant: 'success' });
    dispatch(fetchData('displayCurrency'));
    history.push('/settings/preferences/');
  } else {
    reset();
    setError('displayCurrency', {
      type: 'custom',
      message: resp?.message ?? 'Unable to update display currency',
    });

    showToast({ id: `display_currency_update_fail`, variant: 'error' });
  }

  if (typeof setSubmitting === 'function') setSubmitting(false);
}

const exportConfigs = {
  title: 'displayCurrency',
  variant: 'form',
  id: 'displayCurrency',
  parent: 'preferences',
  image: 'currency',
  components: {
    form: formConfig,
  },
};

export default exportConfigs;
