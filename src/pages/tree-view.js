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
      children.push({
        name: child.label,
        id: child.name,
        children: item[child.name]?.map((subItem) => createTreeData(subItem, child, sourceTypes, expandedNodes)),
        defaultExpanded: expandedNodes.includes(`${item.id}-${child.name}`),
      });
    }
  });

  let name = (infoNode.attributes && item[infoNode.attributes[0]]) || item.name || item.id;

  if (infoNode.transformLabel) {
    name = infoNode.transformLabel(item, sourceTypes);
  }

  return {
    id: item.id,
    key: item.id,
    name,
    ...(children.length > 0 ? { children } : {}),
    isSelectable: true,
    defaultExpanded: expandedNodes.includes(`${infoNode.name}-${item.id}`),
    className: 'pf-m-current',
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
    () => false
  );
  const openedNode = useSelector(({ sourcesReducer }) => sourcesReducer.detail.node);

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
          {...(openedNode && { activeItems: [{ id: openedNode.match(/\d+/)[0] }] })}
          data={treeData}
          onSelect={(e, item, parent) => {
            const category = parent?.id || 'sources';
            dispatch(clickOnNode(category, item.id));

            if (item.isSelectable) {
              dispatch(loadItemDetail(category, item.id, item.name));
            }
          }}
        />
      </CardBody>
    </Card>
  );
};

export default TreeView;
