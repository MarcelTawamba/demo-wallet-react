import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';

import { formatAmountString } from 'util/general';
import { useFieldArray, Controller } from 'react-hook-form';
import Selector from './Selector';
import Text from 'components/outputs/Text';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  addRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',

    alignItems: 'center',
    // paddingBottom: theme.spacing(2),
  },
  arrayRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    // paddingTop: theme.spacing(1),
    // paddingBottom: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrayContainer: { paddingInlineStart: 0 },
  remove: {
    paddingLeft: theme.spacing(1),
    paddingTop: 2,
    // width: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  total: {
    paddingRight: 40,
  },
}));

function mapTotal(products, items) {
  let total = 0;

  products.map(item => {
    total = total + parseFloat(items?.[item?.index]?.price);
    return total;
  });
  return total;
}

export default function RefundItemListInput(props) {
  const { control, items, currency } = props;
  const classes = useStyles();
  const arrayHelpers = useFieldArray({
    control,
    name: 'products',
    rules: {
      required: true,
      validate: item => {
        console.log('RefundItemListInput -> item', item);
        return item?.[0]?.price;
      },
    },
  });

  const maxLength = items.reduce(
    (n, { quantity }) => n + parseInt(quantity),
    0,
  );
  const { products } = control?.getValues();

  const { fields, append } = arrayHelpers;
  const options = items
    .map((item, index) => ({
      index,
      ...item,
    }))
    .filter(
      i => products?.filter(p => p?.index === i?.index)?.length < i?.quantity,
    );
  const total = mapTotal(products, items);

  function handleAdd() {
    append({ index: null }, true);
  }

  useEffect(() => {
    if (fields?.length === 0) handleAdd();
  }, []);
  return (
    <>
      <div className={classes.container}>
        {fields && fields.length > 0 ? (
          <div className={classes.arrayContainer}>
            {fields.map((item, index) => (
              <RefundItemRow
                control={control}
                key={item.id}
                index={index}
                fields={fields}
                item={items?.[item?.index]}
                items={items}
                options={options}
                arrayHelpers={arrayHelpers}
                // defaultValue={defaultValues?.[index]}
                {...props}
              />
            ))}
          </div>
        ) : (
          <EmptyListMessage id="no_items_added_to_invoice" />
        )}
        <div className={classes.addRow}>
          <Text className={classes.total} align="right">
            {formatAmountString(total, currency)}
          </Text>
          <IconButton
            noPadding
            inverted={false}
            disabled={fields?.length === maxLength}
            noMi
            icon="plus"
            onClick={handleAdd}
          />
        </div>
      </div>
    </>
  );
}

function RefundItemRow(props) {
  const {
    index,
    control,
    arrayHelpers,
    options = [],
    currency,
    items,
    defaultValue = {},
  } = props;

  const classes = useStyles();
  return (
    <li key={index} className={classes.arrayRow}>
      <Selector
        variant="outlined"
        label={'Product ' + (index + 1)}
        control={control}
        placeholder="Select product"
        name={`products[${index}].index`}
        items={items}
        options={options}
        currency={currency}
      />

      <div className={classes.remove}>
        <IconButton
          noPadding
          size={16}
          icon="minus"
          onClick={() => arrayHelpers.remove(index)}
          inverted
        />
      </div>
    </li>
  );
}
