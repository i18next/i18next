import 'i18next';

import { TestNamespaceCustom, TestNamespaceInterpolators } from '../test.namespace.samples';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictKeyChecks: true;
    // strictInterpolationChecks: true is the default since v27
    defaultNS: 'custom';
    resources: {
      custom: TestNamespaceCustom;
      interpolators: TestNamespaceInterpolators;
    };
  }
}
