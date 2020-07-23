import { getAxtionsInstace } from './api';
import { TOPOLOGICAL_INVETORY_API_BASE } from '../constants/api-constants';

// level 1

export const getVms = (id) => getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/sources/${id}/vms?limit=4`);

// level 2 vms / id / type

export const getSecurityGroups = (id) =>
  getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/vms/${id}/security_groups`);
export const getTags = (id) => getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/vms/${id}/tags`);
export const getNetworkAdapters = (id) =>
  getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/vms/${id}/network_adapters`);
export const getPrivateIpAddresses = (id) =>
  getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/vms/${id}/private_ipaddresses`);
export const getPublicIpAddresses = (id) =>
  getAxtionsInstace().get(`${TOPOLOGICAL_INVETORY_API_BASE}/vms/${id}/public_ipaddresses`);
