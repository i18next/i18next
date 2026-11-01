import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictInterpolationChecks: true;
    defaultVariables: { appName: string };
    resources: {
      translation: {
        plain: 'Plain';
        greeting: 'Hello {{name}}';
        welcome: 'Welcome to {{appName}}';
        price: 'Costs {{amount, currency}}';
        item_one: '{{count}} item';
        item_other: '{{count}} items';
        nested: { deep: 'Deep' };
      };
      other: { key: 'Other' };
    };
  }
}
