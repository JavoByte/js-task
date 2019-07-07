/* eslint-disable import/prefer-default-export */
import validate from 'validate.js';
import _ from 'lodash';
import Bid from '../models/Bid';

export function load(database, filters = {}) {
  return new Promise((resolve) => {
    let data = _.filter(Object.values(database.bids), (item) => {
      if (filters.merchant_id) {
        return item.merchant_id === filters.merchant_id;
      }
      return true;
    });
    data = _.sortBy(data, item => item.created_at);
    data = _.reverse(data);
    const perPage = 10;
    const lastPage = Math.ceil(data.length / 10);
    let currentPage;
    if (filters.page === 'last') {
      currentPage = lastPage;
    } else {
      currentPage = filters.page || 1;
    }
    const pageData = _.take(_.drop(data, perPage * (currentPage - 1)), perPage);
    resolve({
      data: pageData,
      per_page: perPage,
      last_page: lastPage,
      current_page: currentPage,
    });
  });
}

export function save(bid, database) {
  const constraints = {
    car_title: {
      presence: {
        allowEmpty: false,
      },
      length: {
        maximum: 255,
      },
    },
    amount: {
      numericality: {
        greaterThan: 0,
        message: 'must be greater than 0',
      },
    },
    merchant_id: {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      },
      length: {
        is: 36,
      },
      inclusion: {
        within: Object.keys(database.merchants),
      },
    },
  };
  return new Promise((resolve, reject) => {
    const errors = validate(bid, constraints);
    if (errors) {
      const error = new Error('Unprocessable entity');
      error.status = 422;
      error.errors = errors;
      reject(error);
    } else {
      const newBid = new Bid(bid);
      newBid.saved();
      resolve(newBid);
    }
  });
}

export function destroy(bidID) {
  return new Promise(resolve => resolve(bidID));
}
