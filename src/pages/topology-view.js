import React, { useEffect, useReducer } from 'react';
import TopologyViewer from '@data-driven-forms/topology-viewer';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { loadSourceTypes, loadSourcesAction, loadItemDetail, clickOnNode } from '../store/actions';
import CardLoader from '../components/loaders/card-loader';
import { structureNode } from '../api/topology-viewer-api';
import iconMapper from '../utilities/icon-mapper';
import ViewSwitcher from '../components/view-switcher';

const findAllChildren = (nodeIds, edges = [], state) => {
  let allEdges = [...edges];
  let newIds = [];
  nodeIds.forEach((id) => {
    allEdges.push(
      ...state.edges.filter(({ source, target }) => {
        if (source === id) {
          newIds.push(target);
        }

        return source === id;
      })
    );
  });
  if (newIds.length > 0) {
    return findAllChildren(newIds, allEdges, state);
  }

  return allEdges;
};

const reducer = (state, { type, payload }) => {
  const states = {
    setEdges: (data) => ({ ...state, edges: data }),
    setNodes: (data) => ({ ...state, nodes: data }),
    setData: (data) => ({ ...state, ...data }),
    setNodesAndEdges: (data) => ({
      ...state,
      nodes: [...state.nodes, ...data.nodes],
      edges: [...state.edges, ...data.edges],
    }),
    updateGraph: (data) => ({
      ...state,
      nodes: [...state.nodes, ...data.nodes],
      edges: [...state.edges, ...data.edges],
    }),
    markNode: (data) => ({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === data.node.id
          ? { ...node, originalLength: node.children, children: undefined, wasClicked: true }
          : node
      ),
    }),
    closeNode: (data) => {
      const obsoleteEdges = findAllChildren([data.node.id], [], state);
      const nodes = state.nodes.filter((item) => !obsoleteEdges.find(({ target }) => target === item.id));
      const obsoleteEdgesIDs = obsoleteEdges.map(({ id }) => id);

      return {
        ...state,
        edges: state.edges.filter(({ id }) => !obsoleteEdgesIDs.includes(id)),
        nodes: nodes.map((node) =>
          node.id === data.node.id ? { ...node, children: node.originalLength, wasClicked: false } : node
        ),
      };
    },
  };
  return states[type](payload);
};

const initialState = {
  nodes: [],
  edges: [],
};

const buildNodesEnhanced = (item, infoNode = structureNode, sourceTypes = [], group = 0, level = 0) => {
  if (Array.isArray(item)) {
    return item.map((source, index) => buildNodesEnhanced(source, infoNode, sourceTypes, group + index));
  }

  const nodeName = `${infoNode.name}-${item.id}`;

  const children = [];
  const edges = [];

  infoNode.children?.forEach((child) => {
    if (item[child.name]?.length > 0) {
      const childrenNodes = item[child.name]?.map((subItem) =>
        buildNodesEnhanced(subItem, child, sourceTypes, group, level + 1)
      );
      const childrenEdges = childrenNodes.map((childNode) => ({
        directional: true,
        id: `${item.id}-${child.name}-${childNode.id}-edge`,
        source: `${item.id}-${child.name}`,
        target: childNode.id,
      }));

      const renderChildrenNodes = () => childrenNodes;
      const renderEdges = () => childrenEdges;

      children.push({
        title: child.label,
        id: `${item.id}-${child.name}`,
        children: childrenNodes.length || 0,
        nodeShape: 'circle',
        nodeType: 'default',
        ...child.topologyViewNode,
        renderChildrenNodes,
        renderEdges,
        group,
        level,
      });

      edges.push({
        directional: true,
        id: `${item.id}-${child.name}-edge`,
        source: nodeName,
        target: `${item.id}-${child.name}`,
      });
    }
  });

  let name = (infoNode.attributes && item[infoNode.attributes[0]]) || item.name || item.id;

  if (infoNode.transformLabel) {
    name = infoNode.transformLabel(item, sourceTypes);
  }

  const renderChildrenNodes = () => children;
  const renderEdges = () => edges;

  return {
    id: nodeName,
    originalId: item.id,
    key: item.id,
    title: name,
    isSelectable: true,
    nodeShape: 'circle',
    nodeType: 'default',
    ...infoNode.topologyViewNode,
    children: infoNode.children ? children.length || '0' : undefined,
    nodeName,
    category: infoNode.name,
    renderChildrenNodes,
    renderEdges,
    group,
    ...(level && { level }),
  };
};

const TopologyView = () => {
  const openedNodes = useSelector(
    ({ sourcesReducer }) => sourcesReducer.openedNodes,
    () => true
  );
  const isLoaded = useSelector(({ sourcesReducer: { isLoaded } }) => isLoaded);
  const sources = useSelector(({ sourcesReducer }) => sourcesReducer.sources, shallowEqual);
  const sourceTypes = useSelector(({ sourcesReducer }) => sourcesReducer.sourceTypes, shallowEqual);
  const openedNode = useSelector(
    ({ sourcesReducer }) => sourcesReducer.selectedNode,
    () => true
  );

  const reduxDispatch = useDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!isLoaded) {
      reduxDispatch(loadSourceTypes());
      reduxDispatch(loadSourcesAction());
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const nodes = buildNodesEnhanced(sources, structureNode, sourceTypes);
      const edges = [];

      if (openedNodes.length) {
        openedNodes.forEach((openedNode) => {
          const expanedNode = nodes.find(({ id }) => openedNode === id);

          if (expanedNode) {
            let childrenNodes = expanedNode.renderChildrenNodes && expanedNode.renderChildrenNodes();

            if (childrenNodes?.length > 0) {
              expanedNode.originalLength = expanedNode.children;
              expanedNode.children = undefined;
              expanedNode.wasClicked = true;

              nodes.push(...childrenNodes);
              edges.push(...expanedNode.renderEdges());
            }
          }
        });
      }

      dispatch({ type: 'setData', payload: { nodes, edges } });
    }
  }, [isLoaded]);

  const handleNodeClick = (node) => {
    reduxDispatch(clickOnNode(node.id));

    if (node.isSelectable) {
      reduxDispatch(loadItemDetail(node.id, node.title, node.category, node.originalId));
    }

    if (!node.wasClicked) {
      dispatch({ type: 'markNode', payload: { node } });

      let childrenNodes = node.renderChildrenNodes && node.renderChildrenNodes();

      if (childrenNodes?.length > 0) {
        dispatch({
          type: 'setNodesAndEdges',
          payload: { nodes: childrenNodes || [], edges: node.renderEdges() || [] },
        });
      }
    } else {
      dispatch({ type: 'closeNode', payload: { node } });
    }
  };

  if (!isLoaded) {
    return <CardLoader />;
  }

  return (
    <React.Fragment>
      <ViewSwitcher style={{ position: 'absolute' }} className="pf-u-m-lg" />
      <TopologyViewer
        handleNodeClick={handleNodeClick}
        edges={state.edges}
        nodes={state.nodes}
        iconMapper={iconMapper}
        {...(openedNode && { selectedNode: { id: openedNode } })}
      />
    </React.Fragment>
  );
};

export default TopologyView;
