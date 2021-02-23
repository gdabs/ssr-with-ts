import { createStore, combineReducers, applyMiddleware, Middleware, Reducer, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import reduxLogger from 'redux-logger';
import { Action } from './types';
import appReducer, { AppState } from './module/app';

export interface StoreState {
  app: AppState;
}

const reducers: Reducer<StoreState, Action<any>> = combineReducers<StoreState>({
  app: appReducer,
});

const middleware: Middleware[] = [reduxThunk];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(reduxLogger);
}

function createMyStore() {
  const store =
    __isBrowser__ && window.__REDUX_DEVTOOLS_EXTENSION__
      ? createStore(
          reducers,
          compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__({}))
        )
      : createStore(reducers, applyMiddleware(...middleware));
  return store;
}

export default createMyStore;
