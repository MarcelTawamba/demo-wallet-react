const configs = {
  CustomerSearch: {
    id: 'customerSearch',
    description: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      businessId: {
        type: 'string',
        description: 'Error text to be displayed',
      },
    },
  },
  PaymentMethods: {
    id: 'paymentMethods',
    tags: ['web', 'mobile'],
    props: {
      children: {
        type: 'string',
        description: 'Error text to be displayed',
      },
    },
  },
  ProductItemList: {
    id: 'productList',
    // description: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      business: {
        type: 'object',
        description: 'Business object containing business currency / settings',
      },
    },
  },
};

export default configs;
