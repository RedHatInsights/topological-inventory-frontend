import {
  LOAD_DATA,
  LOAD_SOURCE_TYPES,
  LOAD_DETAIL_FULFILLED,
  LOAD_DETAIL_FAILED,
  LOAD_DETAIL_PENDING,
  CLOSE_DETAIL,
  OPEN_DETAIL,
  CLICK_ON_NODE,
  KEEP_CLOSED,
  OPEN_DETAIL_BUTTON,
} from '../action-types/sources-action-types';

export const sourcesInitialState = {
  isLoaded: false,
  sourceTypes: [],
  sources: [],
  details: {},
  isDetailLoading: false,
  detailOpen: false,
  selectedNode: undefined,
  detail: {
    node: undefined,
    name: undefined,
  },
  openedNodes: [],
  keepClosed: false,
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
  detailOpen: !state.keepClosed,
  detail: {
    node: payload.node,
    name: payload.name,
  },
});

const openDetailButton = (state) => ({
  ...state,
  detailOpen: true,
});

const keepClosed = (state) => ({
  ...state,
  keepClosed: !state.keepClosed,
});

const clickOnNode = (state, { payload }) => ({
  ...state,
  openedNodes: state.openedNodes.includes(payload.node)
    ? state.openedNodes.filter((node) => node !== payload.node)
    : [...state.openedNodes, payload.node],
  selectedNode: payload.node,
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
  [KEEP_CLOSED]: keepClosed,
  [OPEN_DETAIL_BUTTON]: openDetailButton,
};
