import React from 'react';
import { useRehiveContext } from 'contexts';

import configs from './config';
import { useModal } from 'hooks/general';
import WebViewDisclaimerLayout from './components/WebViewDisclaimerLayout';
import { useRehive } from 'hooks/rehive';
import Modal from 'components/layout/Modal';

export default function WebView(props) {
  // let { onEvent, onExit, onSuccess, navigation, route } = props;

  const id = 'WyreKYC';
  // const { id } = route?.params ?? {};

  let config = configs?.[id] ?? {};
  let { uri, data } = config;

  const { showModal, hideModal, modalVisible } = useModal();
  const { context } = useRehiveContext();

  const query = useRehive(data);
  if (typeof config === 'function') config = config({ context });
  if (typeof uri === 'function') uri = uri({ context, query });

  const visible = !!(uri && config && modalVisible);

  function handleRedirect() {
    window.location = uri;
  }

  return (
    <>
      <WebViewDisclaimerLayout
        config={config}
        onPress={(!!uri || query?.loading) && handleRedirect}
        // onPress={(!!uri || query?.loading) && showModal}
        loading={query?.loading}
      />
      {/* <Modal open={visible}>
        <iframe
          // onLoad={() => {
          //   // if (loadCount === 0) setReset(true);
          //   setLoadCount(loadCount + 1);
          // }}
          // onLoadStart={event => setLoadStartCount(loadStartCount + 1)}
          id="stripe-3d-secure-iframe"
          frameBorder="0"
          width="100%"
          height={'100%'}
          src={uri}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          title="Stripe 3D secure"
        />
      </Modal> */}
      {/* <PopUpGeneral
        onDismiss={handleDismiss}
        showClose
        visible={visible}
        contentExtra={
          <View
            h={
              SCREEN_HEIGHT - (80 + Constants.statusBarHeight + keyboardHeight)
            }>
            {!!uri && (
              <RNWebView
                ref={webviewRef}
                source={{
                  uri,
                }}
                onLoad={event => console.log('event', event)}
                style={{ zIndex: 100000, flex: 1 }}
                // ref={ref => (webviewRef = ref)}
                // onError={() => webviewRef.reload()}
                // originWhitelist={['https://*', 'plaidlink://*']}
                // onShouldStartLoadWithRequest={handleNavigationStateChange}
              />
            )}
          </View>
        }
      /> */}
    </>
  );
}
