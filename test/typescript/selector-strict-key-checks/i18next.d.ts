import 'i18next';

import {
  TestNamespaceCustom,
  TestNamespaceCustomAlternate,
  TestNamespaceFallback,
  TestNamespaceInterpolators,
} from '../test.namespace.samples';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictKeyChecks: true;
    // the v26 default, to cover the types without the checks (on by default since v27)
    strictInterpolationChecks: false;
    defaultNS: 'custom';
    fallbackNS: 'fallback';
    enableSelector: true;
    resources: {
      custom: TestNamespaceCustom;
      alternate: TestNamespaceCustomAlternate;
      fallback: TestNamespaceFallback;
      interpolators: TestNamespaceInterpolators;
      arrayKeys: {
        arrayOfStrings: ['zero', 'one'];
        readonlyArrayOfStrings: readonly ['readonly zero', 'readonly one'];
        arrayOfObjects: [
          { foo: 'bar' },
          { fizz: 'buzz' },
          [{ test: 'success'; sub: { deep: 'still success' } }],
        ];
      };
    };
  }
}
