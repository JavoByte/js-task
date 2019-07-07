import { List } from 'immutable';
import {
  ACTION_BIDS_LOAD,
  ACTION_BIDS_LOAD_SUCCESS,
  // ACTION_BIDS_LOAD_ERROR,
  ACTION_BID_SAVE,
  ACTION_BID_SAVE_SUCCESS,
  ACTION_BID_SAVE_ERROR,
  ACTION_BID_DESTROY,
  ACTION_BID_DESTROY_SUCCESS,
  // ACTION_BID_DESTROY_ERROR,
} from '../constants';
import Bid from '../models/Bid';

function bids(state = {
  loading: false,
  saving: false,
  deleting: false,
  pagination: {
    data: List(),
    last_page: 0,
    first_page: 0,
    current_page: 0,
    total: 0,
  },
  errors: null,
}, action) {
  switch (action.type) {
    case ACTION_BIDS_LOAD:
      return {
        ...state,
        loading: true,
      };
    case ACTION_BIDS_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        pagination: {
          ...state.pagination,
          ...action.data,
          data: List(action.data.data.map(item => (new Bid(item)))),
        },
      };
    case ACTION_BID_SAVE:
      return {
        ...state,
        saving: true,
      };
    case ACTION_BID_SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        errors: null,
      };
    case ACTION_BID_SAVE_ERROR:
      return {
        ...state,
        saving: false,
        errors: action.errors,
      };
    case ACTION_BID_DESTROY:
      return {
        ...state,
        deleting: true,
      };
    case ACTION_BID_DESTROY_SUCCESS:
      return {
        ...state,
        deleting: false,
      };
    default:
      return state;
  }
}

export default bids;
