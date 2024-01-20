import 'i18next';

import {
  TestNamespaceCustom,
  TestNamespaceCustomAlternate,
  TestNamespaceFallback,
  TestNamespaceNonPlurals,
} from '../test.namespace.samples';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    fallbackNS: 'fallback';
    jsonFormat: 'v3';
    resources: {
      custom: TestNamespaceCustom;

      fallback: TestNamespaceFallback;

      alternate: TestNamespaceCustomAlternate;

      plurals: {
        foo: 'foo';
        foo_1: 'foo';
        foo_2: 'foo';
        foo_plural: 'foo';
      };

      nonPlurals: TestNamespaceNonPlurals;

      ctx: {
        foo: 'foo';
        foo_plural: 'foos';
        dessert_cake: 'a nice cake';
        dessert_muffin: 'a nice muffin';
        dessert_muffin_plural: '{{count}} nice muffins';
      };

      ord: {
        place_ordinal_1: '1st place';
        place_ordinal_2: '2nd place';
        place_ordinal_3: '3rd place';
        place_ordinal_plural: '{{count}}th place';
      };
    };
  }
}
