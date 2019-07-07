import { select, call, put } from 'redux-saga/effects';
import {
  ACTION_API_ERROR,
  ACTION_DB_SAVE,
  ACTION_DB_DELETE,
  ACTION_BIDS_LOAD,
  ACTION_BIDS_LOAD_SUCCESS,
  ACTION_BIDS_LOAD_ERROR,
  ACTION_BID_SAVE,
  ACTION_BID_SAVE_SUCCESS,
  ACTION_BID_SAVE_ERROR,
  ACTION_BID_DESTROY,
  ACTION_BID_DESTROY_SUCCESS,
  ACTION_BID_DESTROY_ERROR,
} from '../constants';
import { load, save, destroy } from '../backendMockup/bids';
import axios from '../utils/simulatedAxios';

function* loadBids({ filters }) {
  try {
    const database = yield select(state => state.persistance);
    const response = yield call(() => axios.get('bids', {
      params: filters,
      expectedResponse: () => load(database, filters),
    }));
    const { data } = response;
    yield put({
      type: ACTION_BIDS_LOAD_SUCCESS,
      data,
    });
  } catch (error) {
    yield put({
      type: ACTION_API_ERROR,
      handledType: ACTION_BIDS_LOAD_ERROR,
      error,
    });
  }
}

function* saveBid({ bid }) {
  try {
    const database = yield select(state => state.persistance);
    const response = yield call(() => axios.post('bids', bid.toJson(), {
      expectedResponse: data => save(data, database),
    }));
    const { data } = response;
    // Data has been validated. `data` contains the new bid data
    /*
    * Put the object in our local database. This step should be omitted when
    * connecting to the real backend since data should be already persisted in server DB
    */
    yield put({
      type: ACTION_DB_SAVE,
      table: 'bids',
      data: data.toJson(),
    });

    // Call our reducer for bids with persisted data
    yield put({
      type: ACTION_BID_SAVE_SUCCESS,
      data,
    });
  } catch (error) {
    yield put({
      type: ACTION_API_ERROR,
      handledType: ACTION_BID_SAVE_ERROR,
      error,
    });
  }
}

function* destroyBid({ bid }) {
  try {
    yield call(() => axios.delete('bids', {
      expectedResponse: () => destroy(bid.id),
    }));
    /*
    * Delete bid from our local database. This step should be omitted when
    * connecting to the real backend since data should be already deleted in server DB
    */
    yield put({
      type: ACTION_DB_DELETE,
      table: 'bids',
      id: bid.id,
    });

    // Tell our reducer bid has been succesfully deleted
    yield put({
      type: ACTION_BID_DESTROY_SUCCESS,
      data: bid,
    });
  } catch (error) {
    // Never called. Placeholder to handle errors when connecting to real backend
    yield put({
      type: ACTION_API_ERROR,
      handledType: ACTION_BID_DESTROY_ERROR,
      error,
    });
  }
}

function getSaga(action) {
  switch (action.type) {
    case ACTION_BIDS_LOAD:
      return loadBids;
    case ACTION_BID_SAVE:
      return saveBid;
    case ACTION_BID_DESTROY:
      return destroyBid;
    default:
      return null;
  }
}

export default getSaga;
