import 'i18next';

import { TestNamespaceManyKeys } from '../test.namespace.many-keys';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'generic';
    returnObjects: true;
    returnNull: false;
    strictKeyChecks: true;
    resources: {
      generic: TestNamespaceManyKeys;
    };
  }
}
