import i18next from './i18next.js';
import keyFromSelector from './selector.js';
import { isSafeLanguageCode } from './utils.js';

i18next.keyFromSelector = keyFromSelector;
i18next.isSafeLanguageCode = isSafeLanguageCode;

// for cjs there is just 1 default export, no named exports
export default i18next;
