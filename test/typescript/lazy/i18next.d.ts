import 'i18next';
import { translations } from '../test.namespace.generated';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnObjects: true;
    resources: { translation: typeof translations };
  }
}
