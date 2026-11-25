import 'i18next';

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Group = {
  key0: 'value';
  key1: 'value';
  key2: 'value';
  key3: 'value';
  key4: 'value';
  key5: 'value';
  key6: 'value';
  key7: 'value';
  key8: 'value';
  key9: 'value';
  status_active: 'active';
  status_inactive: 'inactive';
  place_first_ordinal_one: '{{count}}st';
  place_first_ordinal_other: '{{count}}th';
};
/** 100 groups of 14 keys */
type Large = { [G in `group${Digit}${Digit}`]: Group };

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ns0';
    fallbackNS: 'common';
    resources: {
      ns0: Large;
      ns1: Large;
      ns2: Large;
      ns3: Large;
      ns4: Large;
      common: {
        shared_on: 'on';
        shared_off: 'off';
        plain: 'plain';
        plain_special: 'special';
        box: { title: 'Title' };
        box_special: 'special';
        'a.b': { c_x: 'x' };
      };
    };
  }
}
