/* eslint-disable import/prefer-default-export */
import validate from 'validate.js';
import _ from 'lodash';
import Merchant from '../models/Merchant';

export function load(database, filters = {}) {
  return new Promise((resolve) => {
    const data = _.filter(Object.values(database.merchants), (item) => {
      if (filters.id) {
        return filters.id === item.id;
      }
      return true;
    });
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

export function save(merchant, database) {
  let totalEmails = _.map(database.merchants, item => item.email);
  if (merchant.id) {
    totalEmails = _.without(totalEmails, merchant.email);
  }
  const constraints = {
    first_name: {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /[A-zÀ-ÿ\s]*/,
      },
      length: {
        maximum: 255,
      },
    },
    last_name: {
      presence: {
        allowEmpty: false,
      },
      format: {
        pattern: /[A-zÀ-ÿ\s]*/,
      },
      length: {
        maximum: 255,
      },
    },
    email: {
      presence: true,
      email: {
        message: () => '^Please type a valid email',
      },
      exclusion: {
        within: totalEmails,
        message: '^This email has already been taken',
      },
    },
  };
  return new Promise((resolve, reject) => {
    const errors = validate(merchant, constraints);
    if (errors) {
      const error = new Error('Unprocessable entity');
      error.status = 422;
      error.errors = errors;
      reject(error);
    } else {
      const newMerchant = new Merchant(merchant);
      console.info(newMerchant);
      if (newMerchant.avatar) {
        const reader = new FileReader();
        reader.onload = (readEvent) => {
          const { result } = readEvent.target;
          newMerchant.avatar_url = result;
          newMerchant.avatar = null;
          newMerchant.saved();
          resolve(newMerchant);
        };
        reader.onerror = (error) => {
          console.error(error);
        };
        reader.readAsDataURL(newMerchant.avatar);
      } else {
        newMerchant.avatar = null;
        newMerchant.saved();
        resolve(newMerchant);
      }
    }
  });
}

export function destroy(merchantID) {
  return new Promise(resolve => resolve(merchantID));
}
