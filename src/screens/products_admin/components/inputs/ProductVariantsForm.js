import React, { useState } from 'react';
import makeStyles from '@material-ui/styles/makeStyles';

import {
  createProductVariant,
  createProductVariantPrice,
  deleteProductVariantPrice,
  updateProductVariantPrice,
  updateProductVariant,
} from '../../util/rehive';
import Input from 'components/inputs';
import ButtonList from 'components/lists/ButtonList';
import Selector from 'components/inputs/SelectorRHF';
import PricesInput from './PricesInput';
import {
  mapOptions,
  formatDivisibility,
  arrayToObject,
  multiplyDivisibility,
} from 'util/general';
import { walletsSelector } from 'screens/accounts/redux/selectors';
import { useSelector } from 'react-redux';

import { useForm, FormProvider, Controller } from 'react-hook-form';
import Spinner from 'components/outputs/Spinner';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import Text from 'components/outputs/Text';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import inputs from '../../config/inputs';

const section = {
  id: 'product_tracked',
  variant: 'group',
  // title: ' Variant details',
  fields: [
    {
      id: 'code',
    },
    {
      id: 'label',
    },
    {
      id: 'tracked',
    },
    {
      id: 'quantity',
      condition: ({ tracked }) => tracked === true,
    },
  ],
};

export default function ProductVariantsForm(props) {
  const {
    productId,
    item,
    setEditing,
    options: productOptions,
    refreshItem,
    optionsLoading,
    context,
    fetchProductsVariations,
  } = props;
  const sellerId = context?.sellers?.[0]?.id ?? '';
  const classes = useStyles(props);
  const [loading, setLoading] = useState(false);
  const currencies = useSelector(walletsSelector);
  const { companyCurrencies } = currencies;
  const currencyOptions = mapOptions(companyCurrencies, 'display_code', 'code');
  const currencyOptionsObj = arrayToObject(companyCurrencies, 'code');

  let defaultValues = {
    code: '',
    label: '',
    quantity: '',
    prices: [],
    tracked: false,
  };

  if (item) {
    let prices = [];
    async function addPrice(item) {
      const price = {
        currency: item?.currency?.code,
        amount: formatDivisibility(item?.amount, item?.currency?.divisibility),
      };
      prices.push(price);
    }
    item.prices.forEach(addPrice);

    defaultValues = {
      ...item,
      ...item?.options,
      prices,
      tracked: Boolean(item?.quantity),
    };
  }

  const inputPropsControl = useForm({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldUnregister: false,
  });

  const { control, register, watch, handleSubmit, formState } =
    inputPropsControl;

  const onSubmit = async (formData) => {
    console.log('Form submitted with data:', formData);
    console.log('Form state errors:', formState.errors);
    setLoading(true);
    try {
      let { code, label, quantity, prices, tracked } = formData;

      delete formData.code;
      delete formData.label;
      delete formData.quantity;
      delete formData.tracked;
      let options = {};
      productOptions.forEach(item => {
        options[item.name] = formData[item.name];
      });
      const data = {
        code,
        quantity: quantity ? quantity : 0,
        tracked: Boolean(tracked),
        options,
        label,
      };
      let resp = null;
      if (!item) {
        resp = await createProductVariant(sellerId, productId, data);
      } else {
        resp = await updateProductVariant(sellerId, productId, item?.id, data);
      }
      const variantId = item?.id ?? resp?.data?.id;
      if (item || resp?.status === 'success') {
        let { status = 'success' } = resp;

        // prices
        const oldPrices = resp?.data?.prices;
        if (prices?.length || oldPrices.length) {
          const newPrices = prices;
          const newPricesObj = arrayToObject(newPrices, 'currency');
          const oldPricesObj = arrayToObject(oldPrices, 'currency.code');

          const companyCurrencies =
            context?.currencies?.companyCurrencies ?? {};
          const currencyOptionsObj = arrayToObject(companyCurrencies, 'code');
          for (let i = 0; i < companyCurrencies.length; i++) {
            const currency = context?.currencies?.companyCurrencies?.[i];
            const oldPrice = oldPricesObj?.[currency?.code];
            const newPrice = newPricesObj?.[currency?.code];

            if (newPrice) {
              const data2 = {
                currency: newPrice?.currency,
                amount: multiplyDivisibility(
                  newPrice?.amount,
                  currencyOptionsObj?.[newPrice?.currency]?.divisibility,
                ),
              };
              if (!oldPrice && newPrice) {
                const respPrice = await createProductVariantPrice(
                  sellerId,
                  productId,
                  variantId,
                  data2,
                );
                if (respPrice.status === 'error') {
                  status = 'error_adding_price';
                }
              } else {
                if (oldPrice?.amount !== data2?.amount) {
                  const respPrice = await updateProductVariantPrice(
                    sellerId,
                    productId,
                    variantId,
                    oldPrice?.id,
                    data2,
                  );
                  if (respPrice.status === 'error') {
                    status = 'error_updating_price';
                  }
                }
              }
            } else if (oldPrice) {
              const respPrice = await deleteProductVariantPrice(
                sellerId,
                productId,
                variantId,
                oldPrice?.id,
              );
              if (respPrice.status === 'error') {
                status = 'error_deleting_price';
              }
            }
          }
        }

        if (status === 'success') {
          setEditing(null);
        }
        fetchProductsVariations();
        refreshItem();
      }
    } catch (e) {
      console.log('handleAddVariant -> e', e);
    }
    setLoading(false);
  };

  const values = watch();

  return (
    <div className={classes.container}>
      <FormProvider {...inputPropsControl}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '500',
              paddingTop: 8,
              color: '#222',
            }}
            id="options"
          />
          <div className={classes.options}>
            {optionsLoading ? (
              <Spinner />
            ) : productOptions?.length ? (
              productOptions.map(item => (
                <Selector
                  control={control}
                  key={item.name}
                  name={item.name}
                  label={item.name}
                  options={mapOptions(item.values)}
                  defaultValue={item.values?.[0]}
                />
              ))
            ) : (
              <EmptyListMessage id="no_available_options" />
            )}
          </div>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '500',
              paddingTop: 8,
              color: '#222',
            }}
            id="variant_details"
          />
          
          <div className={classes.formFields}>
            <Input
              {...register('code')}
              config={{
                name: 'code',
                label: 'variant_code',
                props: { autoFocus: true },
              }}
            />
            
            <Input
              {...register('label')}
              config={{
                name: 'label',
                label: 'variant_label',
              }}
            />
            
            <FormControlLabel
              control={
                <Controller
                  name="tracked"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      color="primary"
                    />
                  )}
                />
              }
              label={<Text id="product_quantity_tracked" />}
            />
            
            <Input
              {...register('quantity')}
              config={{
                name: 'quantity',
                label: 'quantity',
                type: 'number',
              }}
              disabled={!values.tracked}
            />
          </div>
          
          <PricesInput
            register={register}
            control={control}
            currencyOptions={currencyOptions}
            defaultValues={defaultValues?.prices ?? []}
          />

          <ButtonList
            layout="vertical"
            noPadding
            items={[
              {
                id: 'save',
                capitalize: true,
                type: 'submit',
                loading,
              },
              {
                id: 'cancel',
                variant: 'text',
                onPress: () => setEditing(null),
              },
            ]}
          />
        </form>
      </FormProvider>
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  options: {
    width: '100%',
    margin: 0,
    padding: 0,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  container: {
    width: '100%',
    // overflowY: 'scroll',
  },
  formFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));
