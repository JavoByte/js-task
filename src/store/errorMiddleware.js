import {
  ACTION_API_ERROR,
  ACTION_APPLICATION_SEND_MESSAGE,
  HTTP_STATUS_UNPROCESSABLE_ENTITY,
} from '../constants';

const errorMiddleware = () => next => (action) => {
  if (action.type === ACTION_API_ERROR && action.handledType) {
    const { error } = action;
    const { response } = error;
    const defaultErrorHandler = (dispatch) => {
      const messageAction = {
        type: ACTION_APPLICATION_SEND_MESSAGE,
        message: {
          type: 'error',
          identifier: ACTION_API_ERROR,
          message: error.message,
        },
      };
      const handledErrorAction = {
        type: action.handledType,
        error,
      };
      dispatch(messageAction);
      dispatch(handledErrorAction);
    };
    if (response && response.status) {
      switch (response.status) {
        case HTTP_STATUS_UNPROCESSABLE_ENTITY:
          return next({
            type: action.handledType,
            message: response.data.message,
            errors: response.data.errors,
          });
        default:
          return next(defaultErrorHandler);
      }
    } else {
      return next(defaultErrorHandler);
    }
  } else {
    return next(action);
  }
};

export default errorMiddleware;
