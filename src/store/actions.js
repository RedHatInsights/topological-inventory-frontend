import {
  LOAD_DATA,
  LOAD_SOURCE_TYPES,
  LOAD_SOURCE_TYPES_FAILED,
  LOAD_DETAIL_FULFILLED,
  LOAD_DETAIL_FAILED,
  LOAD_DETAIL_PENDING,
  OPEN_DETAIL,
  CLOSE_DETAIL,
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

export const loadItemDetail = (name, id, nodeName) => async (dispatch, getState) => {
  dispatch({
    type: OPEN_DETAIL,
    payload: { node: `${name}-${id}`, name: nodeName },
  });

  const {
    sourcesReducer: { details },
  } = getState();

  if (details[`${name}-${id}`]) {
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
        [`${name}-${id}`]: detail,
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
