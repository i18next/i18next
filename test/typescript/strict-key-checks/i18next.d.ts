import 'i18next';

import {
  TestNamespaceCustom,
  TestNamespaceCustomAlternate,
  TestNamespaceFallback,
} from '../test.namespace.samples';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictKeyChecks: true;
    defaultNS: 'custom';
    fallbackNS: 'fallback';
    resources: {
      custom: TestNamespaceCustom;
      alternate: TestNamespaceCustomAlternate;
      fallback: TestNamespaceFallback;
    };
  }
}
