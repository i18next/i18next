import * as i18next from 'i18next';

const backendModule = {
  type: 'backend' as 'backend',
  init: () => null,
  read: () => null,
  create: () => null,
  readMulti: () => null,
  save: () => null,
};

const languageDetectorModule = {
  type: 'languageDetector' as 'languageDetector',
  init: () => null,
  detect: () => '',
  cacheUserLanguage: () => null,
};

const loggerModule = {
  type: 'logger' as 'logger',
  log: () => null,
  warn: () => null,
  error: () => null,
};

const i18nFormatModule = {
  type: 'i18nFormat' as 'i18nFormat',
};

const thirdPartyModule = {
  type: '3rdParty' as '3rdParty',
  init: () => null,
};

const externalModules = [thirdPartyModule];

i18next.modules = {
  backend: backendModule,
  languageDetector: languageDetectorModule,
  i18nFormat: i18nFormatModule,
  logger: loggerModule,
  external: externalModules,
};
