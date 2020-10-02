import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Card, CardBody, CardTitle } from '@patternfly/react-core';

import { structureNode } from '../api/topology-viewer-api';

import CardLoader from '../components/loaders/card-loader';
import { loadSourcesAction, loadSourceTypes, loadItemDetail, clickOnNode } from '../store/actions';

import { TreeView as PFTreeView } from '@patternfly/react-core';
import ViewSwitcher from '../components/view-switcher';

const createTreeData = (item, infoNode = structureNode, sourceTypes = [], expandedNodes = []) => {
  if (Array.isArray(item)) {
    return item.map((source) => createTreeData(source, infoNode, sourceTypes, expandedNodes));
  }

  const children = [];

  infoNode.children?.forEach((child) => {
    if (item[child.name]?.length > 0) {
      const nodeName = `${item.id}-${child.name}`;

      children.push({
        name: child.label,
        id: nodeName,
        children: item[child.name]?.map((subItem) => createTreeData(subItem, child, sourceTypes, expandedNodes)),
        defaultExpanded: expandedNodes.includes(nodeName),
      });
    }
  });

  let name = (infoNode.attributes && item[infoNode.attributes[0]]) || item.name || item.id;

  if (infoNode.transformLabel) {
    name = infoNode.transformLabel(item, sourceTypes);
  }

  const nodeName = `${infoNode.name}-${item.id}`;

  return {
    originalId: item.id,
    id: nodeName,
    key: item.id,
    name,
    ...(children.length > 0 ? { children } : {}),
    isSelectable: true,
    defaultExpanded: expandedNodes.includes(nodeName),
    category: infoNode.name,
  };
};

const TreeView = () => {
  const [treeData, setTreeData] = useState();

  const dispatch = useDispatch();

  const isLoaded = useSelector(({ sourcesReducer: { isLoaded } }) => isLoaded);
  const sources = useSelector(({ sourcesReducer }) => sourcesReducer.sources, shallowEqual);
  const sourceTypes = useSelector(({ sourcesReducer }) => sourcesReducer.sourceTypes, shallowEqual);
  const openedNodes = useSelector(
    ({ sourcesReducer }) => sourcesReducer.openedNodes,
    () => true
  );
  const openedNode = useSelector(({ sourcesReducer }) => sourcesReducer.selectedNode);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(loadSourceTypes());
      dispatch(loadSourcesAction());
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setTreeData(createTreeData(sources, structureNode, sourceTypes, openedNodes));
    }
  }, [isLoaded]);

  if (!isLoaded || !treeData) {
    return <CardLoader />;
  }

  return (
    <Card>
      <CardTitle>
        <ViewSwitcher />
      </CardTitle>
      <CardBody>
        Sources
        <PFTreeView
          {...(openedNode && { activeItems: [{ id: openedNode }] })}
          data={treeData}
          onSelect={(e, item) => {
            dispatch(clickOnNode(item.id));

            if (item.isSelectable) {
              dispatch(loadItemDetail(item.id, item.name, item.category, item.originalId));
            }
          }}
        />
      </CardBody>
    </Card>
  );
};

export default TreeView;
