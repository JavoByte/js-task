import { select, call, put } from 'redux-saga/effects';
import {
  ACTION_API_ERROR,
  ACTION_DB_SAVE,
  ACTION_DB_DELETE,
  ACTION_MERCHANTS_LOAD,
  ACTION_MERCHANTS_LOAD_SUCCESS,
  ACTION_MERCHANTS_LOAD_ERROR,
  ACTION_MERCHANT_SAVE,
  ACTION_MERCHANT_SAVE_SUCCESS,
  ACTION_MERCHANT_SAVE_ERROR,
  ACTION_MERCHANT_DESTROY,
  ACTION_MERCHANT_DESTROY_SUCCESS,
  ACTION_MERCHANT_DESTROY_ERROR,
} from '../constants';
import { load, save, destroy } from '../backendMockup/merchants';
import axios from '../utils/simulatedAxios';

function* loadMerchants({ filters }) {
  try {
    const database = yield select(state => state.persistance);
    const response = yield call(() => axios.get('merchants', {
      params: filters,
      expectedResponse: () => load(database, filters),
    }));
    const { data } = response;
    yield put({
      type: ACTION_MERCHANTS_LOAD_SUCCESS,
      data,
    });
  } catch (error) {
    yield put({
      type: ACTION_API_ERROR,
      handledType: ACTION_MERCHANTS_LOAD_ERROR,
      error,
    });
  }
}

function* saveMerchant({ merchant }) {
  try {
    const database = yield select(state => state.persistance);
    const response = yield call(() => axios.post('merchants', merchant.toJson(), {
      expectedResponse: data => save(data, database),
    }));
    const { data } = response;
    // Data has been validated. `data` contains the new merchant data
    /*
    * Put the object in our local database. This step should be omitted when
    * connecting to the real backend since data should be already persisted in server DB
    */
    yield put({
      type: ACTION_DB_SAVE,
      table: 'merchants',
      data: data.toJson(),
    });

    // Call our reducer for merchants with persisted data
    yield put({
      type: ACTION_MERCHANT_SAVE_SUCCESS,
      data,
    });
  } catch (error) {
    yield put({
      type: ACTION_API_ERROR,
      handledType: ACTION_MERCHANT_SAVE_ERROR,
      error,
    });
  }
}

function* destroyMerchant({ merchant }) {
  try {
    yield call(() => axios.delete('merchants', {
      expectedResponse: () => destroy(merchant.id),
    }));
    /*
    * Delete merchant from our local database. This step should be omitted when
    * connecting to the real backend since data should be already deleted in server DB
    */
    yield put({
      type: ACTION_DB_DELETE,
      table: 'merchants',
      id: merchant.id,
    });

    // Tell our reducer merchant has been succesfully deleted
    yield put({
      type: ACTION_MERCHANT_DESTROY_SUCCESS,
      data: merchant,
    });
  } catch (error) {
    // Never called. Placeholder to handle errors when connecting to real backend
    yield put({
      type: ACTION_API_ERROR,
      handledType: ACTION_MERCHANT_DESTROY_ERROR,
      error,
    });
  }
}

function getSaga(action) {
  switch (action.type) {
    case ACTION_MERCHANTS_LOAD:
      return loadMerchants;
    case ACTION_MERCHANT_SAVE:
      return saveMerchant;
    case ACTION_MERCHANT_DESTROY:
      return destroyMerchant;
    default:
      return null;
  }
}

export default getSaga;
