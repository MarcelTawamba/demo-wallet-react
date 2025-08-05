import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Text from 'components/outputs/Text';
import IconButton from 'components/inputs/IconButton';
import EmptyListMessage from 'components/lists/EmptyListMessage';
import {
  calculateInvoiceTotal,
  displayFormatDivisibility,
  getCurrencyCode,
} from 'util/general';
import { useFieldArray, Controller, useFormContext } from 'react-hook-form';
import Input from 'components/inputs';
import Spinner from 'components/outputs/Spinner';
import { getProducts } from 'util/rehive';
import { Box, TextField } from '@material-ui/core';
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import { formatPriceString } from 'screens/products/util/products';
import { View } from 'components/layout/View';

const filter = createFilterOptions();

const useStyles = makeStyles(theme => ({
  addRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: theme.spacing(2),
  },
  header: {
    width: '100%',
    display: 'flex',
    paddingRight: theme.spacing(4),
    flexDirection: 'row',
    paddingTop: theme.spacing(1),
  },
  headerColumn: {
    display: 'flex',
    flexDirection: 'row',
    width: '50%',
  },
  arrayRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  arrayContainer: { paddingInlineStart: 0 },
  quantityInput: {
    width: '100%',
    maxWidth: 90,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  remove: {
    paddingLeft: theme.spacing(1),
    paddingTop: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  price: {
    minWidth: 180,
    maxWidth: 180,
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    whiteSpace: 'pre',
  },
  totals: {
    width: '100%',
  },
  invoiceTotalRow: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    padding: theme.spacing(1),
  },
}));

const DEFAULT_PRODUCT = { name: '', quantity: '1', price: '' };

export default function ProductItemListInput(props) {
  const { control, context, register, item, ...restProps } = props;
  const { business } = context;
  const classes = useStyles();
  const methods = useFormContext(); // Get methods from context
  const arrayHelpers = useFieldArray({
    control: methods.control, // Use control from methods instead of prop
    name: 'products',
    rules: {
      required: true,
      validate: item => {
        return item?.[0]?.price;
      },
    },
  });

  const [showSearchProduct, setShowSearchProduct] = useState(false);
  const [passedValue, setPassedValue] = useState(false);

  if (!business) return <Spinner />;
  const { currency } = business;
  const { getValues } = methods; // Use methods from useFormContext instead of control
  const { products = [] } = getValues();
  const defaultValues =
    props?.defaultValues?.metadata?.service_business?.items ?? [];

  const { fields, append } = arrayHelpers;
  const total = calculateInvoiceTotal(products, currency?.divisibility);
  const totalFormatted = displayFormatDivisibility(
    total,
    currency?.divisibility,
  );

  return (
    <>
      <div>
        {fields && fields.length > 0 ? (
          <ul className={classes.arrayContainer}>
            <ProductItemHeader />
            {fields.map((item, index) => (
              <ProductItemRow
                passedValue={passedValue}
                key={item.id}
                index={index}
                item={item}
                arrayHelpers={arrayHelpers}
                defaultValue={defaultValues?.[index]}
                {...props}
              />
            ))}
          </ul>
        ) : (
          !showSearchProduct && (
            <EmptyListMessage id="no_items_added_to_invoice" />
          )
        )}

        <View jC={'space-between'} aI={'center'} fD={'row'} mb={1.5}>
          <View w={'100%'}>
            {showSearchProduct && (
              <SearchProduct
                append={append}
                setShowSearchProduct={setShowSearchProduct}
                setPassedValue={setPassedValue}
                currency={currency}
              />
            )}
          </View>

          <View>
            <IconButton
              noPadding
              inverted={false}
              noMi
              icon="plus"
              onClick={() => setShowSearchProduct(true)}
            />
          </View>
        </View>
      </div>

      <div className={classes.invoiceTotalRow}>
        <Text
          bold
          align="right"
          className={classes.totals}
          id="total"
          uppercase
        />
        <div className={classes.price}>
          <Text bold align="right">
            {totalFormatted}
          </Text>
          <Text opacity={0.67} align="right" width="auto">
            {' ' + getCurrencyCode(currency)}
          </Text>
        </div>
      </div>
    </>
  );
}

function SearchProduct(props) {
  const { append, setShowSearchProduct, setPassedValue, currency } = props;
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [value, setValue] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(0);

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (searchTerm) {
      const timeout = setTimeout(() => {
        fetchProducts();
      }, 500);
      setTypingTimeout(timeout);
    }
  }, [searchTerm]);

  async function fetchProducts() {
    try {
      const response = await getProducts(
        `?currency=${currency?.code}&name__contains=${searchTerm}`,
        true,
      );
      setProducts(response?.results);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  const calculatedPrice = product => {
    const selectedProduct = product?.prices?.find(
      item => item?.currency?.code === currency?.code,
    );
    const productPrice = displayFormatDivisibility(
      selectedProduct?.amount,
      currency?.divisibility,
    );
    return productPrice;
  };

  return (
    <div className={classes.headerColumn}>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            setValue({
              name: newValue,
            });
            // Create a product with the string as the name
            const newProduct = {
              name: newValue,
              quantity: '1',
              price: '',
            };
            append(newProduct);
          } else if (newValue && newValue.inputValue) {
            setValue({
              name: newValue.inputValue,
            });
            // Create a product with the input value as the name
            const newProduct = {
              name: newValue.inputValue,
              quantity: '1',
              price: '',
            };
            append(newProduct);
            setPassedValue({
              name: newValue.inputValue,
              quantity: '1',
              price: '',
              isCustomProduct: true,
            });
          } else {
            setValue(newValue);
            append(DEFAULT_PRODUCT);
            setPassedValue({
              name: newValue?.name,
              quantity: '1',
              price: calculatedPrice(newValue),
              isCustomProduct: false,
            });
          }
          setShowSearchProduct(false);
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              name: `Add "${params.inputValue}"`,
            });
          }
          return filtered;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="product"
        options={products}
        getOptionLabel={option => {
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.name;
        }}
        renderOption={option => option.name}
        style={{ width: 400 }}
        freeSolo
        renderInput={params => (
          <TextField
            {...params}
            label=""
            placeholder="Search product ..."
            variant="outlined"
            onChange={e => setSearchTerm(e.target.value)}
          />
        )}
      />
    </div>
  );
}
function ProductItemRow(props) {
  const {
    index,
    item,
    arrayHelpers,
    defaultValue = {},
    passedValue = {},
  } = props;
  const { name, price, quantity, isCustomProduct } = passedValue ?? {};
  const methods = useFormContext(); // Get methods from context
  const classes = useStyles();
  return (
    <li key={index} className={classes.arrayRow}>
      <div className={classes.headerColumn}>
        <Input
          name={`products[${index}].name`}
          config={{
            name: `products[${index}].name`,
            label: '',
            placeholder: 'product_name',
          }}
          disabled={!isCustomProduct}
          form={methods}
          defaultValue={name}
        />
      </div>
      <div className={classes.headerColumn}>
        <div className={classes.quantityInput}>
          <Input
            name={`products[${index}].quantity`}
            config={{
              name: `products[${index}].quantity`,
              label: '',
              placeholder: '1',
              type: 'number',
            }}
            form={methods}
            defaultValue={quantity ?? '1'}
          />
        </div>
        <Input
          name={`products[${index}].price`}
          config={{
            name: `products[${index}].price`,
            label: '',
            placeholder: 'price',
            type: 'number',
            step: '0.01',
          }}
          form={methods}
          disabled={!isCustomProduct}
          defaultValue={price ?? ''}
        />
      </div>

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

function ProductItemHeader(props) {
  const classes = useStyles();
  const textProps = { color: 'primary', variant: 'body2' };
  return (
    <div className={classes.header}>
      <div className={classes.headerColumn}>
        <Text {...textProps} id="product" />
      </div>
      <div className={classes.headerColumn}>
        <div className={classes.quantityInput}>
          <Text {...textProps} id="qty" />
        </div>
        <Text {...textProps} id="price" />
      </div>
    </div>
  );
}
