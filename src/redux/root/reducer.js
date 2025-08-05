import { combineReducers } from 'redux';

import rehive from '../rehive/reducer';
import crypto from '../crypto/reducer';
import auth from '../auth/reducer';

import accounts from 'screens/accounts/redux/reducer';
import products from 'screens/products/redux/reducer';
import rewards from 'screens/rewards/redux/reducer';

export default combineReducers({
  rehive,
  crypto,
  auth,
  accounts,
  products,
  rewards,
});
