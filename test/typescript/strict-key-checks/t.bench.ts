import { bench } from '@arktype/attest';
import * as i18next from 'i18next';
import {} from './i18next';

declare const t: i18next.TFunction;

bench('strict key checks benchmark', () => {
  t('bar');
}).types([30893, 'instantiations']);
