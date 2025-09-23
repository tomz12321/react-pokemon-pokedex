import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import pokemon from './reducers/pokemon';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  router: connectRouter(history), // 必須 key = 'router'
  pokemon
  // 其他 reducers...
});

const middlewares = [thunk, routerMiddleware(history)];

const composeEnhancers =
  (typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;
