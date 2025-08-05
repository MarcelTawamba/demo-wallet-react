const exportConfigs = {
  Cart: {
    // description: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      children: {
        type: 'string',
        description: 'Error text to be displayed',
      },
    },
    children: {
      CartItem: {
        tags: ['web', 'mobile'],
        props: {
          children: {
            type: 'string',
            description: 'Error text to be displayed',
          },
        },
      },
      QuantityInput: {
        tags: ['web', 'mobile'],
        props: {
          children: {
            type: 'string',
            description: 'Error text to be displayed',
          },
        },
      },
    },
  },
  Error: {
    tags: ['web', 'mobile'],
    props: {
      children: {
        type: 'string',
        description: 'Error text to be displayed',
      },
    },
  },
  Checkout: {
    // description: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      children: {
        type: 'string',
        description: 'Error text to be displayed',
      },
    },
    children: {
      CheckoutPage: {
        tags: ['web', 'mobile'],
        props: {
          children: {
            type: 'string',
            description: 'Error text to be displayed',
          },
        },
      },
      CheckoutRequired: {
        tags: ['web', 'mobile'],
        props: {
          children: {
            type: 'string',
            description: 'Error text to be displayed',
          },
        },
      },
      // MerchantCheckout: {
      //   tags: ['web', 'mobile'],
      //   props: {
      //     children: {
      //       type: 'string',
      //       description: 'Error text to be displayed',
      //     },
      //   },
      // },
    },
  },
};

export default exportConfigs;
