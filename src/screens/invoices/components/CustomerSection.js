import React from 'react';
import { get } from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import { standardizeString, formatOutputValue } from 'util/general';
import { createBusinessUser } from 'util/rehive';
import OutputList from 'components/lists/OutputList';
import { useState } from 'react';
import Text from 'components/outputs/Text';
import { Button } from 'components/inputs/Button';
import Spinner from 'components/outputs/Spinner';
import EmptyListMessage from 'components/lists/EmptyListMessage';

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

export default function CustomerSection(props) {
  const {
    item,
    section,
    history,
    business,
    customer,
    customerLoading,
    showToast,
    fetchCustomer,
    variant,
  } = props;

  const [addingCustomer, setAddingCustomer] = useState(false);
  let { id, label, fields = [], table, actions } = section;
  // if (!label) label = standardizeString(id);

  const classes = useStyles({ variant: true });
  const half = Math.ceil(fields.length / 2);
  const outputs = customer
    ? fields.map(field => {
        const { value, variant, standardize } = field;

        let valueFormatted = formatOutputValue(
          typeof value === 'function' ? value(customer) : get(customer, value),
          variant ? variant : '',
        );
        if (standardize) {
          valueFormatted = standardizeString(valueFormatted);
        }

        return { ...field, value: valueFormatted };
      })
    : [{ label: 'email', value: item?.payer_email }];

  const firstHalf = outputs.splice(0, half);
  const secondHalf = outputs.splice(-half);

  async function addCustomer() {
    setAddingCustomer(true);
    const respCustomer = await createBusinessUser(business?.id, {
      email: item?.payer_email,
      roles: ['customer'],
    });
    if (respCustomer.status === 'success') {
      showToast({ id: 'customer_add_success', variant: 'success' });
      fetchCustomer(respCustomer?.data?.id);
    } else {
      showToast({ id: 'customer_add_error', variant: 'error' });
      //error
    }
    // setAddingCustomer(false)
  }
  const isRtl = document.dir === 'rtl';

  return (
    <div className={classes.section}>
      <div className={classes.columns}>
        <Text id={label ?? id} variant="h6" className={classes.title} />
        {customerLoading ? null : customer?.id ? (
          actions &&
          actions.length &&
          actions.map(action => (
            <Button
              key={action?.id ?? action?.label ?? action}
              id={
                action?.id ??
                action?.label ??
                (typeof action === 'string' ? action : null)
              }
              noPadding
              size="small"
              variant="outlined"
              style={{ maxHeight: 26 }}
              color="primary"
              history={history}
              {...action}
              link={
                action && action.link && typeof action.link === 'function'
                  ? action.link(customer)
                  : ''
              }
            />
          ))
        ) : (
          <Button
            noPadding
            id="add_customer"
            size="small"
            style={{ maxHeight: 26 }}
            variant="outlined"
            color="primary"
            history={history}
            loading={addingCustomer}
            onClick={addCustomer}
          />
        )}
      </div>
      {customerLoading ? (
        <Spinner />
      ) : customer?.id ? (
        <div className={classes.columns}>
          <OutputList
            pr={isRtl ? 0 : 2}
            items={firstHalf}
            outputProps={{
              placeholderId: 'not_yet_provided',
              horizontal: !Boolean(variant),
              labelColor: Boolean(variant),
              labelBold: Boolean(variant),
            }}
          />
          <OutputList
            items={secondHalf}
            outputProps={{
              placeholderId: 'not_yet_provided',
              horizontal: !Boolean(variant),
              labelColor: Boolean(variant),
              labelBold: Boolean(variant),
            }}
          />
        </div>
      ) : (
        <EmptyListMessage id="customer_not_added" />
      )}
    </div>
  );
}
