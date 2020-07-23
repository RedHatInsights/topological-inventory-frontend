import { SET_DATA, UPDATE_NODE } from '../action-types/sources-action-types';

export const sourcesInitialState = {
  data: [],
  meta: {
    limit: 50,
    offset: 0,
    count: 0,
  },
};

const setData = (state, { payload }) => ({ ...state, ...payload });

const updateNested = (data, id, subCollections) =>
  data.map((node) => {
    if (node.data && node.data.data) {
      return {
        ...node,
        data: {
          ...node.data,
          data: updateNested(node.data.data, id, subCollections),
        },
      };
    }

    return node.id === id
      ? { ...node, subCollections: [...(node.subCollections ? node.subCollections : []), subCollections] }
      : node.subCollections
      ? { ...node, subCollections: updateNested(node.subCollections, id, subCollections) }
      : node;
  });

const updateNode = ({ data, ...state }, { id, subCollections }) => ({
  ...state,
  data: updateNested(data, id, subCollections),
});

export default {
  [SET_DATA]: setData,
  [UPDATE_NODE]: updateNode,
};
