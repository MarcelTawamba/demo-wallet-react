import { types } from 'config/enums';

const exportConfigs = {
  formatVariantsString: {
    type: types.STRING,
    description: 'Takes variant array and formats to text string',
    children: {
      options: {
        type: types.ARRAY,
        description: 'Array of variants',
      },
    },
  },
};

export default exportConfigs;
