export function checkBusinessGroup(businessServiceSettings, userGroup) {
  return (businessServiceSettings?.manager_groups ?? [])?.includes(userGroup);
}
