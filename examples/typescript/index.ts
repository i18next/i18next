import i18next from 'i18next';
import './i18n/config';

console.log(i18next.t('ns1:title'));
// console.log(i18next.t('title'));
console.log(i18next.t('ns1:description.part1'));
console.log(i18next.t('ns1:description.part2'));
console.log(i18next.t('ns2:description.part2'));
console.log(i18next.t('description.part2', { ns: 'ns2' }));
