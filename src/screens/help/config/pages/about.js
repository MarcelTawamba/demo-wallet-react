import AboutPage from 'screens/help/components/AboutPage';
import { standardizeString } from 'util/general';

const exportConfigs = {
  menuTitleId: 'about',
  titleId: 'about',
  title: props =>
    props?.context?.company?.name ??
    standardizeString(props?.context?.company?.id) ??
    'About',
  label: 'About',
  icon: 'information',
  image: props =>
    props?.context?.company?.icon ?? props?.context?.company?.logo,
  component: AboutPage,
};

export default exportConfigs;
