import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Icon from 'components/outputs/NewIcon';
import Text from 'components/outputs/Text';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  requirement: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  requirementWithLink: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  containerHover: {
    paddingLeft: theme.spacing(1.5),
    padding: theme.spacing(0.5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  status: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
    minHeight: 24,
    minWidth: 24,
    borderRadius: 100,
  },
}));
export function isRequirementMet({
  requirement,
  profile,
  documents,
  addresses,
  bankAccounts,
}) {
  let status = false,
    navigateTo = null;

  profile = profile?.items ?? profile;
  let temp = [];
  switch (requirement.resource_type) {
    case 'user':
      if (requirement?.type === 'onboarding_user_status') {
        if (profile.status === 'verified') status = true;
        else status = false;
      } else {
        status = Boolean(profile[requirement.name]);
      }
      navigateTo = '/profile/';
      break;
    // case 'user':
    //   status = profile?.status === 'verified';
    //   break;
    case 'email':
      status = profile?.verification?.email;
      navigateTo = '/profile/emails/';
      break;
    case 'mobile':
      status = profile?.verification?.mobile;
      navigateTo = '/profile/mobiles/';
      break;
    case 'document':
      navigateTo = '/profile/documents/';
      const docs = documents?.items ?? [];
      status = false;
      const hasVerifiedDoc = docs.find(doc => {
        if (requirement?.documentType?.id === doc.type?.id) {
          if (doc.status === 'verified') return true;
          else if (doc.status === 'pending') status = 'pending';
        }
        return false;
      });
      if (hasVerifiedDoc) status = true;
      break;
    case 'address':
      status = false;
      const hasVerifiedAddress = addresses?.items.find(address => {
        if (address.status === 'verified') return true;
        else if (address.status === 'pending') status = 'pending';
        return false;
      });
      if (hasVerifiedAddress) status = true;
      navigateTo = '/profile/addresses/';
      break;
    case 'bank_account':
      temp = bankAccounts?.items ?? [];
      status = temp.length > 0;
      navigateTo = '/settings/bank/';
      break;
    default:
      status = false;
  }
  return { status, navigateTo };
}

export default function TierRequirement(props) {
  const { t } = useTranslation(['common']);
  let { requirement, history, ...restProps } = props;
  let { name } = requirement;
  const classes = useStyles();
  const { status, navigateTo } = isRequirementMet({
    requirement,
    ...restProps,
  });

  const handleNavigation = () => {
    if (navigateTo) {
      console.log(navigateTo);
      history.push(navigateTo);
    }
  };

  if (name === 'id_number' && props?.profile?.nationality === 'US')
    name = 'ssn';

  return (
    <div className={classes.container}>
      <Text
        className={
          navigateTo ? classes.requirementWithLink : classes.requirement
        }
        myColor="primary"
        onClick={handleNavigation}>
        {t(name) ?? ''}
      </Text>
      <div className={classes.status}>
        <Icon
          icon={
            status === 'pending'
              ? 'Hourglass'
              : status
              ? 'check'
              : 'errorOutline'
          }
          circled={false}
          color={
            status === 'pending' ? 'fontLight' : status ? '#0daf2e' : '#CC2538'
          }
        />
      </div>
    </div>
  );
}
