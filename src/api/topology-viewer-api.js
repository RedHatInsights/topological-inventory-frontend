import { getAxtionsInstace } from './api';
import { TOPOLOGICAL_INVETORY_API_BASE } from '../constants/api-constants';

const API = getAxtionsInstace();

export const structureNode = {
  name: 'sources',
  topologyViewNode: {
    nodeShape: 'hexagon',
    nodeType: 'source',
  },
  transformLabel: (node, sourceTypes) =>
    `${node.name} (${sourceTypes?.find(({ id }) => id === node.source_type_id)?.product_name || node.source_type_id})`,
  children: [
    {
      name: 'service_offerings',
      label: 'Service offerings',
      attributes: ['name'],
      topologyViewNode: {
        nodeShape: 'square',
        nodeType: 'serviceOfferings',
      },
    },
    {
      name: 'service_plans',
      label: 'Service plans',
      attributes: ['name'],
      topologyViewNode: {
        nodeShape: 'square',
        nodeType: 'servicePlans',
      },
    },
    {
      name: 'service_instances',
      label: 'Service instances',
      attributes: ['name'],
      topologyViewNode: {
        nodeShape: 'square',
        nodeType: 'serviceInstances',
      },
    },
    {
      name: 'service_inventories',
      label: 'Service inventories',
      attributes: ['name'],
      topologyViewNode: {
        nodeShape: 'square',
        nodeType: 'serviceInventories',
      },
    },
    {
      name: 'service_instance_nodes',
      label: 'Service instance nodes',
      attributes: ['name'],
      topologyViewNode: {
        nodeShape: 'square',
        nodeType: 'serviceInstanceNodes',
      },
    },
    {
      name: 'service_offering_nodes',
      label: 'Service offering nodes',
      attributes: ['name'],
      topologyViewNode: {
        nodeShape: 'square',
        nodeType: 'serviceOfferingsNode',
      },
    },
    {
      name: 'source_regions',
      label: 'Source regions',
      attributes: ['name'],
      children: [
        {
          name: 'networks',
          label: 'Networks',
          attributes: ['name'],
          children: [
            {
              name: 'subnets',
              label: 'Subnets',
              attributes: ['name'],
            },
          ],
        },
        {
          name: 'vms',
          label: 'Virtual machines',
          attributes: ['name'],
          children: [
            {
              name: 'network_adapters',
              label: 'Network adapters',
              attributes: ['mac_address'],
              children: [
                {
                  name: 'ipaddresses',
                  label: 'IP addresses',
                  attributes: ['ipaddress'],
                },
              ],
            },
            {
              name: 'security_groups',
              label: 'Security groups',
              attributes: ['name'],
            },
            {
              name: 'volumes',
              label: 'Volumes',
              attributes: ['name'],
            },
          ],
        },
      ],
    },
  ],
};

const createGraphQL = (node) =>
  `${node.name} {id,${node.attributes ? node.attributes : ''},${
    node.children ? node.children.map((child) => createGraphQL(child)) : ''
  }}`;

const loadSourceQuery = `{${createGraphQL(structureNode)}}`;

export const loadSources = () =>
  API.post(`${TOPOLOGICAL_INVETORY_API_BASE}/graphql`, {
    query: loadSourceQuery,
  }).then(({ data }) => data);
