const exportConfigs = {
  error: {
    title: 'Error output',
    tags: ['web', 'mobile'],
    props: {
      children: {
        type: 'string',
        description: 'Error text to be displayed',
      },
      dummy1: {
        type: 'string',
        description: 'Dummy 1',
      },
      dummy2: {
        type: 'string',
        description: 'Dummy 2',
      },
    },
  },
};

export default exportConfigs;
