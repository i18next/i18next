import { t, ParseKeys } from 'i18next';

const getKey: () => ParseKeys<['generic']> = () => 'ahTLUS';
const result = t(getKey());

// eslint-disable-next-line no-console
console.info(result);
