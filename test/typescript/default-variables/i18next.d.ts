import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    strictInterpolationChecks: true;
    defaultVariables: { appName: string; user: { name: string } };
    interpolationFormatSeparator: ';';
    defaultNS: 'app';
    resources: {
      app: {
        title: 'Settings';
        welcome: 'Welcome to {{appName}}';
        greeting: 'Hello {{user.name}} from {{appName}}';
        mixed: '{{appName}}: {{count}} new';
        price: 'Costs {{amount; currency}}';
        item_one: '{{count}} item';
        item_other: '{{count}} items';
        nested: { label: 'Label'; hint: 'Hi {{who}}' };
      };
    };
  }
}
