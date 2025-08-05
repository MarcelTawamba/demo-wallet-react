import { EMPTY_PROFILE } from 'config/empty';
import { updateItem } from 'util/rehive';
import { errorMapper } from 'util/general';
import { intersectTierRequirements } from 'screens/onboarding/config/utils';
import { updateUserProfile } from 'redux/auth/actions';
import { ProfileForm } from 'components/rehive/ProfileForm';
import { getCode } from 'country-list';

function mapDefaultValues(values) {
  return values;
}

export const formConfig = props => {
  const { tiers } = props;

  const fields = intersectTierRequirements({
    section: 'user_basic_info',
    tiers: tiers?.items ?? [],
    applyOverrides: true,
  });

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
  const { setSubmitting, onSuccess, showToast, pageId, dispatch } = props;
  setSubmitting(true);
  try {
    const data = {
      ...values,
      nationality: values?.nationality ? (getCode(values.nationality) || values.nationality) : values?.nationality,
      residency: values?.residency ? (getCode(values.residency) || values.residency) : values?.residency,
    };

    const resp = await updateItem('profile', data);
    onSuccess(resp?.data ?? resp);
    dispatch(updateUserProfile(resp?.data ?? resp));
    showToast({ variant: 'success', id: `basic_info_edit_success` });
  } catch (error) {
    let mappedError = errorMapper({ error });

    showToast({
      variant: 'error',
      text: mappedError,
    });
    // setStatus({ error: error.message });
  }
  setSubmitting(false);
}

const exportConfigs = {
  id: 'basicInfo',
  title: 'basic_title',
  description: 'basic_description',
  icon: 'Account',
  image: 'basic_info',
  imageSize: 80,
  type: 'profile',
  variant: 'component',
  component: ProfileForm,
  services: {
    updateData,
  },
};

export default exportConfigs;
