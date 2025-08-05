export const statusText = item =>
  item.status === 'verified'
    ? 'verified'
    : item.status === 'pending'
    ? 'pending'
    : 'incomplete';
