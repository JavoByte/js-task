import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import bids from './bids';
import merchants from './merchants';
import persistance from './persistance';

export default combineReducers({
  bids,
  merchants,
  persistance,
  router: routerReducer,
});
