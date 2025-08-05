import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Text from 'components/outputs/Text';
import InvoiceList from 'components/layout/InvoiceList';
import Layout from '../components/Layout';

import ButtonList from 'components/lists/ButtonList';
import ReactToPrint from 'react-to-print';
import { Button } from 'components/inputs/Button';
import CheckoutHeader from '../components/CheckoutHeader';
import PageContent from 'components/layout/page/PageContent';

export default function InvoiceDetails(props) {
  const { onNext, context } = props;
  const { invoice, business, items } = context;
  const refPrint = useRef(null);
  const [isPrinting, setPrinting] = useState(false);

  const {
    request_currency: currency,
    request_reference,
    description,
    due_date,
  } = invoice;

  const classes = useStyles(props);

  const actions = [
    {
      label: 'NEXT',
      onClick: onNext,
      noPadding: true,
    },
  ];

  return (
    <Layout
      containerRef={refPrint}
      {...props}
      headerLeft={
        <div>
          <Text variant="subtitle1" align={'left'} myColor="#222222">
            Reference #
          </Text>
          <Text variant="subtitle2" align={'left'}>
            {request_reference}
          </Text>
        </div>
      }
      headerRight={
        <div>
          <Text variant="subtitle1" align={'right'} myColor="#222222">
            Due date
          </Text>
          <Text variant="subtitle2" align={'right'}>
            {moment(due_date).format('YYYY-MM-DD')}
          </Text>
        </div>
      }>
      <PageContent>
        <div className={classes.content}>
          <CheckoutHeader {...props} />
          <Text variant="h6" myColor="#222222" className={classes.orderHeader}>
            Order details
          </Text>
          {Boolean(description) && (
            <Text align={'center'} variant="body2">
              {description}
            </Text>
          )}
          <InvoiceList items={items} currency={currency} />
        </div>
        <div style={{ display: isPrinting ? 'none' : '', width: '100%' }}>
          {onNext && <ButtonList layout="vertical" items={actions} />}
          <div className={classes.buttons}>
            <ReactToPrint
              trigger={() => (
                <Button
                  {...{
                    label: 'Print/download PDF',
                    variant: 'link',
                    color: 'primary',
                    onClick: () => {},
                    noPadding: true,
                  }}
                />
              )}
              content={() => refPrint.current}
              onBeforeGetContent={() => setPrinting(true)}
              onAfterPrint={() => setPrinting(false)}
            />
          </div>
        </div>
      </PageContent>
    </Layout>
  );
}

const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    paddingBottom: theme.spacing(3),
  },
  buttons: {
    paddingTop: theme.spacing(3),
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));
