import ReducerRegistry, {
  applyReducerHash,
} from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import sourcesReducer, { sourcesInitialState } from './reducers/sources-reducer';

let registry;

export const init = (...middleware) => {
  if (registry) {
    throw new Error('store already initialized');
  }

  registry = new ReducerRegistry({}, [thunk, promiseMiddleware, ...middleware]);

  registry.register({
    sourcesReducer: applyReducerHash(sourcesReducer, sourcesInitialState),
  });
  return registry;
};

export const getStore = () => registry.getStore();

export const register = (...args) => registry.register(...args);
