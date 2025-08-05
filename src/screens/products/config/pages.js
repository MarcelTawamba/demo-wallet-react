const exportConfigs = {
  '': {
    title: 'products',
    variant: 'list',
    filterConfig: {
      type: {
        variant: 'select',
        options: ['customer', 'manager'],
      },
      // category: { //TODO: move to 'side' config
      //   variant: 'categories',
      // },
      country: {
        variant: 'country',
      },
    },
    emptyListMessage: 'No products available',
    initialFilters: { page_size: { value: 15 } },
    // formConfig,
    // detailConfig,
    component: {
      variant: 'list',
      defaultLayout: 'table',
      config: {
        columns: [
          { label: 'name', value: 'name' },
          {
            label: 'description',
            value: 'description',
          },
          {
            label: 'quantity',
            value: 'quantity',
          },
          // { label: 'status', value: 'status', variant: 'status' },
          // // { label: 'customer, value: 'email' },
          // {
          //   label: 'due',
          //   value: 'due_date',
          //   variant: 'date',
          // },
          {
            label: 'created',
            value: 'created',
            variant: 'date',
            width: 100,
          },
        ],
        title: 'Add product',
        detailComponent: 'productDetail',
        add: 'New',
        export: true,
        edit: true,
        delete: true,
        // renderDetail: tableProps => <InvoiceDetail {...tableProps} />,
        // actions: {
        //   '': ['new'],
        //   add: ['preview', 'sendInvoice'],
        //   edit: ['preview', 'sendInvoice'],
        // },
      },
    },
  },
  vouchers: {
    title: 'vouchers',
    variant: 'list',
    // filterConfig: {
    //   type: {
    //     type: 'select',
    //     options: ['customer', 'manager'],
    //   },
    //   category: {
    //     type: 'productCategories',
    //   },
    //   country: {
    //     type: 'country',
    //   },
    // },
    emptyListMessage: 'No products available',
    initialFilters: { page_size: { value: 15 } },
    // formConfig,
    // detailConfig,
    component: {
      variant: 'list',
      defaultLayout: 'table',
      config: {
        columns: [
          { label: 'name', value: 'name' },
          {
            label: 'description',
            value: 'description',
          },
          {
            label: 'quantity',
            value: 'quantity',
          },
          // { label: 'status', value: 'status', variant: 'status' },
          // // { label: 'customer, value: 'email' },
          // {
          //   label: 'due',
          //   value: 'due_date',
          //   variant: 'date',
          // },
          {
            label: 'created',
            value: 'created',
            variant: 'date',
            width: 100,
          },
        ],
        title: 'Add product',
        detailComponent: 'productDetail',
        add: 'New',
        export: true,
        edit: true,
        delete: true,
        // renderDetail: tableProps => <InvoiceDetail {...tableProps} />,
        // actions: {
        //   '': ['new'],
        //   add: ['preview', 'sendInvoice'],
        //   edit: ['preview', 'sendInvoice'],
        // },
      },
    },
  },
  orders: {
    title: 'orders',
    variant: 'list',
    // filterConfig: {
    //   type: {
    //     type: 'select',
    //     options: ['customer', 'manager'],
    //   },
    //   category: {
    //     type: 'productCategories',
    //   },
    //   country: {
    //     type: 'country',
    //   },
    // },
    emptyListMessage: 'No products available',
    initialFilters: { page_size: { value: 15 } },
    // formConfig,
    // detailConfig,
    component: {
      variant: 'list',
      defaultLayout: 'table',
      config: {
        columns: [
          { label: 'name', value: 'name' },
          {
            label: 'description',
            value: 'description',
          },
          {
            label: 'quantity',
            value: 'quantity',
          },
          // { label: 'status', value: 'status', variant: 'status' },
          // // { label: 'customer, value: 'email' },
          // {
          //   label: 'due',
          //   value: 'due_date',
          //   variant: 'date',
          // },
          {
            label: 'created',
            value: 'created',
            variant: 'date',
            width: 100,
          },
        ],
        title: 'Add product',
        detailComponent: 'productDetail',
        add: 'New',
        export: true,
        edit: true,
        delete: true,
        // renderDetail: tableProps => <InvoiceDetail {...tableProps} />,
        // actions: {
        //   '': ['new'],
        //   add: ['preview', 'sendInvoice'],
        //   edit: ['preview', 'sendInvoice'],
        // },
      },
    },
  },
};

export default exportConfigs;
