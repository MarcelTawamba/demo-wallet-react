import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import { get, uniq } from 'lodash';

import { FETCH_DATA_ASYNC } from './actions';

import * as Rehive from 'util/rehive';
import {
  currentCompanyServicesSelector,
  authUserSelector,
} from '../auth/selectors';
import { CACHE_COMPANY } from '../auth/actions';
import {
  displayCurrencySelector,
  accountsSelector,
} from 'screens/accounts/redux/selectors';

let fetchingInProgress = {};
// to prevent duplicate API calls
// using 'fetchingInProgress' to keep track which API call

function* fetchData(action) {
  try {
    let response = null;
    if (fetchingInProgress[action.payload]) {
      return;
    }
    fetchingInProgress[action.payload] = true;

    let profile = null;
    if (action.payload === 'tier' || action.payload === 'tiers') {
      profile = yield select(authUserSelector);
      if (!profile) {
        try {
          const profileResponse = yield call(Rehive.getProfile);
          profile = profileResponse?.data || profileResponse;
          yield put({
            type: FETCH_DATA_ASYNC.success,
            payload: { data: profile, prop: 'profile' },
          });
        } catch (error) {
          yield put({
            type: FETCH_DATA_ASYNC.error,
            payload: { prop: action.payload, message: 'Failed to fetch profile' },
          });
          fetchingInProgress[action.payload] = false;
          return;
        }
      }
    }

    switch (action.payload) {
      case 'accounts':
        const services = yield select(currentCompanyServicesSelector);
        if (services?.conversion_service) {
          yield put({
            type: FETCH_DATA_ASYNC.pending,
            payload: 'displayCurrency',
          });
        }
        yield put({
          type: FETCH_DATA_ASYNC.pending,
          payload: 'tier',
        });
        response = yield call(Rehive.getAccounts);
        break;
      case 'displayCurrency':
        yield put({
          type: FETCH_DATA_ASYNC.pending,
          payload: 'conversionRates',
        });
        yield put({
          type: FETCH_DATA_ASYNC.pending,
          payload: 'conversionPairs',
        });
        response = yield call(Rehive.getConversionSettings);
        const code = get(response, ['data', 'display_currency']);
        response = yield call(
          Rehive.getConversionCurrency,
          code ? code : 'USD',
        );
        response = get(response, ['data', 'results', 0]);
        break;
      case 'conversionRates':
        const displayCurrency = yield select(displayCurrencySelector);
        const accounts = yield select(accountsSelector);
        const currencies = uniq(
          accounts.items.map(account =>
            account.currencies.map(currency => {
              return 'USD:' + currency?.currency?.code;
            }),
          ),
        );

        let rates =
          (displayCurrency ? 'USD:' + displayCurrency.code + ',' : '') +
          currencies.join();
        response = yield call(Rehive.getConversionRates, rates);
        break;
      case 'conversionPairs':
        response = yield call(Rehive.getConversionPairs);
        break;
      case 'tier':
        const tier = get(profile, ['groups', 0, 'name'], '');
        response = yield call(Rehive.getTier, tier);
        break;
      case 'tiers':
        const userGroup = get(profile, ['groups', 0, 'name'], '');
        if (!userGroup) {
          yield put({
            type: FETCH_DATA_ASYNC.error,
            payload: { prop: action.payload, message: 'No user group found in profile' },
          });
          break;
        }

        try {
          response = yield call(Rehive.getTiers, userGroup);
          if (response?.status === 'success' && response?.data?.results) {
            let data = response.data.results;
            yield put({
              type: FETCH_DATA_ASYNC.success,
              payload: { data, prop: action.payload },
            });
          } else {
            yield put({
              type: FETCH_DATA_ASYNC.error,
              payload: { 
                prop: action.payload, 
                message: response?.message || 'Failed to fetch tiers'
              },
            });
          }
        } catch (error) {
          yield put({
            type: FETCH_DATA_ASYNC.error,
            payload: { prop: action.payload, message: error?.message || 'Error fetching tiers' },
          });
        }
        break;
      case 'products':
        response = yield call(Rehive.getProducts);
        break;
      // case 'orders':
      //   response = yield call(Rehive.getOrders);
      //   break;
      case 'campaigns':
        response = yield call(Rehive.getCampaigns);
        break;
      case 'rewards':
        response = yield call(Rehive.getRewards);
        break;
      case 'mobiles':
        response = yield call(Rehive.getMobiles);
        break;
      case 'emails':
        response = yield call(Rehive.getEmails);
        break;
      case 'cryptoAccounts':
        response = yield call(Rehive.getCryptoAccounts);
        break;
      case 'bankAccounts':
        response = yield call(Rehive.getBankAccounts);
        break;
      case 'profile':
        response = yield call(Rehive.getProfile);
        break;
      case 'referralCodes':
        response = [yield call(Rehive.getReferralCode)];
        response = Array.isArray(response) ? response[0] : {};
        break;
      case 'addresses':
        response = yield call(Rehive.getAddresses);
        break;
      case 'documents':
        response = yield call(Rehive.getDocuments);
        break;
      case 'devices':
        response = yield call(Rehive.getDevices);
        break;
      case 'company':
        response = yield call(Rehive.getCompany);
        const response2 = yield call(
          Rehive.getCompanyAppConfig,
          response?.id,
          false,
        );
        yield put({
          type: CACHE_COMPANY,
          payload: { ...response, ...(response2?.data ?? {}) },
        });
        break;
      case 'companyBankAccounts':
        response = yield call(Rehive.getCompanyBankAccounts);
        break;
      case 'companyCurrencies':
        response = yield call(Rehive.getCompanyCurrencies);
        break;
      case 'wallet':
        return;
      default:
        return;
    }

    let data = response;
    
    if (action.payload === ('email' || 'mobile') && data && data.length > 0) {
      const primaryIndex = data.findIndex(item => item.primary === true);
      const primaryItem = data[primaryIndex];
      data[primaryIndex] = data[0];
      data[0] = primaryItem;
    }
    if (data && data.results) {
      data = data.results;
    }
    if (data && data.data) {
      data = data.data;
    }
    if (data && data.results) {
      data = data.results;
    }

    if (data && data.status === 'error') {
      yield put({
        type: FETCH_DATA_ASYNC.error,
        payload: { prop: action.payload, message: data.message },
      });
    } else {
      yield put({
        type: FETCH_DATA_ASYNC.success,
        payload: { data, prop: action.payload },
      });
    }
  } catch (error) {
    if (
      error &&
      error.status &&
      (error.status === 403 || error.status === 401)
    ) {
      // yield put({
      //   type: LOGOUT_USER,
      // });
    }
    yield put({
      type: FETCH_DATA_ASYNC.error,
      payload: { prop: action.payload, message: error.message },
    });
  }
  fetchingInProgress[action.payload] = false;
}

const rehiveSagas = all([takeEvery(FETCH_DATA_ASYNC.pending, fetchData)]);

export default rehiveSagas;
