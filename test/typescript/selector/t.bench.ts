import { bench } from '@arktype/attest';
import {} from './i18next';
import type { TFunction } from 'i18next';

declare const t: TFunction;

bench('', () => {
  t(($) => $.coffee.bar['espresso|cappuccino']);
}).types([5549, 'instantiations']);
