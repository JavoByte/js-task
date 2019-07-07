/* eslint-disable no-underscore-dangle */
import uuid from 'uuid/v4';
import moment from 'moment-timezone';

const defaultAttributes = [
  'id',
  'created_at',
  'updated_at',
];

const defaultCasts = {
  created_at: 'datetime',
  updated_at: 'datetime',
};

function cast(value, type) {
  switch (type) {
    case 'number':
      return (() => {
        const asInt = parseInt(value, 10);
        const asFloat = parseFloat(value);
        if (asInt === asFloat) {
          return asInt;
        }
        return asFloat;
      })();
    case 'boolean':
      return (() => {
        if (typeof value === 'boolean') {
          return value;
        }
        let asBoolean = value;
        if (Number.isNaN(asBoolean)) {
          if (typeof asBoolean === 'string') {
            asBoolean = asBoolean === 'true';
          } else {
            // eslint-disable-next-line no-unneeded-ternary
            asBoolean = asBoolean ? true : false;
          }
        } else {
          const asInt = parseInt(asBoolean, 10);
          asBoolean = asInt !== 0 && !Number.isNaN(asInt);
        }
        return asBoolean;
      })();
    case 'datetime':
      if (value instanceof moment) {
        return value;
      }
      if (value) {
        return moment.tz(value, 'UTC');
      }
      return value;
    default:
      return value;
  }
}

class Model {
  static attributes = [];

  static casts = {};

  constructor(attributes = {}) {
    this.__data = {};
    this.__casts = { ...defaultCasts, ...this.constructor.casts };
    (defaultAttributes.concat(this.constructor.attributes))
      .forEach((attr) => {
        Object.defineProperty(this, attr, {
          set: (value) => {
            this.__data[attr] = cast(value, this.__casts[attr]);
          },
          get: () => this.__data[attr],
        });
        this[attr] = attributes[attr];
      });
  }

  toJson() {
    const data = {};
    (defaultAttributes.concat(this.constructor.attributes))
      .forEach((attr) => {
        let value = this[attr];
        if (value instanceof moment) {
          value = value.format('YYYY-MM-DD HH:mm:ss');
        }
        data[attr] = value;
      });
    return data;
  }

  saved() {
    if (!this.id) {
      this.id = uuid();
    }
    const now = moment().tz('UTC');
    if (!this.created_at) {
      this.created_at = now;
    }
    this.updated_at = now;
  }
}

export default Model;

