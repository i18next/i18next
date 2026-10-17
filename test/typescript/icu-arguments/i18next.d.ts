import 'i18next';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'custom';
    parseInterpolation: 'icu';
    resources: {
      custom: {
        greeting: 'Hello {name}!';
        spaced: 'Hello { name }!';
        rows: '{count, plural, one {{count} row} other {{count} rows}}';
        hash: '{count, plural, =0 {no rows} one {# row} other {# rows}}';
        ordinal: 'You are {place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}';
        gender: '{gender, select, male {He} female {She} other {They}} liked it';
        nested: '{gender, select, male {{name} and his {count, plural, one {# cat} other {# cats}}} other {{name} and their pets}}';
        price: 'Price: {amount, number, ::currency/EUR}';
        typed: '{n, number} on {d, date, short} at {t, time}';
        tags: 'Welcome back, <bold>{name}</bold>!';
        quoted: "It''s '{literal}' for {name}";
        plain: 'Just a plain string';
        deep: {
          inner: 'Inner {value}';
        };
      };
      other: {
        welcome: 'Welcome {user}';
      };
    };
  }
}
