import 'i18next';

import {
  TestNamespaceContext,
  TestNamespacePlurals,
  TestNamespaceOrdinal,
  TestNamespaceCustom,
  TestNamespaceCustomAlternate,
  TestNamespaceFallback,
  TestNamespaceNonPlurals,
  TestNamespaceInterpolators,
  TestNamespaceContextAlternate,
} from '../test.namespace.samples';

declare module 'i18next' {
  interface CustomTypeOptions {
    // the v26 default, to cover the types without the checks (on by default since v27)
    strictInterpolationChecks: false;
    defaultNS: 'custom';
    fallbackNS: 'fallback';
    resources: {
      custom: TestNamespaceCustom;

      alternate: TestNamespaceCustomAlternate;

      fallback: TestNamespaceFallback;

      ctx: TestNamespaceContext;
      ctxAlternate: TestNamespaceContextAlternate;

      plurals: TestNamespacePlurals;

      nonPlurals: TestNamespaceNonPlurals;

      ord: TestNamespaceOrdinal;

      interpolator: TestNamespaceInterpolators;
    };
  }
}
