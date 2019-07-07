import { List } from 'immutable';
import {
  ACTION_MERCHANTS_LOAD,
  ACTION_MERCHANTS_LOAD_SUCCESS,
  ACTION_MERCHANT_SAVE,
  ACTION_MERCHANT_SAVE_SUCCESS,
  ACTION_MERCHANT_SAVE_ERROR,
  ACTION_MERCHANT_DESTROY,
  ACTION_MERCHANT_DESTROY_SUCCESS,
} from '../constants';
import Merchant from '../models/Merchant';

function merchants(state = {
  loading: false,
  saving: false,
  deleting: false,
  pagination: {
    data: List(),
    page: 0,
    last_page: 0,
    per_page: 10,
  },
  errors: null,
}, action) {
  switch (action.type) {
    case ACTION_MERCHANTS_LOAD:
      return {
        ...state,
        loading: true,
      };
    case ACTION_MERCHANTS_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        pagination: {
          ...state.pagination,
          ...action.data,
          data: List(action.data.data.map(item => (new Merchant(item)))),
        },
      };
    case ACTION_MERCHANT_SAVE:
      return {
        ...state,
        saving: true,
      };
    case ACTION_MERCHANT_SAVE_SUCCESS:
      return {
        ...state,
        saving: false,
        errors: null,
      };
    case ACTION_MERCHANT_SAVE_ERROR:
      return {
        ...state,
        saving: false,
        errors: action.errors,
      };
    case ACTION_MERCHANT_DESTROY:
      return {
        ...state,
        deleting: true,
      };
    case ACTION_MERCHANT_DESTROY_SUCCESS:
      return {
        ...state,
        deleting: false,
      };
    default:
      return state;
  }
}

export default merchants;
