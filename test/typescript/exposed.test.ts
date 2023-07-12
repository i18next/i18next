/** Exercise exposed types/imports for different tsconfig esmoduleinterop settings */

/* esModuleInterop: true, allowSyntheticDefaultImports: true */
import i18next, { Interpolator, Modules, WithT, ResourceStore, Formatter } from 'i18next';

i18next.init();

const interpolator: Interpolator = i18next.services.interpolator;

const mockWithT: WithT = {
  t: ((key: string) => key) as any,
};

const modules: Modules = { external: [] };

const resourceStore: ResourceStore = i18next.services.resourceStore;
resourceStore.on('added', console.log);
resourceStore.off('added', console.log);
resourceStore.off('added');
resourceStore.data['en'];

const formatter: Formatter | undefined = i18next.services.formatter;
formatter!.add('test', (value: any, lng: string | undefined, options: any) => 'formatted');
formatter!.addCached(
  'test',
  (lng: string | undefined, options: any) => (value: any) => 'formatted',
);

i18next.on('custom', (arg) => {});
i18next.emit('custom');
i18next.emit('custom', { some: 'opt' });
i18next.emit('custom', { some: 'opt' }, { more: 'stuff' });
