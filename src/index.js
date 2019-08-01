import i18next from './i18next.js';

export default i18next;

// expose the following in the rollup bundle for downstream testing e.g. i18next-xhr-backend
export { default as BackendConnector } from './BackendConnector';
export { default as Interpolator } from './Interpolator';
export { default as ResourceStore } from './ResourceStore';
