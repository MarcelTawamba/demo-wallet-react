export function convertToFormData(fields) {
  let formData = new FormData();
  fields.map(field => formData.append(field.key, field.value));
  return formData;
}
