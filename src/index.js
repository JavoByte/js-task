import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import './index.css';
import App from './App';
import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';

const history = createHistory();
const store = configureStore({
  history,
});

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
);

registerServiceWorker();
