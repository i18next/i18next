import 'i18next';

// The same resources twice: as named interfaces, which have no implicit index
// signature, and as type aliases. Both must give the same key types.
interface Deeper {
  leaf: 'deeper leaf';
}

export interface Nested {
  key: 'nested key';
  deeper: Deeper;
}

interface Messages {
  key: 'top key';
  nested: Nested;
  list: readonly ['first', 'second'];
}

type MessagesAlias = {
  key: 'top key';
  nested: { key: 'nested key'; deeper: { leaf: 'deeper leaf' } };
  list: readonly ['first', 'second'];
};

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'iface';
    resources: {
      iface: Messages;
      alias: MessagesAlias;
      // values that are not plain nested objects stay as they were before interfaces got walked into
      loose: { when: Date; fn: () => string; label: 'Label' };
    };
  }
}
