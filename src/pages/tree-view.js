import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tree from '../components/tree';
import {
  getSources,
  getServiceOfferingNodes,
  getServiceInstanceNodes,
  getServiceInventories,
  getServiceInstance,
  getServicePlans,
  getServiceOfferings,
} from '../api/ansible-tower';
import { UPDATE_NODE, SET_DATA } from '../store/action-types/sources-action-types';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import CardLoader from '../components/loaders/card-loader';
import { paths } from '../routes';
import DetailDrawer from '../components/detail-drawer';
import { getSourcesTypes, getSourceTypes } from '../api/sources';
import {
  getVms,
  getSecurityGroups,
  getTags,
  getNetworkAdapters,
  // getPrivateIpAddresses,
  // getPublicIpAddresses,
} from '../api/amazon';

const promisesMapper = (id, typeName, dispatch) => {
  switch (typeName) {
    case 'ansible-tower':
      return [
        getServiceOfferings(id).then((data) =>
          dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'service-offerings', data } })
        ),
        getServicePlans(id).then((data) =>
          dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'service-plans', data } })
        ),
        getServiceInstance(id).then((data) =>
          dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'service-instances', data } })
        ),
        getServiceInventories(id).then((data) =>
          dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'service-inventories', data } })
        ),
        getServiceInstanceNodes(id).then((data) =>
          dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'service-instance-nodes', data } })
        ),
        getServiceOfferingNodes(id).then((data) =>
          dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'service-offering-nodes', data } })
        ),
      ];
    case 'amazon':
      return [
        getVms(id)
          .then((data) => {
            dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'vms', data } });

            return data.data;
          })
          .then((data) => {
            const promises = data.map(({ id }) => {
              const subCollections = [
                getSecurityGroups(id).then((data) =>
                  dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'security-groups', data } })
                ),
                getTags(id).then((data) => dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'tags', data } })),
                getNetworkAdapters(id).then((data) =>
                  dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'network-adapters', data } })
                ),
                /*getPrivateIpAddresses(id).then((data) =>
                  dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'private-ip-addresses', data } })
                ),
                getPublicIpAddresses(id).then((data) =>
                  dispatch({ type: UPDATE_NODE, id, subCollections: { type: 'public-ip-addresses', data } })
                ),*/
              ];

              return Promise.all(subCollections);
            });

            return Promise.all(promises);
          }),
      ];
    default:
      return [];
  }
};

function createNodeData(node, type) {
  if (!node) {
    return;
  }

  const copy = {};
  if (node.subCollections) {
    node.subCollections.forEach((collection) => {
      copy.children = [
        ...(copy.children || []),
        {
          id: `sub-collection-${collection.type}`,
          title: collection.type,
          children: collection.data.data.map((child) => createNodeData(child, collection.type)),
        },
      ];
    });
  }

  return {
    ...copy,
    id: node.id,
    title: node.name || node.id || node[Object.keys(node)[0]],
    ...(type && { type }),
    ...(node.entityType && { type: node.entityType }),
    nodeData: node,
  };
}

function createTreeData(sources) {
  if (!sources?.data) {
    return;
  }

  return sources.data.map((source) => createNodeData(source));
}

const TreeView = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const structure = useSelector(({ sourcesReducer }) => sourcesReducer);

  useEffect(() => {
    if (!structure?.data || structure?.data?.length === 0) {
      setLoading(true);
      Promise.all([getSources(), getSourceTypes()])
        .then(async ([sources, sourceTypes]) => {
          const data = Array.isArray(sources.data) ? sources.data : [sources];

          const sourcesTypes = await getSourcesTypes(data.map(({ id }) => id));

          const modifiedData = data.map((d) => ({
            ...d,
            entityType: 'sources',
            source_type_id: sourcesTypes.data.sources.find(({ id }) => id === d.id)?.source_type_id,
            source_type_name: sourceTypes.data.find(
              ({ id }) => id === sourcesTypes.data.sources.find(({ id }) => id === d.id)?.source_type_id
            )?.name,
          }));

          dispatch({
            type: SET_DATA,
            payload: {
              ...data,
              data: modifiedData,
            },
          });

          return modifiedData;
        })
        .then((sources) => {
          const promises = sources.map(({ id, source_type_name }) => {
            const subCollections = promisesMapper(id, source_type_name, dispatch);

            return Promise.all(subCollections).then(() => setLoading(false));
          });
          return Promise.all(promises);
        });
    }
  }, []);

  if (loading) {
    return <CardLoader />;
  }

  const { entityType, subCollections, ...restOfData } = data;

  const treeData = createTreeData(structure);
  return (
    <DetailDrawer open={open} data={restOfData} setOpen={setOpen}>
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
          <Tree
            data={treeData}
            render={({ title, type, nodeData }) =>
              type ? (
                <a
                  onClick={() => {
                    setData({ type, entityType, ...nodeData });
                    setOpen(true);
                  }}
                >
                  {title}
                </a>
              ) : (
                <span>{title}</span>
              )
            }
          />
        </CardBody>
      </Card>
    </DetailDrawer>
  );
};

export default TreeView;
