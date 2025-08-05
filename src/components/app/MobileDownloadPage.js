import React from 'react';
import Form from 'components/layout/Form';
import PageTitle from 'components/layout/page/PageTitle';
import PageContent from 'components/layout/page/PageContent';
import ResponsiveFlexBox from 'components/layout/ResponsiveFlexBox';
import { Button } from 'components/inputs/Button';

import { useConfiguration } from 'components/contexts/ConfigurationContext';

/* components */
const MobileDownloadPage = props => {
  let { config: client } = useConfiguration();

  const { android_play_store_url, apple_app_store_url } = client;

  if (android_play_store_url || apple_app_store_url) {
    return (
      <Form noPadding noTitle>
        <PageTitle title={'Get mobile wallet'} />
        <PageContent footer>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              paddingBottom: 32,
              width: '100%',
            }}>
            <ResponsiveFlexBox
              fullWidth={false}
              left={
                apple_app_store_url ? (
                  <Button
                    style={{ borderRadius: 3 }}
                    variant="text"
                    newTab
                    href={apple_app_store_url}>
                    <img
                      style={{ width: 200 }}
                      alt={'apple-store-download'}
                      src={'/images/apple_store_download.png'}
                    />
                  </Button>
                ) : null
              }
              right={
                android_play_store_url ? (
                  <Button
                    style={{ borderRadius: 3 }}
                    variant="text"
                    newTab
                    href={android_play_store_url}>
                    <img
                      style={{ width: 200 }}
                      alt={'play-store-download'}
                      src={'/images/play_store_download.png'}
                    />
                  </Button>
                ) : null
              }
            />
          </div>
        </PageContent>
      </Form>
    );
  }
  return null;
};

export default MobileDownloadPage;
