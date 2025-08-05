import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { makeStyles } from '@material-ui/styles';

import Text from 'components/outputs/Text';
import NotificationManageList from './NotificationManageList';
import { getNotifications } from 'util/rehive';
import Spinner from 'components/outputs/Spinner';
import PageContent from 'components/layout/page/PageContent';
import Tabs from 'components/menu/Tabs';
import EmptyListPlaceholderImage from 'components/outputs/PlaceholderImage/empty/EmptyListPlaceholderImage';

const useStyles = makeStyles(theme => ({
  title: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function NotificationSettings(props) {
  const { showToast } = props;
  const dataHook = useState([]);
  const [data, setData] = dataHook;
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState('');
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const resp = await getNotifications();
      setData(_.get(resp, ['data', 'results'], []));
      setLoading(false);
    }
    fetchData();
  }, [setData]);

  let items = _(data)
    .groupBy(item => item.type)
    .value();

  const emailNotifications = _(items.email)
    .groupBy(item => item.event?.split('.')?.[0])
    .map((value, key) => ({ type: key, data: value }))
    .value();
  const smsNotifications = _(items.sms)
    .groupBy(item => item.event?.split('.')?.[0])
    .map((value, key) => ({ type: key, data: value }))
    .value();
  const pushNotifications = _(items.push)
    .groupBy(item => item.event?.split('.')?.[0])
    .map((value, key) => ({ type: key, data: value }))
    .value();

  const showEmail = emailNotifications.length > 0;
  const showSms = smsNotifications.length > 0;
  const showPush = pushNotifications.length > 0;
  const showTabs =
    (showEmail && showSms) || (showEmail && showPush) || (showPush && showSms);

  if (!state) {
    if (showEmail) {
      setState('email');
    } else if (showPush) {
      setState('push');
    } else if (showSms) {
      setState('sms');
    }
  }

  let tabs = [];
  if (showEmail) tabs.push({ label: 'Email', value: 'email' });
  if (showPush) tabs.push({ label: 'Push', value: 'push' });
  if (showSms) tabs.push({ label: 'SMS', value: 'sms' });

  return (
    <PageContent>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          {showTabs ? (
            <Tabs state={state} onChange={setState} tabs={tabs} />
          ) : showEmail ? (
            <Text variant={'h6'} className={classes.title}>
              Email notifications
            </Text>
          ) : showPush ? (
            <Text variant={'h6'} className={classes.title}>
              Push notifications
            </Text>
          ) : showSms ? (
            <Text variant={'h6'} className={classes.title}>
              SMS notifications
            </Text>
          ) : null}
          <React.Fragment>
            {state === 'email' ? (
              <NotificationManageList
                items={emailNotifications}
                dataHook={dataHook}
                showToast={showToast}
              />
            ) : state === 'push' ? (
              <NotificationManageList
                items={pushNotifications}
                dataHook={dataHook}
                showToast={showToast}
              />
            ) : state === 'sms' ? (
              <NotificationManageList
                items={smsNotifications}
                dataHook={dataHook}
                showToast={showToast}
              />
            ) : (
              <EmptyListPlaceholderImage
                name="notification"
                text="no_notification_preferences"
              />
            )}
          </React.Fragment>
        </React.Fragment>
      )}
    </PageContent>
  );
}
