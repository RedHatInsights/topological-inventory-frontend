import { getAxtionsInstace } from './api';
import { SOURCES_API_BASE } from '../constants/api-constants';

export const getSourcesTypes = (ids) =>
  getAxtionsInstace()
    .post(`${SOURCES_API_BASE}/graphql`, {
      query: `{ sources( filter: { id: { eq: [${ids}] } } )
        { id, source_type_id, name }
    }`,
    })
    .then(({ data }) => data);

export const getSourceTypes = () => getAxtionsInstace().get(`${SOURCES_API_BASE}/source_types`);
