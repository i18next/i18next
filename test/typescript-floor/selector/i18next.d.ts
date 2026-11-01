import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    enableSelector: true;
    resources: {
      translation: {
        plain: 'Plain';
        greeting: 'Hello {{name}}';
        item_one: '{{count}} item';
        item_other: '{{count}} items';
        nested: { deep: 'Deep' };
      };
    };
  }
}
