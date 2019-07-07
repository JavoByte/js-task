import {
  ACTION_DB_LOAD_SUCCESS,
  ACTION_DB_SAVE,
  ACTION_DB_DELETE,
  ACTION_DB_CLEAR,
  ACTION_DB_SEED,
  ACTION_DB_SEED_SUCCESS,
} from '../constants';

function persistance(state = {
  config: {
    seeding: false,
  },
}, action) {
  switch (action.type) {
    case ACTION_DB_LOAD_SUCCESS:
      return {
        ...state,
        [action.table]: action.data,
      };
    case ACTION_DB_SAVE:
      return {
        ...state,
        [action.table]: {
          ...state[action.table],
          [action.data.id]: action.data,
        },
      };
    case ACTION_DB_DELETE:
      return {
        ...state,
        [action.table]: (
          (prevData) => {
            const newData = { ...prevData };
            delete newData[action.id];
            return newData;
          }
        )(state[action.table]),
      };
    case ACTION_DB_CLEAR:
      return (() => {
        const newDB = {
          config: {
            ...state.config,
          },
        };
        Object.keys(state).forEach((key) => {
          if (key !== 'config') {
            newDB[key] = {};
          }
        });
        return newDB;
      })();
    case ACTION_DB_SEED:
      return {
        ...state,
        config: {
          ...state.config,
          seeding: true,
        },
      };
    case ACTION_DB_SEED_SUCCESS:
      return {
        ...state,
        config: {
          ...state.config,
          seeding: false,
        },
        [action.table]: {
          ...state[action.table],
          ...action.data,
        },
      };
    default:
      return state;
  }
}

export default persistance;
