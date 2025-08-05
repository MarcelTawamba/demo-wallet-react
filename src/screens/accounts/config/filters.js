export const TransactionFilterConfig = ({ subtypes }) => {
  return {
    // subtype: {
    //   label: 'subtype',
    //   variant: 'select',
    //   options: subtypes ?? [
    //     { value: 'send', label: 'Send' },
    //     { value: 'receive', label: 'Receive' },
    //     { value: 'purchase', label: 'Purchase' },
    //     { value: 'sale', label: 'Sale' },
    //     { value: 'reward', label: 'Reward' },
    //   ],
    // },
    tx_type: {
      label: 'subtype',
      variant: 'select',
      options: [
        { value: 'credit', label: 'Money in' },
        { value: 'debit', label: 'Money out' },
      ],
    },
    status: {
      label: 'status',
      variant: 'select',
      options: [
        { value: 'Pending', label: 'Pending' },
        { value: 'Complete', label: 'Complete' },
        { value: 'Failed', label: 'Failed' },
      ],
    },
    date: {
      label: 'date',
      variant: 'date',
      options: [
        // { value: 'last', label: 'Is in the last' },
        { value: 'equal', label: 'Is on the' },
        { value: 'between', label: 'Is between' },
        { value: 'less', label: 'Is before' },
        { value: 'more', label: 'Is after' },
      ],
    },
    amount: {
      label: 'amount',
      variant: 'number',
      options: [
        { value: 'equal', label: 'Is equal to' },
        { value: 'between', label: 'Is between' },
        { value: 'less', label: 'Is less than' },
        { value: 'more', label: 'Is more than' },
      ],
    },
  };
};
