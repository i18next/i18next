import type { PathOf, ParseKeys } from 'i18next';
import { t } from 'i18next';
import {} from './i18next';
import type { TestNamespaceManyKeys } from '../test.namespace.many-keys';

const getKey = <Key extends string>(key: PathOf<[TestNamespaceManyKeys], Key>) => key;
const result = t(getKey('0IfXxW'));

// eslint-disable-next-line no-console
console.info(result);
