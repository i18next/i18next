/** Exercise exposed types/imports for different tsconfig esmoduleinterop settings */

// This file uses <root>/tsconfig.esModuleInterop.json typescript configuration
// VSCode doesn't support a specific tsconfig for a specific file,
// so this code may fail on vscode lint. It works on tests.

/* esModuleInterop: true, allowSyntheticDefaultImports: true */
import i18next, { Interpolator, Modules, WithT } from 'i18next';

i18next.init();

const interpolator: Interpolator = i18next.services.interpolator;

const mockWithT: WithT = {
  t: ((key: string) => key) as any,
};

const modules: Modules = { external: [] };
