import React from 'react';
import { get } from 'lodash';
import AboutContent from './AboutContent';
import { LANDING } from '../config/authMachine';

const AboutPage = props => {
  const { company, send, current } = props;

  function handleBack() {
    const previousState = get(current, ['transitions', 0, 'source', 'key'], '');
    if (previousState) {
      send(previousState);
    } else {
      send(LANDING);
    }
  }

  return <AboutContent company={company} onBack={handleBack} />;
};

export default AboutPage;
