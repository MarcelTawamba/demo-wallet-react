/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Text from 'components/outputs/Text';
import { useTheme } from 'components/app/context';
import { trackFlow } from 'util/tracking';
import makeStyles from '@material-ui/styles/makeStyles';

const TermsLabel = props => {
  const { privacy_policy_url, terms_and_conditions_url } = props;
  const { colors } = useTheme();
  const classes = useStyles();

  function handleClick(option) {
    switch (option) {
      case 'privacy':
        trackFlow('register', 'form', ['privacy policy'], 'clicked');
        window.open(privacy_policy_url, '_blank');
        break;
      case 'terms':
        trackFlow('register', 'form', ['terms'], 'clicked');
        window.open(terms_and_conditions_url, '_blank');
        break;
      default:
        break;
    }
  }

  return (
    <div style={{ fontSize: 14 }}>
      {/* <Text className={classes.text}>
        {' By checking this you agree to the '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primary }}
          href="#"
          onClick={() => handleClick('privacy')}>
          Privacy Policy
        </a>
        {' and '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: colors.primary }}
          href="#"
          onClick={() => handleClick('terms')}>
          Terms & Conditions
        </a>
      </Text> */}
      <Text id="by_checking_this" inline s={14} />{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="#"
        onClick={() => handleClick('privacy')}>
        <Text id="privacy_policy" inline c="primary" s={14} />
      </a>{' '}
      <Text id="and" inline s={14} lowercase />{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="#"
        onClick={() => handleClick('terms')}>
        <Text id="terms_of_use" inline c="primary" s={14} />
      </a>
    </div>
  );
};
const useStyles = makeStyles(theme => ({
  text: {
    fontSize: 14,
  },
}));

export default TermsLabel;
