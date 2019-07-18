/** Exercise exposed types/imports for different tsconfig esmoduleinterop settings */

/* esModuleInterop: false (default), allowSyntheticDefaultImports: false (default) */
import * as i18next from 'i18next';

i18next.init();

const interpolator: i18next.Interpolator = i18next.services.interpolator;

const mockWithT: i18next.WithT = {
  t: ((key: string) => key) as any,
};

const modules: i18next.Modules = { external: [] };
