import { bench } from '@arktype/attest';
import * as i18next from 'i18next';
import * as _ from './i18next';

declare const t: i18next.TFunction;

bench('many keys benchmark (lazy)', () => {
  t('0IfXxW');
}).types([321, 'instantiations']);
