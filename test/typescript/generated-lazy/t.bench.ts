import { bench } from '@arktype/attest';
import * as i18next from 'i18next';
import {} from './i18next';

declare const t: i18next.TFunction;

bench('many keys benchmark', () => {
  t('$8.$.GhmK1$t$3$.$$4G$6$$lt.P4W2o9yG2QU.c6Kz.$7k$yKk$33$.$5A6i0Q.$$$i$dc14p');
}).types([771, 'instantiations']);
