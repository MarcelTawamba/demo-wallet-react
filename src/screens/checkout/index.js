import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles';

import { safeParams } from 'util/general';
import ErrorOutput from 'components/outputs/Error';
import { SplashScreen } from 'components/rehive/SplashScreen';

import ReceiptPage from './pages/ReceiptPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import SuccessPage from './pages/SuccessPage';
import WalletCheckoutPage from './pages/WalletCheckoutPage';
import CustomCheckoutPage from './pages/CustomCheckoutPage';
import InvoiceDetails from './pages/InvoiceDetails';
import { useMachine } from '@xstate/react';
import { checkoutMachine } from './config/machines';
import { getPaymentRequest, getPublicCompany } from 'util/rehive';
import { ThemeContext } from 'components/app/context';
import defaultColors from 'config/config/defaults/colors.json';
import { useQuery } from 'react-query';
import CryptoCheckoutPage from './pages/CryptoCheckoutPage';

export default function CheckoutContainer() {
  const history = useHistory();
  const { location } = history;
  let { search, pathname } = location;
  const params = new URLSearchParams(search);
  const paths = pathname.split('/');
  let id = safeParams(params, 'request', '');
  if (!id) {
    id = safeParams(params, 'request_id', '');
  }
  const [loading, setLoading] = useState(true);

  const checkoutMachineWithId = checkoutMachine.withContext({
    ...checkoutMachine.context,
    id,
    message: id ? '' : 'No request ID',
  });

  const [company, setCompany] = useState();

  async function fetchCompany() {
    const resp = await getPublicCompany(invoice?.user?.company);
    if (resp?.status === 'success') {
      setCompany(resp?.data);
    }
    setLoading(false);
  }

  const [state, send] = useMachine(checkoutMachineWithId, {
    // services: {
    //   setCompany,
    // },
    devTools: true,
  });
  const { context } = state;
  const { invoice, message, quote } = context;

  const colors = {
    ...defaultColors,
    ...company?.config?.colors,
    ...invoice?.metadata?.service_business?.business?.colors,
  };
  const checkoutConfig = company?.config?.checkout;

  useEffect(() => {
    if (invoice?.user?.company && company?.id !== invoice?.user?.company) {
      fetchCompany();
    } else {
      if (invoice) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [company, invoice]);

  const isRunning = state.matches('running');
  const enabled = !!id && (isRunning || state.matches('loading'));

  const { data, isLoading } = useQuery(
    ['payment-request', id],
    async () => getPaymentRequest(id, true),
    {
      enabled,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
    },
  );

  useEffect(() => {
    if (data?.status !== invoice?.status) {
      send({ type: 'NEXT', payload: { invoice: data } });
    }

    // Logic to check if quotes have gone expired / no pending/available quotes remain
    const quoteNew = data?.payment_processor_quotes?.find(
      item =>
        item?.status.match(/pending|processing|paid|received/)
    );
    if (data?.payment_processor_quotes?.length > 0 && !quoteNew) {
      console.log("ABOUT TO EXPIRE")
      send({ type: 'EXPIRED' });
    } else if (quote?.total_pending !== quoteNew?.total_pending) {
      send({ type: 'UPDATE', payload: { invoice: data } });
    }
    // what about expired quotes?
    // } else {
    //   // setError('Unable to retrieve invoice details');
    // }
  }, [data]);

  const onBack = () => send('BACK');
  const onNext = () => send('NEXT');

  const pageProps = {
    history, //remove these
    paths, //remove these

    onBack,
    onNext,

    send,
    state,

    context,
    config: checkoutConfig,
    company,
  };

  function content() {
    if (
      loading ||
      state.matches('loading') ||
      state.matches('init') ||
      !invoice?.id
    ) {
      return <SplashScreen />;
    }
    if (state.matches('error') || !invoice) {
      return <ErrorOutput>{message ?? 'Something went wrong'}</ErrorOutput>;
    }
    if (state.matches('complete')) {
      return <ReceiptPage {...pageProps} />;
    }
    if (state.matches('success')) {
      return <SuccessPage {...pageProps} />;
    }
    if (state.matches('running.invoice')) {
      return <InvoiceDetails {...pageProps} />;
    }
    if (state.matches('running.paymentMethods')) {
      return <PaymentMethodPage {...pageProps} />;
    }
    if (state.matches('running.crypto')) {
      return <CryptoCheckoutPage {...pageProps} />;
    }
    if (state.matches('running.wallet')) {
      return <WalletCheckoutPage {...pageProps} />;
    }
    if (state.matches('running.custom')) {
      return <CustomCheckoutPage {...pageProps} />;
    }
    return null;
  }

  // const { colors, design, company } = props;

  // const { loading } = useAppInit(company);
  if (colors) {
    let theme = createTheme({
      // shadows: ['none'],
      palette: {
        primary: {
          main: colors.primary,
          contrastText: colors.primary_contrast,
        },
        secondary: {
          main: colors.secondary,
          contrastText: colors.secondary_contrast,
        },
        dummy: {
          main: colors.secondary,
          contrastText: colors.secondary_contrast,
        },
        font: {
          primary: '#434343',
          secondary: '#434343',
        },
        background: {
          main: '#ffffff', //colors.grey1,
          contrastText: '#434343',
        },
        positive: {
          main: '#4A5',
        },
        negative: {
          main: '#E43',
        },
      },
      typography: {
        h6: { lineHeight: 1.2, fontSize: 18, color: '#434343' },
        body1: { lineHeight: 1.4, color: '#434343' },
        body2: { lineHeight: 1.4, color: '#434343' },
        h5: { fontWeight: 500, color: '#434343', lineHeight: 1 },
        h3: {
          fontWeight: 500,
          color: '#434343',
          fontSize: '2.2rem',
          // lineHeight: '2rem',
          // display: 'inline-block',
        },
        h4: {
          color: '#434343',
          fontSize: '1.6rem',
          lineHeight: 1,
        },
        overline: {
          color: '#434343',
        },
        caption: {
          color: '#434343',
        },
        subtitle2: {
          opacity: 0.7,
          fontSize: '0.75rem',
          fontWeight: 300,
        },
      },
      shape: { borderRadius: 10 },
      breakpoints: {
        values: {
          xs: 480,
          sm: 736,
          md: 980,
          lg: 1280,
          xl: 1600,
        },
      },
      overrides: {
        MuiIconButton: {
          root: {
            padding: 8,
          },
        },
        MuiListItem: {
          root: {
            '&$selected': {
              backgroundColor: '#EEE',
            },
          },
        },
        MuiTableRow: {
          // root: {
          //   '&:last-child td': {
          //     borderBottom: 0,
          //   },
          // },
        },
      },
      props: {
        MuiButton: {
          disableElevation: true,
        },
      },
    });

    return (
      <MuiThemeProvider theme={theme}>
        <ThemeContext.Provider value={{ colors }}>
          {content()}
        </ThemeContext.Provider>
      </MuiThemeProvider>
    );
  }
  return content();
}
