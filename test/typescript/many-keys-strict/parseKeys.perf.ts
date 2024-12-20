import { t, ParseKeys } from 'i18next';

const getKey: () => ParseKeys<['generic']> = () => 'ahTLUS';
const result = t(getKey());
const result2 = t(getKey(), 'default value');
const result3 = t(getKey(), { defaultValue: 'default value' });

// eslint-disable-next-line no-console
console.info(result);
// eslint-disable-next-line no-console
console.info(result2);
// eslint-disable-next-line no-console
console.info(result3);
