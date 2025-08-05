import React from 'react';
import { get } from 'lodash';

import SettingsOverviewItem from './SettingsOverviewItem';
import PageTitle from 'components/layout/page/PageTitle';
import ErrorBoundary from 'components/error/ErrorBoundary';
import { Box } from '@material-ui/core';

export default function SettingsOverviewSection(props) {
  const {
    reduxData = {},
    history,
    base = '/settings/',
    item = {},
    index,
    last,
  } = props;

  const { id, subtitle, children } = item;

  function handleStateChange(key) {
    history.push(base + ((key ?? id) + '/'));
  }

  const keys = Object.keys(children).filter(({ condition }) =>
    typeof condition === 'function' ? condition(reduxData) : true,
  );

  return (
    <Box pb={last ? 2 : 0} width="100%">
      <Box pl={3} pr={3} pb={0.5} width="100%">
        <PageTitle
          titleVariant="h6"
          align="left"
          id={id}
          subtitle={subtitle}
          noPadding
          divider={index > 0}
        />
      </Box>
      {keys.map(key => {
        const { value, status, renderItem, label, condition } = children[key];
        const data = reduxData[key];

        if (renderItem) {
          return renderItem({
            key,
            data,
            item: children[key],
            reduxData,
            handleStateChange,
          });
        }

        return (
          <SettingsOverviewItem
            id={key}
            key={key}
            hide={typeof condition === 'function' && !condition(reduxData)}
            label={label}
            value={
              typeof value === 'function'
                ? value(data)
                : get(data, value, value)
            }
            status={
              typeof status === 'function'
                ? status(data ?? props)
                : get(data, status, status)
            }
            onClick={() => handleStateChange(key)}
          />
        );
      })}
    </Box>
  );
}

export { SettingsOverviewItem };
