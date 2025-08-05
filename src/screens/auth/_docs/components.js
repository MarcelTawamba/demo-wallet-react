import inputs from './inputs';

const configs = {
  Inputs: {
    // description: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      variant: {
        type: 'string',
        description: 'Input variant',
      },
    },
    variants: inputs,
  },
  InvoiceDetailHeader: {
    tags: ['web', 'mobile'],
    props: {
      item: {
        type: 'object',
        description: 'Invoice object',
      },
    },
  },
};

export default configs;
