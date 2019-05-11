import logger from 'redux-logger';
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { Module } from '../models/Module';
import reducer from './reducer';

export default () => {
  if (process.env.NODE_ENV === 'development') {
    const store = configureStore({
      reducer,
      middleware: [logger, ...getDefaultMiddleware()],
    });

    (module as Module).hot.accept('./reducer', () =>
      store.replaceReducer(reducer),
    );

    return store;
  } else {
    return configureStore({ reducer });
  }
};
