import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import OutputList from 'components/lists/OutputList';

import Output from 'components/outputs/Output';
import { View } from 'components/layout/View';
import { formatPricesString } from 'util/products';

const useStyles = makeStyles(theme => ({
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
  },
  section: {
    width: '100%',
    paddingTop: theme.spacing(1.5),
    padding: theme.spacing(3),
    // paddingRight: theme.spacing(3),
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: theme.spacing(2),
  },
  image: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  detail: {
    marginLeft: theme.spacing(4),
  },
}));

export default function ProductPricing(props) {
  const { item } = props;
  const classes = useStyles();

  const { options = [], variants = [], prices = [], quantity } = item;
  if (!item?.id) {
    return null;
  }

  const optionOutputs = options?.map(option => ({
    label: option?.name,
    value: (option?.values ?? []).join(', '),
  }));

  const isSimple = !Boolean(variants?.length);

  return (
    <div className={classes.section}>
      <div className={classes.columns}>
        <Text
          variant={'h6'}
          className={classes.title}
          id={
            isSimple ? 'pricing_and_quantity' : 'variants_pricing_and_quantity'
          }
        />
      </div>
      {isSimple ? (
        <div className={classes.columns}>
          <div style={{ paddingTop: 8 }}>
            <Output
              label="quantity"
              value={quantity}
              placeholderId="not_tracked"
              labelColor
            />
          </div>
          <div style={{ paddingTop: 8 }}>
            <Output
              label="prices"
              value={formatPricesString(prices)}
              placeholderId="no_prices_added"
              labelColor
            />
          </div>
        </div>
      ) : (
        <div className={classes.columns}>
          <OutputList
            items={optionOutputs}
            layout="columns"
            outputProps={{
              placeholderId: 'not_yet_provided',
              labelColor: true,
              labelBold: true,
            }}
          />
          <div className={classes.row}>
            <View style={{ width: '35%', paddingRight: 16 }}>
              <Text
                id="code_label"
                width={'auto'}
                variant="caption"
                myColor={'primary'}
                fontWeight="500"
              />
            </View>
            <View fD="row" jC="space-between" w="100%">
              <Text
                id="quantity"
                style={{ flex: 1, paddingRight: 16 }}
                width={'auto'}
                variant="caption"
                myColor={'primary'}
                fontWeight="500"
              />
              {options?.map(option => (
                <Text
                  style={{ flex: 1, paddingRight: 16 }}
                  width={'auto'}
                  variant="caption"
                  myColor={'primary'}
                  fontWeight="500">
                  {option.name}
                </Text>
              ))}
              <Text
                style={{ flex: 1 }}
                width={'auto'}
                variant="caption"
                myColor={'primary'}
                fontWeight="500"
                id="price(s)"
              />
            </View>
          </div>

          {variants.map(
            (
              { id, code, options: variantOptions, label, quantity, prices },
              index,
            ) => (
              <div className={classes.row} key={id}>
                <View style={{ width: '35%', paddingRight: 16 }}>
                  <Text width={'auto'}>
                    {code + (label ? ' (' + label + ')' : '')}
                  </Text>
                </View>
                <View fD="row" jC="space-between" w="100%">
                  <Text style={{ flex: 1, paddingRight: 16 }}>{quantity}</Text>
                  {/* <Text variant="caption" myColor={'primary'} fontWeight="500">
                  {formatVariantsString(options)}
                </Text> */}
                  {options?.map(option => (
                    <Text style={{ flex: 1, paddingRight: 16 }}>
                      {variantOptions?.[option?.name]}
                    </Text>
                  ))}

                  <Text style={{ flex: 1 }}>{formatPricesString(prices)}</Text>
                </View>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}
