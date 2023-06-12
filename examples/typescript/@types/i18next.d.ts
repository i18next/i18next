import { resources, defaultNS } from '../i18n/config';
import Resources from './resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;

    // the resources.d.ts file is generated with npm run
    resources: Resources;

    // if type safe interpolation is not necessay:
    // resources: (typeof resources)['en'];
  }
}
