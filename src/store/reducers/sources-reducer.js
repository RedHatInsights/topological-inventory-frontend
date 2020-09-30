import {
  LOAD_DATA,
  LOAD_SOURCE_TYPES,
  LOAD_DETAIL_FULFILLED,
  LOAD_DETAIL_FAILED,
  LOAD_DETAIL_PENDING,
} from '../action-types/sources-action-types';

export const sourcesInitialState = {
  isLoaded: false,
  sourceTypes: [],
  sources: [],
  details: {},
  isDetailLoading: false,
};

const loadData = (state, { payload: { sources } }) => ({
  ...state,
  isLoaded: true,
  sources,
});

const loadSourceTypes = (state, { payload: { data } }) => ({
  ...state,
  sourceTypes: data,
});

const loadDetailPending = (state) => ({
  ...state,
  isDetailLoading: true,
});

const loadDetailFailed = (state) => ({
  ...state,
  isDetailLoading: false,
});

const loadDetailFulfilled = (state, { payload }) => ({
  ...state,
  details: {
    ...state.details,
    ...payload,
  },
  isDetailLoading: false,
});

export default {
  [LOAD_DATA]: loadData,
  [LOAD_SOURCE_TYPES]: loadSourceTypes,
  [LOAD_DETAIL_FULFILLED]: loadDetailFulfilled,
  [LOAD_DETAIL_FAILED]: loadDetailFailed,
  [LOAD_DETAIL_PENDING]: loadDetailPending,
};
