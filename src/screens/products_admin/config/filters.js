export const ProductFilterConfig = {
  type: {
    label: 'Type',
    type: 'select',
    options: [
      { value: 'virtual', label: 'virtual' },
      { value: 'physical', label: 'physical' },
    ],
  },
  category: {
    label: 'category',
    type: 'category',
    options: { levels: 3 },
  },
  countries: {
    label: 'country',
    type: 'country',
  },
};
