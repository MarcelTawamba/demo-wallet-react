import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import { getEnvVar } from './utils/env';

// Import polyfills
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'components/rehive/icons.css';
import 'components/rehive/icons2.css';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import * as serviceWorker from './serviceWorker';
import ErrorBoundary from 'components/error/ErrorBoundary';
import { BrowserRouter as Router } from 'react-router-dom';
import { persistor, store } from 'redux/root/store';
import { initWithoutToken } from 'util/rehive';
import AppContainer from './components/app';
import { ConfigurationProvider } from 'components/contexts/ConfigurationContext';
import { LanguageProvider } from 'components/contexts/LanguageContext';
import { LanguageProvider as LanguageProviderI18n } from 'util/i18n';
import { ToastProvider } from 'components/contexts/ToastContext';
import locales from 'config/locales';
import 'util/i18n';
import { ReactQueryDevtools } from 'react-query/devtools';

import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: true,
      notifyOnChangeProps: ['data', 'error', 'isLoading', 'isFetching'],
    },
  },
});

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  Sentry.init({
    dsn: getEnvVar('VITE_SENTRY_DSN'),
  });
}

document.documentElement.style.setProperty(
  '--vh',
  `${window.innerHeight / 100}px`,
);

const App = () => {
  useEffect(() => {
    initWithoutToken();
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <ErrorBoundary>
              <ConfigurationProvider>
                <LanguageProviderI18n>
                  <LanguageProvider value={locales}>
                    <ToastProvider>
                      <Router>
                        <AppContainer />
                      </Router>
                    </ToastProvider>
                  </LanguageProvider>
                </LanguageProviderI18n>
              </ConfigurationProvider>
            </ErrorBoundary>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

const container = document.getElementById('root');
ReactDOM.render(<App />, container);

serviceWorker.unregister();
