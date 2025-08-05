
// import config from './config'
// import components from './components'
// import pages from './pages'
// import util from './util'

const exportConfigs = {
  title: 'Layout',
  subtitle: 'The various structural components used to lay out other components',
  description: ``,
  features: null,
  sharedProps: null,
  components:{
    carousel: {
      title: 'Carousel',
      subtitle: 'For ',
      description: `For enterring basic text`,
      features: {list: {title: ''}},
      props: null,
      tags: ['web', 'mobile']
    },
    pages: {
      title: 'Pages',
      subtitle: 'Uploading new images',
      description: `ConfirmPage, ResultPage, InputPage`,
      features: {list: {title: ''}},
      props: {variant:{title: 'variant', description: "- docked (default) - modal"}},
      tags: ['web', 'mobile']
    },
    modal: {
      title: 'Modal',
      subtitle: 'The most basic text input',
      description: `ModalContent, ModalTitle, ModalActions etc`,
      // features: {},
      props: null,
      tags: ['web', 'mobile', 'formik']
    },
    resourceList: {
      title: 'ResourceList',
      subtitle: 'Allows the toggling of a value',
      description: `PaginationListFooter`,
      features: null,
      props: {
        variant: {
          title: 'Variant',
          type: 'enum',
          description: `Different layout variants:\n
          - simple (default)\n
          - terms - with links`,
        }
      },
      tags: ['web', 'mobile', 'formik']
    },
    screens: {
      title: 'Screens',
      subtitle: 'Full screen information screens',
      description: `For basic boolean choices`,
      features: null,
      props: {
        image: {
          title: 'image',
          type: 'image',
          description: `Different types of images supported:
          - from placeholders:
          - from url`,
        }
      }
    },
    tabs: {
      title: 'radioGroup',
      subtitle: 'For choosing one options from a range selection',
      description: `For enterring basic text`,
      features: null,
      props: null,
      tags: ['web', 'mobile', 'formik']
    },
  },
}

export default exportConfigs;