import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    interpolationValueType: string;
    resources: {
      custom: {
        greeting: 'Hello {{name}}!';
        count_message: 'You have {{count, number}} items';
        nested: 'Value is {{deep.val}}';
        no_interpolation: 'Just a plain string';
      };
    };
  }
}
