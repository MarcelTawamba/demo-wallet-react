import { EMPTY_PROFILE } from 'config/empty';
import { updateItem } from 'util/rehive';

function mapDefaultValues(values) {
  return values;
}

export const formConfig = props => {
  let fields = ['central_bank_number'];

  return {
    defaultValues: EMPTY_PROFILE,
    fields,
    submitLabel: 'update',
    submitLabelCapitalize: true,
    actions: true,
    mapDefaultValues,
    onSubmit: updateData,
  };
};

async function updateData(values, control, props) {
  const { setSubmitting, onSuccess, showToast, pageId } = props;
  setSubmitting(true);
  try {
    const data = {
      ...values,
    };

    const resp = await updateItem('profile', data);
    onSuccess(resp?.data ?? resp);
    showToast({ variant: 'success', id: `basic_info_edit_success` });
  } catch (e) {
    showToast({ variant: 'error', id: `basic_info_edit_error` });
  }
  setSubmitting(false);
}

const exportConfigs = {
  id: 'centralBankNumber',
  icon: 'AccountBalance',
  image: 'bank',
  imageSize: 80,
  type: 'profile',
  condition: ({ tiers }) => {
    if (!tiers) return false;
    return !Boolean(
      tiers?.items?.find(x =>
        Boolean(
          x.requirements?.find(y => y.requirement === 'central_bank_number'),
        ),
      ),
    );
  },
  services: {
    updateData,
  },
  components: {
    form: formConfig,
  },
};

export default exportConfigs;
