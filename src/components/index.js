// import app from './app/';
// import content from './content/';
// import filter from './filter/';
// import inputs from './inputs/';
// import layout from './layout';
// import menu from './menu/';
import outputs from './outputs/';
// import rehive from './rehive/';
import Inputs from 'screens/invoices/components/inputs';
import invoices from 'screens/invoices/components';

const components = {
  // app,
  // content,
  // filter,
  // Inputs,
  // layout,
  // menu,
  ...outputs,
  // rehive,
  // products,
  invoices,
  Inputs,
};

export default components;
