import 'i18next';

import { TestNamespaceCustom, TestNamespaceInterpolators } from '../test.namespace.samples';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictInterpolationChecks: true;
    defaultNS: 'custom';
    resources: {
      custom: TestNamespaceCustom;
      interpolators: TestNamespaceInterpolators;
    };
  }
}
