import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: {
        title: 'Title';
        greeting: 'Hello {{name}}';
        nested: { key: 'nested key'; deeper: { leaf: 'deeper leaf' } };
        friend: 'A friend';
        friend_male: 'A boyfriend';
      };
      other: {
        label: 'Other label';
      };
    };
  }
}
