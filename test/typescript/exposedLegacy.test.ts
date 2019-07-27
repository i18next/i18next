/**
 * Exercise exposed types/imports for different tsconfig esmoduleinterop settings
 *
 * NOTE: this is not the preferred import syntax, this just exercises the old syntax with changes.
 */

/* esModuleInterop: true, allowSyntheticDefaultImports: true */
import * as i18next from 'i18next';

i18next.init();

const interpolator: i18next.Interpolator = i18next.services.interpolator;

const mockWithT: i18next.WithT = {
  t: ((key: string) => key) as any,
};

const modules: i18next.Modules = { external: [] };
