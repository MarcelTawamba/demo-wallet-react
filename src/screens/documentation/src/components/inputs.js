// import config from './config'
// import components from './components'
// import pages from './pages'
// import util from './util'

const exportConfigs = {
  title: 'Inputs',
  subtitle: 'The different input variants available in the Rehive Apps',
  description: `This section describes each input's props, features and design as well as describing how they work with Formik and the rehive Form component`,
  features: {
    formik: {
      title: 'Formik',
      type: '',
      description: 'Form state and validation is handled by Formik',
    },
  },
  sharedProps: {
    // name: {
    //   title: 'Name',
    //   type: 'string',
    //   defaultValue: '',
    //   description: `Identifying name of the input`,
    // },
    label: {
      title: 'Label',
      type: 'string',
      defaultValue: '',
      description: `Input label`,
    },
    value: {
      title: 'Value',
      type: 'string',
      defaultValue: '',
      description: `Input value`,
    },
    placeholder: {
      title: 'Placeholder',
      type: 'string',
      defaultValue: '',
      description: `Message displayed when empty`,
    },
    error: {
      title: 'Error',
      type: 'string',
      defaultValue: '',
      description: `Error message linked to input`,
    },
    helper: {
      title: 'Helper',
      type: 'string',
      defaultValue: '',
      description: `Helper message`,
    },
    formikBag: {
      title: 'Formik bag',
      type: 'object',
      defaultValue: '',
      description: `Acc`,
    },
  },
  // pages,
  components: {
    button: {
      title: 'Button',
      subtitle: 'For ',
      description: `For enterring basic text`,
      features: { list: { title: '' } },
      props: null,
      tags: ['web', 'mobile'],
    },
    image: {
      title: 'ImageUpload',
      subtitle: 'Uploading new images',
      description: ``,
      features: { list: { title: '' } },
      props: {
        variant: {
          title: 'variant',
          description: '- docked (default) - modal',
        },
      },
      tags: ['web', 'mobile'],
    },
    textfield: {
      title: 'TextField',
      subtitle: 'The most basic text input',
      description: `For enterring basic text`,
      features: null,
      props: null,
      tags: ['web', 'mobile', 'formik'],
    },
    checkbox: {
      title: 'Checkbox',
      subtitle: 'Allows the toggling of a value',
      description: `For basic boolean choices`,
      features: null,
      props: {
        variant: {
          title: 'Variant',
          type: 'enum',
          description: `Different layout variants:\n
          - simple (default)\n
          - terms - with links`,
        },
      },
      tags: ['web', 'mobile', 'formik'],
    },
    checkboxMulti: {
      title: 'Checkbox multi list',
      subtitle: 'Allows the toggling of a value',
      description: `For basic boolean choices`,
      features: null,
      props: {
        variant: {
          title: 'Variant',
          type: 'enum',
          description: `Different layout variants:\n
          - simple (default)\n
          - terms - with links`,
        },
      },
    },
    switch: {
      title: 'Switch',
      subtitle: 'For simple, single option choice',
      description: `For enterring basic text`,
      features: null,
      props: null,
      tags: ['web', 'mobile', 'formik'],
    },
    selector: {
      title: 'Selector',
      subtitle: 'For advanced choice',
      description: `For enterring basic text`,
      features: {
        customComponents: {
          title:
            'Has the ability to render custom components instead of the default selector',
        },
      },

      props: {
        data: {
          title: 'data',
          description:
            'List of values to be searched from. (TODO: improve to handle sections and lists)',
        },
        variant: {
          title: 'variant',
          description: `Different ways of presenting a selector:
          - dropdown (default)
          - modal (full screen modal)
          - docked (modal from the bottom of screen)
          `,
        },
        search: {
          title: 'search',
          type: 'function',
          default: 'null',
          description: `Function to filter out selector results
          - null (default - search disabled)
          - (item) => item.id
          `,
        },
        children: {
          title: 'children',
          type: 'component',
          default: 'null',
          description: `Allows the overriding of the normal selector text value render`,
        },
        listComponent: {
          title: 'listComponent',
          type: 'component',
          default: 'children',
          description: `Allows the overriding of the default list render`,
        },
        listItemComponent: {
          title: 'listItemComponent',
          type: 'component',
          default: 'children',
          description: `Allows the overriding of the normal selector text value list item render`,
        },
      },
      tags: ['web', 'mobile', 'formik'],
    },
    radioGroup: {
      title: 'Radio group / selector',
      subtitle: 'For choosing one options from a range selection',
      description: `For enterring basic text`,
      features: null,
      props: null,
      tags: ['web', 'mobile', 'formik'],
    },
  },
};

export default exportConfigs;
