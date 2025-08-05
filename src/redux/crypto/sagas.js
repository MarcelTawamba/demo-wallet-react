import { all, call, put, takeEvery, select } from 'redux-saga/effects';

import { FETCH_CRYPTO_ASYNC } from './actions';

import { currentCompanySelector } from '../auth/selectors';
import {
  getCryptoUser,
  getStellarAssets,
  getStellarCompany,
  getBitcoinCompany,
} from 'util/rehive';
import { AUTH_SUCCESS } from '../auth/actions';

function* fetchCrypto(action) {
  const { code } = action;
  const isTestNet = action.network === 'testnet';
  try {
    let assets = [];
    let company = null;
    let assetsDetails = [];

    let response = yield call(getCryptoUser, code);
    if (response.status === 'error' || response instanceof Error) {
      throw response;
    }
    const user = response.data ? response.data : response;

    if (action.blockchain === 'stellar') {
      response = yield call(getStellarAssets, isTestNet);
      if (response.status === 'success') {
        assets = response.data ? response.data.map(a => a.currency_code) : [];
        assetsDetails = response.data ? response.data : [];
      }
      response = yield call(getStellarCompany, isTestNet);
      if (response.status === 'success') {
        company = response.data;
      }
    } else if (action.blockchain === 'bitcoin') {
      response = yield call(getBitcoinCompany, isTestNet);
      if (response.status === 'success') {
        company = response.data;
      }
    }

    yield put({
      type: FETCH_CRYPTO_ASYNC.success,
      payload: {
        user,
        assets,
        company,
        assetsDetails,
        blockchain: action.blockchain,
        network: action.network,
      },
    });
  } catch (error) {
    console.log(code, error.message);
    yield put({
      type: FETCH_CRYPTO_ASYNC.error,
      payload: { code, error: error.message },
    });
  }
}

function* checkCryptoServices() {
  try {
    const { services } = yield select(currentCompanySelector);

    let temp = {};

    services.map(service => {
      temp[service.slug] = true;
      return { [service.slug]: true };
    });

    yield all([
      temp?.stellar_service
        ? put({
            type: FETCH_CRYPTO_ASYNC.pending,
            code: 'XLM',
            blockchain: 'stellar',
            network: 'mainnet',
          })
        : null,
      temp?.stellar_testnet_service
        ? put({
            type: FETCH_CRYPTO_ASYNC.pending,
            code: 'TXLM',
            blockchain: 'stellar',
            network: 'testnet',
          })
        : null,
      temp?.bitcoin_service
        ? put({
            type: FETCH_CRYPTO_ASYNC.pending,
            code: 'XBT',
            blockchain: 'bitcoin',
            network: 'mainnet',
          })
        : null,
      temp?.bitcoin_testnet_service
        ? put({
            type: FETCH_CRYPTO_ASYNC.pending,
            code: 'TXBT',
            blockchain: 'bitcoin',
            network: 'testnet',
          })
        : null,
      temp?.ethereum_service
        ? put({
            type: FETCH_CRYPTO_ASYNC.pending,
            code: 'ETH',
            blockchain: 'ethereum',
            network: 'mainnet',
          })
        : null,
      temp?.ethereum_testnet_service
        ? put({
            type: FETCH_CRYPTO_ASYNC.pending,
            code: 'TETH',
            blockchain: 'ethereum',
            network: 'testnet',
          })
        : null,
    ]);
  } catch (error) {
    console.log(error);
  }
}

export default all([
  takeEvery(FETCH_CRYPTO_ASYNC.pending, fetchCrypto),
  // takeEvery(CACHE_COMPANY, checkCryptoServices),
  takeEvery(AUTH_SUCCESS, checkCryptoServices),
]);
