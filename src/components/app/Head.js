import React from 'react';
import { HeadProvider, Title, Meta } from 'react-head';
import { useConfiguration } from 'components/contexts/ConfigurationContext';
import Favicon from 'react-favicon';

export default function Head() {
  let { config, loading, isGreyLabel } = useConfiguration();

  const { icon, logo, name, description } = config;
  const error = !loading && !isGreyLabel && !name;

  return (
    <React.Fragment>
      <Favicon
        url={loading || error ? '/images/ico.png' : icon ?? logo ?? '/images/ico.png'}
      />
      <HeadProvider>
        <Title>
          {loading
            ? '...'
            : error
            ? 'App unavailable'
            : `${name ?? 'Rehive'} Wallet`}
        </Title>
        <Meta name="description" content={description} />
      </HeadProvider>
    </React.Fragment>
  );
}
