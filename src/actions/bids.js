/* eslint-disable import/prefer-default-export */
import {
  ACTION_BIDS_LOAD,
  ACTION_BID_SAVE,
  ACTION_BID_DESTROY,
} from '../constants';

export function load(filters) {
  return {
    type: ACTION_BIDS_LOAD,
    filters,
  };
}

export function save(bid) {
  return {
    type: ACTION_BID_SAVE,
    bid,
  };
}

export function destroy(bid) {
  return {
    type: ACTION_BID_DESTROY,
    bid,
  };
}
