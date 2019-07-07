import { select, put, call } from 'redux-saga/effects';
import _ from 'lodash';
import rname from 'node-random-name';
import lipsum from 'lorem-ipsum';
import {
  ACTION_DB_LOAD,
  ACTION_DB_LOAD_SUCCESS,
  ACTION_DB_PERSIST,
  ACTION_DB_SEED,
  ACTION_DB_SEED_SUCCESS,
} from '../constants';
import Merchant from '../models/Merchant';
import Bid from '../models/Bid';

async function seedMerchants(count, currentDB) {
  const data = {};
  const emails = _.map(currentDB.merchants, m => m.email);
  for (let i = 0; i < count; i++) {
    const number = parseInt((Math.random() * 500) + 500, 10);
    const first = rname({ first: true, seed: number });
    const last = rname({ last: true, seed: 100 - number });
    const premium = Math.random() < 0.5;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}.${number}@example.com`;
    if (emails.indexOf(email) >= 0) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const avatar = `https://api.adorable.io/avatars/300/${email}`;
    const phoneItem = `${parseInt(Math.random() * 10, 10)}${parseInt(Math.random() * 10, 10)}${parseInt(Math.random() * 10, 10)}`;
    const phone = `${phoneItem} ${phoneItem} ${phoneItem} ${phoneItem}`;
    const merchant = new Merchant({
      first_name: first,
      last_name: last,
      has_premium: premium,
      email,
      phone,
      avatar_url: avatar,
    });
    merchant.saved();
    emails.push(email);
    data[merchant.id] = merchant.toJson();
  }
  return data;
}

async function seedBids(count, currentDB) {
  const merchants = Object.keys(currentDB.merchants);
  if (merchants.length === 0) {
    console.error('Cannot seed bids because there are no merchants');
    return {};
  }
  const data = {};
  for (let i = 0; i < count; i++) {
    const title = lipsum({ count: 3, units: 'words' });
    const amount = parseInt(Math.random() * 990, 10) + 10;
    const bid = new Bid({ car_title: title, amount, merchant_id: _.sample(merchants) });
    bid.saved();
    data[bid.id] = bid.toJson();
  }
  return data;
}

function* dbLoad() {
  let data = null;
  const tables = [
    'merchants',
    'bids',
  ];

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    try {
      data = localStorage.getItem(table);
    } catch (error) {
      console.error('Attempted to load from DB when Storage is not available');
    }
    if (typeof data === 'string') {
      data = JSON.parse(data);
    } else if (data === null) {
      const currentDB = yield select(state => state.persistance);
      switch (table) {
        case 'merchants':
          data = yield call(() => seedMerchants(50, {}));
          break;
        case 'bids':
          data = yield call(() => seedBids(250, currentDB));
          break;
        default:
          data = {};
      }
    }
    yield put({
      type: ACTION_DB_LOAD_SUCCESS,
      table,
      data,
    });
  }
}

function* dbPersist() {
  const data = yield select(state => state.persistance);
  Object.keys(data).forEach((table) => {
    if (table !== 'config') {
      const tableData = JSON.stringify(data[table]);
      localStorage.setItem(table, tableData);
    }
  });
}

function* dbSeed({ table, count }) {
  const currentDB = yield select(state => state.persistance);
  let data = null;
  switch (table) {
    case 'merchants':
      data = yield call(() => seedMerchants(count, currentDB));
      break;
    case 'bids':
      data = yield call(() => seedBids(count, currentDB));
      break;
    default:
      break;
  }
  if (data) {
    yield put({
      type: ACTION_DB_SEED_SUCCESS,
      table,
      data,
    });
  }
}

function getSaga(action) {
  switch (action.type) {
    case ACTION_DB_LOAD:
      return dbLoad;
    case ACTION_DB_SEED:
      return dbSeed;
    case ACTION_DB_PERSIST:
      return dbPersist;
    default:
      return null;
  }
}

export default getSaga;
