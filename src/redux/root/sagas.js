import { all } from 'redux-saga/effects';

import rehive from '../rehive/sagas';
import crypto from '../crypto/sagas';
import auth from '../auth/sagas';

import profile from 'screens/profile/redux/sagas';
import rewards from 'screens/rewards/redux/sagas';
import products from 'screens/products/redux/sagas';

const sagas = [rehive, crypto, auth, profile, rewards, products]; // [, ];

export default function* rootSagas() {
  try {
    yield all(sagas);
  } catch (error) {
    console.log(error);
  }
}
