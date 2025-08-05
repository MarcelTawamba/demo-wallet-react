import { updateItem, deleteItem } from 'util/rehive';

export async function createData(values, control, props) {
  const { itemId, onSuccess, pageId, showToast } = props;
  // const { setSubmitting, setErrors } = control;

  try {
    // add manipulate values
    const resp = await updateItem(pageId, values);
    if (typeof onSuccess === 'function') onSuccess(resp?.data ?? resp);
    showToast({
      variant: 'success',
      id: `${pageId}_${itemId ? 'edit' : 'add'}_success`,
    });
  } catch (e) {
    showToast({
      variant: 'error',
      id:
        `${pageId}_${itemId ? 'edit' : 'add'}_error` +
        (e?.message ? ': ' + e?.message : ''),
    });
  }

  // if (typeof setSubmitting === 'function') setSubmitting(false);
}

export async function deleteData(props) {
  const { itemId, onSuccess, pageId, showToast, setSubmitting } = props;
  if (typeof setSubmitting === 'function') setSubmitting(true);
  try {
    await deleteItem(pageId, itemId);
    showToast({
      variant: 'success',
      id: `${pageId}_delete_success`,
    });
    onSuccess();
  } catch (error) {
    console.log(error);
    showToast({
      variant: 'error',
      id: `${pageId}_delete_failed`,
    });
  }
  if (typeof setSubmitting === 'function') setSubmitting(false);
}
