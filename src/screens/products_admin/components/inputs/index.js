import React from 'react';

import Input from 'components/inputs';
// import * as inputs from '../../config/inputs';

import SupplierAccount from './SupplierAccount';
import Images from './Images';
import ParentCategory from './ParentCategory';
import Product from './Product';
import VoucherCodes from './VoucherCodes';
import Products from './Products';
import User from './User';

import Prices from './Prices';
import ProductVariants from './ProductVariants';
import ProductOptions from './ProductOptions';
import Categories from './Categories';

let inputs = {
  product_name: {
    label: 'product_name',
    name: 'name',
    validation: { required: true },
  },
  product_description: {
    label: 'product_description',
    name: 'description',
    multiline: true,
    rows: 7,
    helper: 'max_255_characters',
    edit: true,
    validation: { maxLength: 255, required: true },
  },
  description: {
    label: 'description',
    name: 'description',
    multiline: true,
    rows: 7,
    helper: 'max_255_characters',
    edit: true,
    validation: { maxLength: 255, required: true },
  },
  short_description: {
    label: 'short_description',
    name: 'short_description',
    edit: true,
    validation: { required: true },
  },
  countries: {
    label: 'countries',
    name: 'countries',
    type: 'country',
    edit: true,
  },
  supplier_account: {
    label: 'supplier_account',
    name: 'account',
    type: 'supplier_account',
  },
  bar_code: { label: 'bar_code', name: 'bar_code', edit: true },

  product_type: {
    label: '',
    name: 'type',
    edit: true,
    type: 'select',
    options: ['physical', 'virtual'],
    variant: 'simple',
  },
  categories: {
    label: 'categories',
    name: 'categories',
    edit: true,
    type: 'categories',
  },
  variants: { type: 'variants', name: 'variants' },
  options: { type: 'options', name: 'options' },
  images: { label: 'images', name: 'images', type: 'images' },
  // prices: { label: 'prices', name: 'prices', variant: 'prices', edit: true },
  enabled: {
    label: 'enabled',
    name: 'enabled',
    type: 'boolean',
    edit: true,
    info:
      'An enabled product will be visible to users in the list of products and allow them to purchase it.',
  },
  instant_buy: {
    label: 'instant_buy',
    name: 'instant_buy',
    type: 'boolean',
    edit: true,
  },
  requires_billing_address: {
    label: 'requires_billing_address',
    name: 'requires_billing_address',
    type: 'boolean',
    edit: true,
  },
  requires_shipping_address: {
    label: 'requires_shipping_address',
    name: 'requires_shipping_address',
    type: 'boolean',
    edit: true,
  },
  requires_contact_mobile: {
    label: 'requires_contact_mobile',
    name: 'requires_contact_mobile',
    type: 'boolean',
    edit: true,
  },
  requires_contact_email: {
    label: 'requires_contact_email',
    name: 'requires_contact_email',
    type: 'boolean',
    edit: true,
  },
  metadata: { label: 'metadata', name: 'metadata', type: 'json', edit: true },

  category_name: {
    label: 'category_name',
    name: 'name',
  },
  is_parent_category: {
    label: 'parent_category',
    name: 'is_parent_category',
    type: 'boolean',
  },
  parent_category: { name: 'parent_category', type: 'parent_category' },
  product: { name: 'product', type: 'product' },
  voucher_codes: { name: 'voucher_codes', type: 'voucher_codes' },
  user: { name: 'user', type: 'user' },
  currency: {
    name: 'currency',
    label: 'currency',
    type: 'select',
    options: ['USD', 'ZAR', 'XBT'],
  },
  products: { name: 'products', type: 'products' },
  pricing_type: {
    name: 'pricing_type',
    label: 'quantity_and_pricing_type',
    type: 'select',
    options: ['simple', 'variants'],
  },
  tracked: {
    name: 'tracked',
    label: 'product_quantity_tracked',
    type: 'boolean',
  },
  quantity: {
    name: 'quantity',
    label: 'quantity',
    type: 'number',
  },
  sku: {
    name: 'barcode',
    label: 'sku_barcode',
  },
  prices: { type: 'prices' },
};

export default function Inputs(props) {
  const { variant, type, ...restProps } = props;
  const config = inputs[variant?.name ?? variant];

  switch (config?.type) {
    case 'supplier_account':
      return <SupplierAccount {...props} />;
    case 'variants':
      return <ProductVariants {...props} />;
    case 'options':
      return <ProductOptions {...props} />;
    case 'images':
      return <Images {...props} />;
    case 'parent_category':
      return <ParentCategory {...props} />;
    case 'categories':
      return <Categories {...props} />;
    case 'product':
      return <Product {...props} />;
    case 'voucher_codes':
      return <VoucherCodes {...props} />;
    case 'products':
      return <Products {...props} />;
    case 'user':
      return <User {...props} />;
    case 'prices':
      return <Prices {...props} />;
    default:
      return <Input {...restProps} config={config} />;
  }
}
