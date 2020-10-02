import {
  LOAD_DATA,
  LOAD_SOURCE_TYPES,
  LOAD_SOURCE_TYPES_FAILED,
  LOAD_DETAIL_FULFILLED,
  LOAD_DETAIL_FAILED,
  LOAD_DETAIL_PENDING,
  OPEN_DETAIL,
  CLOSE_DETAIL,
  CLICK_ON_NODE,
  KEEP_CLOSED,
  OPEN_DETAIL_BUTTON,
} from './action-types/sources-action-types';

import { loadSources } from '../api/topology-viewer-api';
import { getSourcesTypes, getSourceTypes } from '../api/sources';
import { getAxtionsInstace } from '../api/api';
import { TOPOLOGICAL_INVETORY_API_BASE } from '../constants/api-constants';

export const loadSourcesAction = () => async (dispatch) => {
  const data = await loadSources();

  const additionalData = await getSourcesTypes(data.sources.map(({ id }) => id));

  return dispatch({
    type: LOAD_DATA,
    payload: {
      sources: data.sources.map((source) => {
        return {
          ...additionalData.sources.find(({ id }) => id === source.id),
          ...source,
        };
      }),
    },
  });
};

export const loadSourceTypes = () => async (dispatch) => {
  try {
    const sourceTypes = await getSourceTypes();
    return dispatch({
      type: LOAD_SOURCE_TYPES,
      payload: sourceTypes,
    });
  } catch {
    return dispatch({
      type: LOAD_SOURCE_TYPES_FAILED,
    });
  }
};

export const loadItemDetail = (node, nodeName, name, id) => async (dispatch, getState) => {
  dispatch({
    type: OPEN_DETAIL,
    payload: { node, name: nodeName },
  });

  const {
    sourcesReducer: { details },
  } = getState();

  if (details[node]) {
    return dispatch({
      type: LOAD_DETAIL_FULFILLED,
    });
  }

  dispatch({
    type: LOAD_DETAIL_PENDING,
  });

  try {
    const detail = await getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/${name}/${id}`);
    return dispatch({
      type: LOAD_DETAIL_FULFILLED,
      payload: {
        [node]: detail,
      },
    });
  } catch {
    return dispatch({
      type: LOAD_DETAIL_FAILED,
    });
  }
};

export const closeDetailDrawer = () => ({
  type: CLOSE_DETAIL,
});

export const clickOnNode = (node) => ({
  type: CLICK_ON_NODE,
  payload: { node },
});

export const keepClosed = () => ({
  type: KEEP_CLOSED,
});

export const openDetailButton = () => ({
  type: OPEN_DETAIL_BUTTON,
});
