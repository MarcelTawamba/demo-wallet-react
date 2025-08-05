export const ProductFilterConfig = {
  type: {
    label: 'Type',
    variant: 'select',
    options: [
      { value: 'virtual', label: 'virtual' },
      { value: 'physical', label: 'physical' },
    ],
  },
  // category: {
  //   label: 'category',
  //   variant: 'category',
  //   options: { levels: 3 },
  // },
  countries: {
    label: 'country',
    variant: 'country',
  },
};
