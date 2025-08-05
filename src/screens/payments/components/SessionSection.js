import React, { useEffect } from 'react';
import UAParser from 'ua-parser-js';

import { makeStyles } from '@material-ui/core/styles';
import { standardizeString, objectToArray } from 'util/general';
import { getBusinessInvoiceLogs, createBusinessUser } from 'util/rehive';
import Text from 'components/outputs/Text';
import OutputList from 'components/lists/OutputList';
import { useState } from 'react';
import Spinner from 'components/outputs/Spinner';
import DetailSectionLayout from '../../../components/layouts/Detail/DetailSectionLayout';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 650,
    width: '100%',
  },
  component: {
    width: '100%',
    height: 'auto',
  },
  container: {
    width: '100%',
    minWidth: 650,
    border: '1px solid #EFEFEF',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 300,
  },
  root: {
    width: '100%',
    padding: theme.spacing(1),
    paddingBottom: 300,
    overflow: 'scroll',
  },
  section: {
    width: '100%',
    padding: theme.spacing(1.5),
    paddingLeft: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    paddingRight: ({ variant }) =>
      variant ? theme.spacing(3) : theme.spacing(2),
    border: ({ variant }) => (variant ? '' : '1px solid #EFEFEF'),
    backgroundColor: ({ variant }) => (variant ? '#FAFAFA' : '#FFFFFF'),
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
    backgroundColor: '#FFFFFF',
  },
  columnsVariants: {
    display: 'flex',
    flexDirection: 'columns',
    justifyContent: 'space-between',
    paddingTop: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    paddingBottom: ({ variant }) => (variant ? 0 : theme.spacing(1)),
    padding: theme.spacing(1),
  },
  footerOutput: {
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    paddingTop: 0,
  },
}));

function concatUA(item, type) {
  return objectToArray(item)
    .filter(item => item)
    .join(', ');
}

export default function SessionSection(props) {
  const { item, section, context } = props;
  const { business } = context;
  const invoiceId = item?.metadata?.service_payment_requests?.request_id;

  let { id, label, fields = [], table, actions } = section;
  if (!label) label = standardizeString(id);

  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const session = items?.[0];
  var ua = new UAParser();
  ua.setUA(session?.user_agent ?? '');
  var userAgent = ua.getResult();

  useEffect(() => {
    setLoading(true);
    async function handleFetch() {
      const resp = await getBusinessInvoiceLogs(
        business?.id,
        invoiceId,
        '?page_size=1',
      );
      setItems(resp?.data?.results);
      setLoading(false);
    }

    if (business?.id && invoiceId) {
      handleFetch();
    } else {
      setLoading(false);
    }
  }, [business, invoiceId]);
  if (!loading && !invoiceId) {
    return null;
  }

  const device = concatUA(userAgent?.device);

  let firstHalf = [
    {
      label: 'Operating system',
      value: concatUA(userAgent?.os),
    },
    {
      label: 'Browser',
      value: concatUA(userAgent?.browser),
    },
  ];
  if (device) {
    firstHalf.push({
      label: 'Device',
      value: device,
    });
  }
  const secondHalf = [
    {
      label: 'Device IP address',
      value: session?.ip_address,
    },
  ];

  return (
    <DetailSectionLayout {...props}>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes.columns}>
          <div style={{ width: '50%' }}>
            <Text style={{ paddingBottom: 8 }} bold>
              USER AGENT
            </Text>
            <OutputList items={firstHalf} outputProps={{ horizontal: true }} />
          </div>
          <div style={{ width: '50%' }}>
            <Text style={{ paddingBottom: 8 }} bold>
              LOCATION
            </Text>
            <OutputList items={secondHalf} outputProps={{ horizontal: true }} />
          </div>
        </div>
      )}
    </DetailSectionLayout>
  );
}
