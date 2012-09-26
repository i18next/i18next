// defaults
var o = {
    lng: undefined,
    load: 'all',
    preload: [],
    lowerCaseLng: false,
    returnObjectTrees: false,
    fallbackLng: 'dev',
    detectLngQS: 'setLng',
    ns: 'translation',
    nsseparator: ':',
    keyseparator: '.',
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

    setJqueryExt: true,
    useDataAttrOptions: false,
    cookieExpirationTime: undefined,

    postProcess: undefined
};