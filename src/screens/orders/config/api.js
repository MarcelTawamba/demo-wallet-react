import { getCampaigns, getRewards } from 'util/rehive';

export function fetchData(variant, id, query) {
  let response = null;
  switch (variant) {
    case 'campaigns':
      response = getCampaigns(id, query);
      break;
    case 'rewards':
      response = getRewards(id, query);
      break;
    default:
    // fallback fetchData
  }

  return Promise.resolve(response);
}
