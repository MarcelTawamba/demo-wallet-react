import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import EndDateFilterBarOption from './EndDateFilterBarOption';
import StartDateFilterBarOption from './StartDateFilterBarOption';
import DateRangeFilter from './DateRangeFilter';
import { formatValue } from 'util/filters';
import { isEmpty } from 'lodash';
import useI18Language from 'hooks/useI18Language';

function FilterBarOption(props) {
  const { getI18Translation } = useI18Language();
  const {
    label,
    override,
    onDelete,
    filters,
    onClick,
    id,
    search,
    urlValue,
    currency,
    subtypes,
    context,
  } = props;

  const value = formatValue(filters, id, {
    ...context,
    currency: currency?.currency ?? currency,
    subtypes,
  });

  const active =
    !isEmpty(value) ||
    search === '?' + override ||
    (typeof override === 'string' && override === search && override) ||
    (typeof urlValue === 'string' && '?' + urlValue === search);

  const classes = useStyles({ active });
  const chipProps = active ? { color: 'primary' } : {};

  if (id === 'dateRange') return <DateRangeFilter {...props} />;
  else if (id === 'endDate') return <EndDateFilterBarOption {...props} />;
  else if (id === 'startDate') return <StartDateFilterBarOption {...props} />;

  const translatedLabel = getI18Translation(label ?? id);

  return (
    <Chip
      label={translatedLabel + (active ? (value ? ': ' : '') + value : '')}
      clickable
      variant={'outlined'}
      className={classes.chip}
      classes={{ outlined: classes.outlined }}
      {...chipProps}
      onClick={onClick}
      onDelete={active ? onDelete : null}
    />
  );
}

export default React.memo(FilterBarOption);

const useStyles = makeStyles(theme => ({
  chip: {
    padding: 0,
    marginLeft: 0,
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: ({ active }) => (active ? '600' : '400'),
  },
  outlined: {
    opacity: ({ active }) => (active ? 1 : 0.67),
    borderWidth: 1,
    padding: 0,
    height: 26,
  },
}));
