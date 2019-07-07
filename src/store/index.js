import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import reducers from '../reducers';
import sagas from '../sagas';
import errorMiddleware from './errorMiddleware';


const configureStore = (config) => {
  const sagaMiddleware = createSagaMiddleware();

  const enhancers = [];
  const middlewares = [sagaMiddleware, routerMiddleware(config.history), errorMiddleware, thunk];

  if (process.env.NODE_ENV === 'development') {
    const { devToolsExtension } = window;

    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }

    middlewares.push(createLogger({
      collapsed: true,
    }));
  }

  const store = createStore(
    reducers,
    {},
    compose(applyMiddleware(...middlewares), ...enhancers),
  );

  store.rootSaga = sagas(sagaMiddleware);
  return store;
};

export default configureStore;
