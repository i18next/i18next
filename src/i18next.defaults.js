// defaults
var o = {
    lng: undefined,
    load: 'all',
    preload: [],
    lowerCaseLng: false,
    returnObjectTrees: false,
    fallbackLng: ['dev'],
    fallbackNS: [],
    detectLngQS: 'setLng',
    detectLngFromLocalStorage: false,
    ns: {
        namespaces: ['translation'],
        defaultNs: 'translation'
    },
    fallbackOnNull: true,
    fallbackOnEmpty: false,
    fallbackToDefaultNS: false,
    showKeyIfEmpty: false,
    nsseparator: ':',
    keyseparator: '.',
    selectorAttr: 'data-i18n',
    debug: false,

    resGetPath: 'locales/__lng__/__ns__.json',
    resPostPath: 'locales/add/__lng__/__ns__',

    getAsync: true,
    postAsync: true,

    resStore: undefined,
    useLocalStorage: false,
    localStorageExpirationTime: 7*24*60*60*1000,

    dynamicLoad: false,
    sendMissing: false,
    sendMissingTo: 'fallback', // current | all
    sendType: 'POST',

    interpolationPrefix: '__',
    interpolationSuffix: '__',
    defaultVariables: false,
    reusePrefix: '$t(',
    reuseSuffix: ')',
    pluralSuffix: '_plural',
    pluralNotFound: ['plural_not_found', Math.random()].join(''),
    contextNotFound: ['context_not_found', Math.random()].join(''),
    escapeInterpolation: false,
    indefiniteSuffix: '_indefinite',
    indefiniteNotFound: ['indefinite_not_found', Math.random()].join(''),

    setJqueryExt: true,
    defaultValueFromContent: true,
    useDataAttrOptions: false,
    cookieExpirationTime: undefined,
    useCookie: true,
    cookieName: 'i18next',
    cookieDomain: undefined,

    objectTreeKeyHandler: undefined,
    postProcess: undefined,
    parseMissingKey: undefined,
    missingKeyHandler: sync.postMissing,
    ajaxTimeout: 0,

    shortcutFunction: 'sprintf' // or: defaultValue
};
