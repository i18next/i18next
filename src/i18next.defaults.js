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
    ns: 'translation',
    fallbackOnNull: true,
    fallbackOnEmpty: false,
    fallbackToDefaultNS: false,
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
    reusePrefix: '$t(',
    reuseSuffix: ')',
    pluralSuffix: '_plural',
    pluralNotFound: ['plural_not_found', Math.random()].join(''),
    contextNotFound: ['context_not_found', Math.random()].join(''),
    escapeInterpolation: false,

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

    shortcutFunction: 'sprintf' // or: defaultValue
};
