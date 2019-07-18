/** Exercise exposed types/imports for different tsconfig esmoduleinterop settings */

/* esModuleInterop: false (default), allowSyntheticDefaultImports: false (default) */
import i18next, { Interpolator, Modules, WithT } from 'i18next';

i18next.init();

const interpolator: Interpolator = i18next.services.interpolator;

const mockWithT: WithT = {
  t: ((key: string) => key) as any,
};

const modules: Modules = { external: [] };
