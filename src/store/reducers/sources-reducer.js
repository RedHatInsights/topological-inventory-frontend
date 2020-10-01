import {
  LOAD_DATA,
  LOAD_SOURCE_TYPES,
  LOAD_DETAIL_FULFILLED,
  LOAD_DETAIL_FAILED,
  LOAD_DETAIL_PENDING,
  CLOSE_DETAIL,
  OPEN_DETAIL,
  CLICK_ON_NODE,
} from '../action-types/sources-action-types';

export const sourcesInitialState = {
  isLoaded: false,
  sourceTypes: [],
  sources: [],
  details: {},
  isDetailLoading: false,
  detailOpen: false,
  detail: {
    node: undefined,
    name: undefined,
  },
  openedNodes: [],
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
  openDetail: true,
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

const closeDetail = (state) => ({
  ...state,
  detailOpen: false,
});

const openDetail = (state, { payload }) => ({
  ...state,
  detailOpen: true,
  detail: {
    node: payload.node,
    name: payload.name,
  },
});

const clickOnNode = (state, { payload }) => ({
  ...state,
  openedNodes: state.openedNodes.includes(payload.node)
    ? state.openedNodes.filter((node) => node !== payload.node)
    : [...state.openedNodes, payload.node],
});

export default {
  [LOAD_DATA]: loadData,
  [LOAD_SOURCE_TYPES]: loadSourceTypes,
  [LOAD_DETAIL_FULFILLED]: loadDetailFulfilled,
  [LOAD_DETAIL_FAILED]: loadDetailFailed,
  [LOAD_DETAIL_PENDING]: loadDetailPending,
  [CLOSE_DETAIL]: closeDetail,
  [OPEN_DETAIL]: openDetail,
  [CLICK_ON_NODE]: clickOnNode,
};
