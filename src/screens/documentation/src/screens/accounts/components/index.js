const exportConfigs = {
  Error: {
    description: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      children: {
        type: 'string',
        description: 'Error text to be displayed',
      },
    },
  },
};

export default exportConfigs;
