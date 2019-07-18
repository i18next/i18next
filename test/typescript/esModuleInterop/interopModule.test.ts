// This file uses <root>/tsconfig.esModuleInterop.json typescript configuration
// VSCode doesn't support a specific tsconfig for a specific file,
// so this code will fail on vscode lint. It works on tests
import i18next, { Interpolator, WithT, Modules } from 'i18next';

i18next.init();

const interpolator: Interpolator = i18next.services.interpolator;

const mockWithT: WithT = {
  t: ((key: string) => key) as any,
};

const modules: Modules = { external: [] };
