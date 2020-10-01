import React, { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

import { structureNode } from '../api/topology-viewer-api';

import CardLoader from '../components/loaders/card-loader';
import { paths } from '../routes';
import { loadSourcesAction, loadSourceTypes, loadItemDetail } from '../store/actions';

import { TreeView as PFTreeView } from '@patternfly/react-core';

const createTreeData = (item, infoNode = structureNode, sourceTypes = []) => {
  if (Array.isArray(item)) {
    return item.map((source) => createTreeData(source, infoNode, sourceTypes));
  }

  const children = [];

  infoNode.children?.forEach((child) => {
    if (item[child.name]?.length > 0) {
      children.push({
        name: child.label,
        id: child.name,
        children: item[child.name]?.map((subItem) => createTreeData(subItem, child, sourceTypes)),
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
  };
};

const TreeView = () => {
  const isLoaded = useSelector(({ sourcesReducer: { isLoaded } }) => isLoaded);
  const dispatch = useDispatch();
  const sources = useSelector(({ sourcesReducer }) => sourcesReducer.sources, shallowEqual);
  const sourceTypes = useSelector(({ sourcesReducer }) => sourcesReducer.sourceTypes, shallowEqual);

  useEffect(() => {
    if (!isLoaded) {
      dispatch(loadSourceTypes());
      dispatch(loadSourcesAction());
    }
  }, []);

  if (!isLoaded) {
    return <CardLoader />;
  }

  const treeData = createTreeData(sources, structureNode, sourceTypes);

  return (
    <Card>
      <CardTitle>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={paths.index}>Topology Inventory</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>Tree view</BreadcrumbItem>
        </Breadcrumb>
      </CardTitle>
      <CardBody>
        Sources
        <PFTreeView
          data={treeData}
          onSelect={(e, item, parent) => {
            if (item.isSelectable) {
              const category = parent?.id || 'sources';
              dispatch(loadItemDetail(category, item.id, item.name));
            }
          }}
        />
      </CardBody>
    </Card>
  );
};

export default TreeView;
