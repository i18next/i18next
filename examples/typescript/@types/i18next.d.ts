import { resources, defaultNS } from '../i18n/config';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['en'];
    // resources: {
    //   ns1: {
    //     "title": "Welcome!",
    //     "description": {
    //       "part1": "This is just a basic example of how to use i18next with typescript",
    //       "part2": "😉"
    //     },
    //     "inter": "interpolated {{val}}"
    //   };
    //   // ns1: typeof resources['en']['ns1'];
    //   ns2: typeof resources['en']['ns2'];
    // };
  }
}
