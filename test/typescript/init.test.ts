import i18next, { TFunction } from 'i18next';

// i18next.js export default as esm module because the build is apart from commonjs.
i18next.init(
  {
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          key: 'hello world',
        },
        key: 'hello world',
      },
    },
    ignoreJSONStructure: false,
  },
  (err, t) => {
    // initialized and ready to go!
    const value: string = t('key');
  },
);

i18next.init({ initImmediate: false });

i18next.init(
  {
    lng: 'en',
    debug: true,
    resources: {
      en: {
        translation: {
          key: 'hello world',
        },
      },
      de: {
        translation: {
          key: 'hello welt',
        },
      },
    },
    ignoreJSONStructure: true,
  },
  // not necessary but check a non-inferred arg for paranoia's sake
  (err, t: TFunction) => {
    // init set content
    updateContent();
  },
);

i18next.init(
  {
    ns: ['common', 'moduleA', 'moduleB'],
    defaultNS: 'moduleA',
  },
  (err, t) => {
    t('myKey'); // key in moduleA namespace (defined default)
    t('common:myKey'); // key in common namespace
  },
);

i18next.loadNamespaces('anotherNamespace', (err, t) => {
  /* ... */
});

// fallback to one language
i18next.init(
  {
    lng: 'en-GB',
  },
  () => {
    i18next.t('i18n'); // -> "Internationalisation"
    i18next.t('i18n_short'); // -> "i18n" (from en.json)

    // force loading en
    i18next.t('i18n', { lng: 'en' }); // -> "Internationalization"
  },
);

// fallback to one language
i18next.init({
  fallbackLng: 'en',
});

// fallback ordered
i18next.init({
  fallbackLng: ['fr', 'en'],
});

// fallback depending on user language
i18next.init({
  fallbackLng: {
    'de-CH': ['fr', 'it'],
    'zh-HANT': ['zh-HANS', 'en'],
    es: ['fr'],
    default: ['en'],
  },
});

const updateContent = () => {
  const value: string = i18next.t('key');
};

const changeLng = (lng: string) => {
  i18next.changeLanguage(lng);
};

i18next.init(
  {
    // files to load
    ns: ['app', 'common'],

    // default namespace (needs no prefix on calling t)
    defaultNS: 'app',

    // fallback, can be a string or an array of namespaces
    fallbackNS: 'common',
  },
  () => {
    i18next.t('title'); // -> "i18next"

    i18next.t('button.save'); // -> "save" (fallback from common)

    // without fallbackNS you would have to prefix namespace
    // to access keys in that namespace
    i18next.t('common:button.save'); // -> "save"
  },
);

i18next.init({
  lng: 'de',

  // allow keys to be phrases having `:`, `.`
  nsSeparator: false,
  keySeparator: false,

  // do not load a fallback
  fallbackLng: false,
});

const languageChangedCallback = () => {
  updateContent();
};

i18next.on('languageChanged', languageChangedCallback);
i18next.off('languageChanged', languageChangedCallback);

i18next.init(
  {
    fallbackLng: 'en',
    debug: true,
    ns: ['special', 'common'],
    defaultNS: 'special',
    backend: {
      // load from i18next-gitbook repo
      loadPath:
        'https://raw.githubusercontent.com/i18next/i18next-gitbook/master/locales/{{lng}}/{{ns}}.json',
      crossDomain: true,
    },
  },
  (err, t) => {
    // init set content
    updateContent2();
  },
);

// just set some content and react to language changes
// could be optimized using vue-i18next, jquery-i18next, react-i18next, ...
const updateContent2 = () => {
  const value: string = i18next.t('title', { what: 'i18next' });
  const value2: string = i18next.t('common:button.save', {
    count: Math.floor(Math.random() * 2 + 1),
  });
  const value3 = `detected user language: "${
    i18next.language
  }"  --> loaded languages: "${i18next.languages.join(', ')}"`;
};

i18next.init(
  {
    fallbackLng: 'en',
    ns: ['file1', 'file2'],
    defaultNS: 'file1',
    debug: true,
  },
  (err, t) => {
    if (err) {
      console.log('something went wrong loading', err);
      return;
    }
    t('key'); // -> same as i18next.t
  },
);

// with only callback
i18next.init((err, t) => {
  if (err) {
    console.log('something went wrong loading', err);
    return;
  }
  t('key'); // -> same as i18next.t
});

const v: string = i18next.t('my.key');

// fix language to german
const de = i18next.getFixedT('de');
const z: string = de('myKey');

// verify we can get the German data
const data = i18next.getDataByLanguage('de');

// verify the data.translation field exists
console.log(data ? data.translation.myKey : 'data does not exist');

// or fix the namespace to anotherNamespace
const anotherNamespace = i18next.getFixedT(null, 'anotherNamespace');
const x: string = anotherNamespace('anotherNamespaceKey'); // no need to prefix ns i18n.t('anotherNamespace:anotherNamespaceKey');

i18next.changeLanguage('en', (err, t) => {
  if (err) {
    console.log('something went wrong loading', err);
    return;
  }
  t('key'); // -> same as i18next.t
});

i18next.loadNamespaces('myNamespace', (err, t) => {
  /* resources have been loaded */
});
i18next.loadNamespaces(['myNamespace1', 'myNamespace2'], (err, t) => {
  /* resources have been loaded */
});

i18next.loadLanguages('de', (err, t) => {
  /* resources have been loaded */
});
i18next.loadLanguages(['de', 'fr'], (err, t) => {
  /* resources have been loaded */
});

// reload all
i18next.reloadResources();

// reload languages
i18next.reloadResources(['de', 'fr']);

// reload namespaces for all languages
i18next.reloadResources(null, ['ns1', 'ns2']);

// reload namespaces in languages
i18next.reloadResources(['de', 'fr'], ['ns1', 'ns2']);

// for current language
i18next.dir();

// for another language
i18next.dir('en-US'); // -> "ltr";
i18next.dir('ar'); // -> "rtl";

const newInstance = i18next.createInstance(
  {
    fallbackLng: 'en',
    ns: ['file1', 'file2'],
    defaultNS: 'file1',
    debug: true,
  },
  (err, t) => {
    if (err) {
      console.log('something went wrong loading', err);
      return;
    }
    t('key'); // -> same as i18next.t
  },
);

// is the same as
newInstance.init(
  {
    fallbackLng: 'en',
    ns: ['file1', 'file2'],
    defaultNS: 'file1',
    debug: true,
  },
  (err, t) => {
    if (err) {
      console.log('something went wrong loading', err);
      return;
    }
    t('key'); // -> same as i18next.t
  },
);

const newInstance2 = i18next.cloneInstance(
  {
    fallbackLng: 'en',
    ns: ['file1', 'file2'],
    defaultNS: 'file1',
    debug: true,
  },
  (err, t) => {
    if (err) {
      console.log('something went wrong loading', err);
      return;
    }
    t('key'); // -> same as i18next.t
  },
);

// is the same as
const newInstance3 = i18next.cloneInstance();
newInstance.init(
  {
    fallbackLng: 'en',
    ns: ['file1', 'file2'],
    defaultNS: 'file1',
    debug: true,
  },
  (err, t) => {
    if (err) {
      console.log('something went wrong loading', err);
      return;
    }
    t('key'); // -> same as i18next.t
  },
);

i18next.on('initialized', options => {});
i18next.on('loaded', loaded => {});
i18next.on('failedLoading', (lng: string, ns: string, msg: string) => {});
i18next.on('missingKey', (lngs: string[], namespace: string, key: string, res: string) => {});
i18next.on('added', (lng: string, ns: string) => {});
i18next.on('removed', (lng: string, ns: string) => {});
i18next.on('languageChanged', (lng: string) => {});
i18next.on('customEvent', () => {});

i18next.store.on('added', (lng: string, ns: string) => {});
i18next.store.on('removed', (lng: string, ns: string) => {});

i18next.getResource('en', 'test', 'key');
i18next.getResource('en', 'test', 'key', { keySeparator: '-', ignoreJSONStructure: false });

i18next.addResource('en', 'test', 'key', 'value');
i18next.addResource('en', 'test', 'key', 'value', {
  keySeparator: '-',
  silent: false,
});

i18next.addResources('en', 'test', { key: 'value' });

i18next.addResourceBundle(
  'en',
  'translations',
  {
    key: 'value',
  },
  true,
  true,
);

const has: boolean = i18next.hasResourceBundle('en', 'test');

i18next.getResourceBundle('en', 'test');

i18next.removeResourceBundle('en', 'test');

i18next.init({
  resources: {
    en: {
      namespace1: {
        key: 'hello from namespace 1',
      },
      namespace2: {
        key: 'hello from namespace 2',
      },
    },
    de: {
      namespace1: {
        key: 'hallo von namespace 1',
      },
      namespace2: {
        key: 'hallo von namespace 2',
      },
    },
  },
});

i18next.init();

i18next.addResourceBundle('en', 'namespace1', {
  key: 'hello from namespace 1',
});

i18next.init({
  backend: {
    // for all available options read the backend's repository readme file
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
});

i18next.init({
  ns: ['common', 'moduleA'],
  defaultNS: 'moduleA',
});

i18next.init({
  lng: 'en',
  fallbackLng: 'en',

  resources: {
    en: {
      translation: {
        key1: 'test',
        interpolateKey: 'add {{insert}} {{up, uppercase}}',
        interpolateKey2: '<strong>add</strong> {{insert}} {{up, uppercase}}',
      },
    },
  },

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
    format: (value, format, lng) => {
      if (format === 'uppercase') {
        return value.toUpperCase();
      }
      if (value instanceof Date) {
        return value.toLocaleString();
      }
      return value;
    },
  },
});

i18next.init({
  react: {
    hashTransKey: defaultValue => {
      if (typeof defaultValue === 'string') {
        return defaultValue.replace(/\s+/g, '_');
      }

      throw new Error("Don't know how to make key for non-string defaultValue");
    },
  },
});

// Init with Locize options.
// From https://github.com/i18next/react-i18next/blob/master/example/locize/src/i18n.js
const locizeOptions = {
  projectId: '',
  apiKey: '',
  referenceLng: 'en',
};
i18next.init({
  fallbackLng: 'en',
  debug: true,
  saveMissing: true,

  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  backend: locizeOptions,
  locizeLastUsed: locizeOptions,
  editor: {
    ...locizeOptions,
    onEditorSaved: async (lng, ns) => {
      // reload that namespace in given language
      await i18next.reloadResources(lng, ns);
      // trigger an event on i18n which triggers a rerender
      // based on bindI18n below in react options
      i18next.emit('editorSaved');
    },
  },
  react: {
    bindI18n: 'languageChanged editorSaved',
  },
});
