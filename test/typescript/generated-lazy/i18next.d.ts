import 'i18next';
import translation from '../test.namespace.generated';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnObjects: true;
    resources: { translation: typeof translation };
  }
}
