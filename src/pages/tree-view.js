import React, { useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

import { structureNode } from '../api/topology-viewer-api';

import CardLoader from '../components/loaders/card-loader';
import { paths } from '../routes';
import DetailDrawer from '../components/detail-drawer';
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

  let name = item.name || item.id;

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

const initialState = (loading) => ({
  loading,
  node: undefined,
  open: false,
  name: undefined,
});

const reducer = (state, { type, node, name }) => {
  switch (type) {
    case 'loadingFinished':
      return {
        ...state,
        loading: false,
      };
    case 'openNode':
      return {
        ...state,
        node,
        name,
        open: true,
      };
    case 'closeNode':
      return {
        ...state,
        open: false,
      };
  }
};

const TreeView = () => {
  const isLoaded = useSelector(({ sourcesReducer: { isLoaded } }) => isLoaded);
  const [{ loading, name, node, open }, stateDispatch] = useReducer(reducer, initialState(!isLoaded));
  const dispatch = useDispatch();
  const sources = useSelector(({ sourcesReducer }) => sourcesReducer.sources, shallowEqual);
  const sourceTypes = useSelector(({ sourcesReducer }) => sourcesReducer.sourceTypes, shallowEqual);
  const details = useSelector(({ sourcesReducer }) => sourcesReducer.details, shallowEqual);

  useEffect(() => {
    if (loading) {
      dispatch(loadSourceTypes());
      dispatch(loadSourcesAction()).then(() => {
        stateDispatch({ type: 'loadingFinished' });
      });
    }
  }, []);

  if (loading) {
    return <CardLoader />;
  }

  const treeData = createTreeData(sources, structureNode, sourceTypes);

  return (
    <DetailDrawer
      open={open}
      data={details[node]}
      node={node}
      close={() => stateDispatch({ type: 'closeNode' })}
      name={name}
    >
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
                stateDispatch({
                  type: 'openNode',
                  name: item.name,
                  node: `${category}-${item.id}`,
                });
                dispatch(loadItemDetail(category, item.id));
              }
            }}
          />
        </CardBody>
      </Card>
    </DetailDrawer>
  );
};

export default TreeView;
