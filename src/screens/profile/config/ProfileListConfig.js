import { concatAddress } from 'util/general';
import { get } from 'lodash';

const ProfileListConfig = {
  profile: {
    title: 'Personal details',
    label: '',
    value: item => '',
    status: item =>
      item.verified
        ? 'verified'
        : item.first_name && item.last_name
        ? 'pending'
        : 'incomplete',
  },
  emails: {
    title: 'Email addresses',
    label: 'Email',
    value: item => item.email,
    status: item =>
      item.verification && item.verification.email
        ? 'verified'
        : item.email
        ? 'pending'
        : 'incomplete',
  },
  mobiles: {
    title: 'Mobile numbers',
    label: 'Mobile',
    value: item => item.number,
    overview: item => item.mobile,
    status: item =>
      item.verification && item.verification.mobile
        ? 'verified'
        : item.mobile
        ? 'pending'
        : 'incomplete',
  },
  addresses: {
    title: 'Addresses',
    label: 'Address',
    value: item => concatAddress(item),
  },
  tier: {
    title: 'Tiers and limits',
    label: 'Tier',
    value: item =>
      'Tier ' + item.name + (item.description ? ' - ' + item.description : ''),
  },
  documents: {
    title: 'Documents',
    label: 'Document',
    value: '',
  },
  referral: {
    title: 'Referral code',
    value: '',
  },
};

export default ProfileListConfig;
