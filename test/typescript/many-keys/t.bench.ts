import { bench } from '@arktype/attest';
import * as i18next from 'i18next';
import {} from './i18next';

declare const t: i18next.TFunction;

bench('many keys benchmark', () => {
  t('0IfXxW');
}).types([94097, 'instantiations']);
