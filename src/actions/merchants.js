/* eslint-disable import/prefer-default-export */
import {
  ACTION_MERCHANTS_LOAD,
  ACTION_MERCHANT_SAVE,
  ACTION_MERCHANT_DESTROY,
} from '../constants';

export function load(filters) {
  return {
    type: ACTION_MERCHANTS_LOAD,
    filters,
  };
}

export function save(merchant) {
  return {
    type: ACTION_MERCHANT_SAVE,
    merchant,
  };
}

export function destroy(merchant) {
  return {
    type: ACTION_MERCHANT_DESTROY,
    merchant,
  };
}
