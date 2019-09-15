import i18next, {
  Modules,
  BackendModule,
  LanguageDetectorModule,
  LoggerModule,
  I18nFormatModule,
  ThirdPartyModule,
} from 'i18next';

// declare modules in a way that the `type` is not widened
// @see https://github.com/microsoft/TypeScript/issues/20271#issuecomment-347020203

const backendModule: BackendModule = {
  type: 'backend',
  init: () => null,
  read: (_language, _namespace, callback) => {
    callback(null, {
      key: 'value',
    });
  },
  create: () => null,
  readMulti: (_languages, _namespaces, callback) => {
    callback(null, {
      en: {
        namespace: {
          key: 'value',
        },
      },
    });
  },
  save: () => null,
};

const languageDetectorModule: LanguageDetectorModule = {
  type: 'languageDetector',
  init: () => null,
  detect: () => '',
  cacheUserLanguage: () => null,
};

const loggerModule: LoggerModule = {
  type: 'logger',
  log: () => null,
  warn: () => null,
  error: () => null,
};

const i18nFormatModule: I18nFormatModule = {
  type: 'i18nFormat',
};

const thirdPartyModule: ThirdPartyModule = {
  type: '3rdParty',
  init: () => null,
};

const externalModules = [thirdPartyModule];

const modules: Modules = {
  backend: backendModule,
  languageDetector: languageDetectorModule,
  i18nFormat: i18nFormatModule,
  logger: loggerModule,
  external: externalModules,
};

i18next.use(backendModule);
i18next.use(languageDetectorModule);
i18next.use(loggerModule);
i18next.use(i18nFormatModule);
i18next.use(externalModules);

// exercise class usage
class MyLoggerModule implements LoggerModule {
  type: 'logger' = 'logger';
  log = () => null;
  warn = () => null;
  error = () => null;
}

i18next.use(MyLoggerModule);
