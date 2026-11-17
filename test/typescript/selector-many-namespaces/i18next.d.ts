import 'i18next';
import extraLarge from '../test.namespace.extra-large.json';

type Data = typeof extraLarge;

/** Key paths exactly `Depth['length']` levels below `T`, as tuples. */
type PathsAt<T, Depth extends unknown[]> = Depth extends [unknown, ...infer Rest]
  ? {
      [K in keyof T & string]: T[K] extends object ? [K, ...PathsAt<T[K], Rest>] : never;
    }[keyof T & string]
  : [];

type Join<P> = P extends [infer Head extends string, ...infer Tail]
  ? Tail extends []
    ? Head
    : `${Head}-${Join<Tail>}`
  : never;

type Get<T, P> = P extends [infer Head extends keyof T, ...infer Tail] ? Get<T[Head], Tail> : T;

/**
 * Flattens the four levels below `T` into one object keyed by their path: 3^4 =
 * 81 groups side by side, each still an object of 3 strings. Real apps have
 * objects that wide (long lists of captions, enum labels, ...); the
 * extra-large fixture, a ternary tree, has none of its own.
 */
type Wide<T> = {
  [P in PathsAt<T, [1, 1, 1, 1]> as Join<P>]: Get<T, P>;
};

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ns0';
    enableSelector: true;
    // 32 namespaces, each a different subtree of the same fixture: about
    // 7.8k keys in total, the size of a mid-sized app.
    resources: {
      ns0: Wide<Data['$$$']['D_8']['_']['EN_0OP_4$']>;
      ns1: Wide<Data['$$$']['D_8']['_']['a']>;
      ns2: Wide<Data['$$$']['D_8']['_']['NB6nS2LKbr']>;
      ns3: Wide<Data['$$$']['D_8']['_ja_cal__']['a']>;
      ns4: Wide<Data['$$$']['D_8']['_ja_cal__']['B$9_r_BR_']>;
      ns5: Wide<Data['$$$']['D_8']['_ja_cal__']['Y_C_']>;
      ns6: Wide<Data['$$$']['D_8']['$construct']['___H$$_$']>;
      ns7: Wide<Data['$$$']['D_8']['$construct']['$At']>;
      ns8: Wide<Data['$$$']['D_8']['$construct']['$N_1']>;
      ns9: Wide<Data['$$$']['$']['bvalueofe0CM']['A6']>;
      ns10: Wide<Data['$$$']['$']['bvalueofe0CM']['Czo_YE']>;
      ns11: Wide<Data['$$$']['$']['bvalueofe0CM']['A$r$3']>;
      ns12: Wide<Data['$$$']['$']['v_']['Al']>;
      ns13: Wide<Data['$$$']['$']['v_']['_']>;
      ns14: Wide<Data['$$$']['$']['v_']['NprtoL']>;
      ns15: Wide<Data['$$$']['$']['ZiUs9h2$$2']['C']>;
      ns16: Wide<Data['$$$']['$']['ZiUs9h2$$2']['$name']>;
      ns17: Wide<Data['$$$']['$']['ZiUs9h2$$2']['e']>;
      ns18: Wide<Data['$$$']['__$73n$']['_c']['c8']>;
      ns19: Wide<Data['$$$']['__$73n$']['_c']['$caller']>;
      ns20: Wide<Data['$$$']['__$73n$']['_c']['_toString']>;
      ns21: Wide<Data['$$$']['__$73n$']['Za_1']['____']>;
      ns22: Wide<Data['$$$']['__$73n$']['Za_1']['JhQ']>;
      ns23: Wide<Data['$$$']['__$73n$']['Za_1']['_WcuGg0J']>;
      ns24: Wide<Data['$$$']['__$73n$']['a']['$prototypep']>;
      ns25: Wide<Data['$$$']['__$73n$']['a']['$L']>;
      ns26: Wide<Data['$$$']['__$73n$']['a']['Y$_$$0Z$8']>;
      ns27: Wide<Data['z2_mA5z$']['Zb1']['$']['d2_$y']>;
      ns28: Wide<Data['z2_mA5z$']['Zb1']['$']['_key']>;
      ns29: Wide<Data['z2_mA5z$']['Zb1']['$']['Dw']>;
      ns30: Wide<Data['z2_mA5z$']['Zb1']['_4qq_7$']['W_5v']>;
      ns31: Wide<Data['z2_mA5z$']['Zb1']['_4qq_7$']['$']>;
    };
  }
}
