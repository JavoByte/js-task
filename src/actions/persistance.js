/* eslint-disable import/prefer-default-export */
import {
  ACTION_DB_LOAD,
  ACTION_DB_PERSIST,
  ACTION_DB_SEED,
  ACTION_DB_CLEAR,
} from '../constants';

export function load() {
  return {
    type: ACTION_DB_LOAD,
  };
}

export function seed(table, count) {
  return {
    type: ACTION_DB_SEED,
    table,
    count,
  };
}

export function clear() {
  return {
    type: ACTION_DB_CLEAR,
  };
}

export function persist() {
  return {
    type: ACTION_DB_PERSIST,
  };
}
