import i18next, {
  Modules,
  BackendModule,
  LanguageDetectorModule,
  LoggerModule,
  I18nFormatModule,
  ThirdPartyModule,
  FormatterModule,
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

const formatterModule: FormatterModule = {
  type: 'formatter',
  init: () => null,
  add: () => null,
  addCached: () => () => null,
  format: () => '',
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
  formatter: formatterModule,
  external: externalModules,
};

i18next.use(backendModule);
i18next.use(languageDetectorModule);
i18next.use(loggerModule);
i18next.use(i18nFormatModule);
i18next.use(formatterModule);
i18next.use(thirdPartyModule);

// exercise class usage
// Need both static and member definitions of type to satisfy use() signature, see #1442
class MyLoggerModule implements LoggerModule {
  static type: 'logger' = 'logger';
  type: 'logger' = 'logger';
  log = () => null;
  warn = () => null;
  error = () => null;
}

i18next.use(MyLoggerModule);
