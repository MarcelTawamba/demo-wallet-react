import { EMPTY_PROFILE } from 'config/empty';
import { updateProfileImage } from 'util/rehive';
import { updateUserProfile } from 'redux/auth/actions';

export const formConfig = props => {
  let fields = ['profile_upload'];

  return {
    defaultValues: EMPTY_PROFILE,
    fields,
    submitLabel: 'update',
    submitLabelCapitalize: true,
    actions: true,
    onSubmit: updateData,
  };
};

async function updateData(values, control, props) {
  const { setSubmitting, onSuccess, showToast, pageId, dispatch } = props;
  const { profile_upload } = values;

  setSubmitting(true);

  try {
    // Only attempt to upload if profile_upload is a File object
    if (profile_upload instanceof File) {
      const resp = await updateProfileImage(profile_upload);
      // Assuming updateUserProfile updates the user state in Redux/context
      dispatch(updateUserProfile(resp?.data ?? resp)); 
      onSuccess(resp?.data ?? resp);
      showToast({ id: `profile_image_update_success`, variant: 'success' });
    } else {
      // Handle cases where other profile fields might have been updated
      // If this form ONLY handles profile picture, we might not need an else.
      // If it handles other fields too, those updates should happen elsewhere
      // or the logic needs to be adjusted.
    }

  } catch (e) {
    showToast({ id: `profile_edit_error`, variant: 'error' });
  } finally { // Ensure setSubmitting(false) is always called
      setSubmitting(false);
  }
}

const exportConfigs = {
  id: 'profile',
  icon: 'Face',
  image: 'basic_info',
  imageSize: 80,
  variant: 'form',
  services: {
    updateData,
  },
  components: {
    form: formConfig,
  },
  condition: ({ context }) => context?.profileConfig?.hideProfile === true,
};

export default exportConfigs;
