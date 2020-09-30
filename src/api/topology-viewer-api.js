import { getAxtionsInstace } from './api';
import { TOPOLOGICAL_INVETORY_API_BASE } from '../constants/api-constants';

const API = getAxtionsInstace();

export const structureNode = {
  name: 'sources',
  transformLabel: (node, sourceTypes) =>
    `${node.name} (${sourceTypes?.find(({ id }) => id === node.source_type_id)?.product_name || node.source_type_id})`,
  children: [
    {
      name: 'service_offerings',
      label: 'Service offerings',
      attributes: ['name'],
    },
    {
      name: 'service_plans',
      label: 'Service plans',
      attributes: ['name'],
    },
    {
      name: 'service_instances',
      label: 'Service instances',
      attributes: ['name'],
    },
    {
      name: 'service_inventories',
      label: 'Service inventories',
      attributes: ['name'],
    },
    {
      name: 'service_instance_nodes',
      label: 'Service instance nodes',
      attributes: ['name'],
    },
    {
      name: 'service_offering_nodes',
      label: 'Service offering nodes',
      attributes: ['name'],
    },
    {
      name: 'vms',
      label: 'Virtual machines',
      attributes: ['name'],
      children: [
        {
          name: 'network_adapters',
          label: 'Network adapters',
        },
        {
          name: 'security_groups',
          label: 'Security groups',
          attributes: ['name'],
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
