import React from 'react';

import OutputList from 'components/lists/OutputList';
import {
  standardizeString,
  getCurrencyCode,
  displayFormatDivisibility,
} from 'util/general';

const lang = {
  max: 'Maximum',
  day_max: 'Maximum per day',
  month_max: 'Maximum per month',
  min: 'Minimum',
  overdraft: 'Overdraft',
};

const LimitsList = props => {
  const { tier, subtype, currency, limits } = props;
  if (!tier || !limits) {
    return null;
  }
  // const { limits } = tier;
  let items = [];
  if (limits) {
    const subtypeLimits = limits.filter(
      limit =>
        limit.subtype === subtype &&
        limit.currency === currency?.currency?.code,
    );
    items = subtypeLimits?.map(limit => {
      return {
        label: standardizeString(
          lang[limit.type] + ' ' + (limit.subtype ? limit.subtype : ''),
        ),
        value: `${displayFormatDivisibility(
          limit.value,
          currency.currency.divisibility,
        )} ${getCurrencyCode(currency?.currency)}`,
        horizontal: true,
      };
    });
  }

  return <OutputList items={items} outputProps={{ align: 'right' }} />;
};

export default LimitsList;
