import React from 'react';
import { BusinessProvider, useBusiness } from './BusinessContext';
import {
  useRehiveContext,
  useRehiveMethods,
  RehiveProvider,
} from './RehiveContext';

function Providers(props) {
  const { children } = props;

  return (
    <RehiveProvider>
      <BusinessProvider>{children}</BusinessProvider>
    </RehiveProvider>
  );
}

export { Providers, useRehiveContext, useRehiveMethods, useBusiness };
