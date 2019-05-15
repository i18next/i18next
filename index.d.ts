// Type definitions for i18next
// Project: http://i18next.com
// Definitions by: Michael Ledin <https://github.com/mxl>
//                 Budi Irawan <https://github.com/deerawan>
//                 Giedrius Grabauskas <https://github.com/GiedriusGrabauskas>
//                 Silas Rech <https://github.com/lenovouser>
//                 Philipp Katz <https://github.com/qqilihq>
//                 Milan Konir <https://github.com/butchyyyy>
//                 Takeo Kusama <https://github.com/tkow>

declare namespace i18next {
  interface FallbackLngObjList {
    [language: string]: string[];
  }

  type FallbackLng = string | string[] | FallbackLngObjList;

  type FormatFunction = (value: any, format?: string, lng?: string) => string;

  interface InterpolationOptions {
    /**
     * Format function see formatting for details
     * @default noop
     */
    format?: FormatFunction;
    /**
     * Used to separate format from interpolation value
     * @default ','
     */
    formatSeparator?: string;
    /**
     * Escape function
     * @default str => str
     */
    escape?(str: string): string;

    /**
     * Escape passed in values to avoid xss injection
     * @default true
     */
    escapeValue?: boolean;
    /**
     * If true, then value passed into escape function is not casted to string, use with custom escape function that does its own type check
     * @default false
     */
    useRawValueToEscape?: boolean;
    /**
     * Prefix for interpolation
     * @default '{{'
     */
    prefix?: string;
    /**
     * Suffix for interpolation
     * @default '}}'
     */
    suffix?: string;
    /**
     * Escaped prefix for interpolation (regexSafe)
     * @default undefined
     */
    prefixEscaped?: string;
    /**
     * Escaped suffix for interpolation (regexSafe)
     * @default undefined
     */
    suffixEscaped?: string;
    /**
     * Suffix to unescaped mode
     * @default undefined
     */
    unescapeSuffix?: string;
    /**
     * Prefix to unescaped mode
     * @default '-'
     */
    unescapePrefix?: string;
    /**
     * Prefix for nesting
     * @default '$t('
     */
    nestingPrefix?: string;
    /**
     * Suffix for nesting
     * @default ')'
     */
    nestingSuffix?: string;
    /**
     * Escaped prefix for nesting (regexSafe)
     * @default undefined
     */
    nestingPrefixEscaped?: string;
    /**
     * Escaped suffix for nesting (regexSafe)
     * @default undefined
     */
    nestingSuffixEscaped?: string;
    /**
     * Global variables to use in interpolation replacements
     * @default undefined
     */
    defaultVariables?: { [index: string]: any };
    /**
     * After how many interpolation runs to break out before throwing a stack overflow
     * @default 1000
     */
    maxReplaces?: number;
  }

  interface ReactOptions {
    /**
     * Set to true if you like to wait for loaded in every translated hoc
     * @default false
     */
    wait?: boolean;
    /**
     * Set it to fallback to let passed namespaces to translated hoc act as fallbacks
     * @default 'default'
     */
    nsMode?: 'default' | 'fallback';
    /**
     * Set it to the default parent element created by the Trans component.
     * @default 'div'
     */
    defaultTransParent?: string;
    /**
     * Set which events trigger a re-render, can be set to false or string of events
     * @default 'languageChanged loaded'
     */
    bindI18n?: string | false;
    /**
     * Set which events on store trigger a re-render, can be set to false or string of events
     * @default 'added removed'
     */
    bindStore?: string | false;
    /**
     * Set fallback value for Trans components without children
     * @default undefined
     */
    transEmptyNodeValue?: string;
    /**
     * Set it to false if you do not want to use Suspense
     * @default true
     */
    useSuspense?: boolean;
    /**
     * Function to generate an i18nKey from the defaultValue (or Trans children)
     * when no key is provided.
     * By default, the defaultValue (Trans text) itself is used as the key.
     * If you want to require keys for all translations, supply a function
     * that always throws an error.
     * @default undefined
     */
    hashTransKey?(defaultValue: TOptionsBase['defaultValue']): TOptionsBase['defaultValue'];
    /**
     * Convert eg. <br/> found in translations to a react component of type br
     * @default true
     */
    transSupportBasicHtmlNodes?: boolean;
    /**
     * Which nodes not to convert in defaultValue generation in the Trans component.
     * @default ['br', 'strong', 'i', 'p']
     */
    transKeepBasicHtmlNodesFor?: string[];
  }

  interface InitOptions {
    /**
     * Logs info level to console output. Helps finding issues with loading not working.
     * @default false
     */
    debug?: boolean;

    /**
     * Resources to initialize with (if not using loading or not appending using addResourceBundle)
     * @default undefined
     */
    resources?: Resource;

    /**
     * Allow initializing with bundled resources while using a backend to load non bundled ones.
     * @default false
     */
    partialBundledLanguages?: boolean;

    /**
     * Language to use (overrides language detection)
     * @default undefined
     */
    lng?: string;

    /**
     * Language to use if translations in user language are not available.
     * @default 'dev'
     */
    fallbackLng?: false | FallbackLng;

    /**
     * Array of allowed languages
     * @default false
     */
    whitelist?: false | string[];

    /**
     * If true will pass eg. en-US if finding en in whitelist
     * @default false
     */
    nonExplicitWhitelist?: boolean;

    /**
     * Language codes to lookup, given set language is
     * 'en-US': 'all' --> ['en-US', 'en', 'dev'],
     * 'currentOnly' --> 'en-US',
     * 'languageOnly' --> 'en'
     * @default 'all'
     */
    load?: 'all' | 'currentOnly' | 'languageOnly';

    /**
     * Array of languages to preload. Important on server-side to assert translations are loaded before rendering views.
     * @default false
     */
    preload?: false | string[];

    /**
     * Language will be lowercased eg. en-US --> en-us
     * @default false
     */
    lowerCaseLng?: boolean;

    /**
     * String or array of namespaces to load
     * @default 'translation'
     */
    ns?: string | string[];

    /**
     * Default namespace used if not passed to translation function
     * @default 'translation'
     */
    defaultNS?: string;

    /**
     * String or array of namespaces to lookup key if not found in given namespace.
     * @default false
     */
    fallbackNS?: false | string | string[];

    /**
     * Calls save missing key function on backend if key not found
     * @default false
     */
    saveMissing?: boolean;

    /**
     * Experimental: enable to update default values using the saveMissing
     * (Works only if defaultValue different from translated value.
     * Only useful on initial development or when keeping code as source of truth not changing values outside of code.
     * Only supported if backend supports it already)
     * @default false
     */
    updateMissing?: boolean;

    /**
     * @default 'fallback'
     */
    saveMissingTo?: 'current' | 'all' | 'fallback';

    /**
     * Used for custom missing key handling (needs saveMissing set to true!)
     * @default false
     */
    missingKeyHandler?:
      | false
      | ((lngs: string[], ns: string, key: string, fallbackValue: string) => void);

    /**
     * Receives a key that was not found in `t()` and returns a value, that will be returned by `t()`
     * @default noop
     */
    parseMissingKeyHandler?(key: string): any;

    /**
     * Appends namespace to missing key
     * @default false
     */
    appendNamespaceToMissingKey?: boolean;

    /**
     * Gets called in case a interpolation value is undefined. This method will not be called if the value is empty string or null
     * @default noop
     */
    missingInterpolationHandler?: (text: string, value: any, options: InitOptions) => any;

    /**
     * Will use 'plural' as suffix for languages only having 1 plural form, setting it to false will suffix all with numbers
     * @default true
     */
    simplifyPluralSuffix?: boolean;

    /**
     * String or array of postProcessors to apply per default
     * @default false
     */
    postProcess?: false | string | string[];

    /**
     * Allows null values as valid translation
     * @default true
     */
    returnNull?: boolean;

    /**
     * Allows empty string as valid translation
     * @default true
     */
    returnEmptyString?: boolean;

    /**
     * Allows objects as valid translation result
     * @default false
     */
    returnObjects?: boolean;

    /**
     * Gets called if object was passed in as key but returnObjects was set to false
     * @default noop
     */
    returnedObjectHandler?(key: string, value: string, options: any): void;

    /**
     * Char, eg. '\n' that arrays will be joined by
     * @default false
     */
    joinArrays?: false | string;

    /**
     * Sets defaultValue
     * @default args => ({ defaultValue: args[1] })
     */
    overloadTranslationOptionHandler?(args: string[]): TOptions;

    /**
     * @see https://www.i18next.com/interpolation.html
     */
    interpolation?: InterpolationOptions;

    /**
     * Options for language detection - check documentation of plugin
     * @default undefined
     */
    detection?: object;

    /**
     * Options for backend - check documentation of plugin
     * @default undefined
     */
    backend?: object;

    /**
     * Options for cache layer - check documentation of plugin
     * @default undefined
     */
    cache?: object;

    /**
     * Options for i18n message format - check documentation of plugin
     * @default undefined
     */
    i18nFormat?: object;

    /**
     * Options for react - check documentation of plugin
     * @default undefined
     */
    react?: ReactOptions;

    /**
     * Triggers resource loading in init function inside a setTimeout (default async behaviour).
     * Set it to false if your backend loads resources sync - that way calling i18next.t after
     * init is possible without relaying on the init callback.
     * @default true
     */
    initImmediate?: boolean;

    /**
     * Char to separate keys
     * @default '.'
     */
    keySeparator?: false | string;

    /**
     * Char to split namespace from key
     * @default ':'
     */
    nsSeparator?: false | string;

    /**
     * Char to split plural from key
     * @default '_'
     */
    pluralSeparator?: string;

    /**
     * Char to split context from key
     * @default '_'
     */
    contextSeparator?: string;

    /**
     * Prefixes the namespace to the returned key when using `cimode`
     * @default false
     */
    appendNamespaceToCIMode?: boolean;

    /**
     * Compatibility JSON version
     * @default 'v3'
     */
    compatibilityJSON?: 'v1' | 'v2' | 'v3';
  }

  interface TOptionsBase {
    /**
     * Default value to return if a translation was not found
     */
    defaultValue?: any;
    /**
     * Count value used for plurals
     */
    count?: number;
    /**
     * Used for contexts (eg. male\female)
     */
    context?: any;
    /**
     * Object with vars for interpolation - or put them directly in options
     */
    replace?: any;
    /**
     * Override language to use
     */
    lng?: string;
    /**
     * Override languages to use
     */
    lngs?: string[];
    /**
     * Override language to lookup key if not found see fallbacks for details
     */
    fallbackLng?: FallbackLng;
    /**
     * Override namespaces (string or array)
     */
    ns?: string | string[];
    /**
     * Override char to separate keys
     */
    keySeparator?: string;
    /**
     * Override char to split namespace from key
     */
    nsSeparator?: string;
    /**
     * Accessing an object not a translation string (can be set globally too)
     */
    returnObjects?: boolean;
    /**
     * Char, eg. '\n' that arrays will be joined by (can be set globally too)
     */
    joinArrays?: string;
    /**
     * String or array of postProcessors to apply see interval plurals as a sample
     */
    postProcess?: string | string[];
    /**
     * Override interpolation options
     */
    interpolation?: InterpolationOptions;
  }

  // indexer that is open to any value
  type StringMap = { [key: string]: any };

  /**
   * Options that allow open ended values for interpolation unless type is provided.
   */
  type TOptions<TInterpolationMap extends object = StringMap> = TOptionsBase & TInterpolationMap;

  type Callback = (error: any, t: TFunction) => void;

  /**
   * Uses similar args as the t function and returns true if a key exists.
   */
  interface ExistsFunction<
    TKeys extends string = string,
    TInterpolationMap extends object = StringMap
  > {
    (key: TKeys | TKeys[], options?: TOptions<TInterpolationMap>): boolean;
  }

  interface WithT {
    // Expose parameterized t in the i18next interface hierarchy
    t: TFunction;
  }

  type TFunction = <
    TResult extends string | object | Array<string | object> | undefined = string,
    TKeys extends string | TemplateStringsArray = string,
    TInterpolationMap extends object = StringMap
  >(
    key: TKeys | TKeys[],
    options?: TOptions<TInterpolationMap> | string,
  ) => TResult;

  interface Resource {
    [language: string]: ResourceLanguage;
  }

  interface ResourceLanguage {
    [namespace: string]: ResourceKey;
  }

  interface ResourceKey {
    [key: string]: any;
  }

  export interface Interpolator {
    init(options: InterpolationOptions, reset: boolean): undefined;
    reset(): undefined;
    resetRegExp(): undefined;
    interpolate(str: string, data: object, lng: string, options: InterpolationOptions): string;
    nest(str: string, fc: (...args: any[]) => any, options: InterpolationOptions): string;
  }

  interface Services {
    backendConnector: any;
    i18nFormat: any;
    interpolator: Interpolator;
    languageDetector: any;
    languageUtils: any;
    logger: any;
    pluralResolver: any;
    resourceStore: Resource;
  }

  /**
   * Used to load data for i18next.
   * Can be provided as a singleton or as a prototype constructor (preferred for supporting multiple instances of i18next).
   * For singleton set property `type` to `'backend'` For a prototype constructor set static property.
   */
  interface BackendModule {
    type?: 'backend';
    init(services: Services, backendOptions: object, i18nextOptions: InitOptions): void;
    read(
      language: string,
      namespace: string,
      callback: (err: Error | null | undefined, data: ResourceLanguage) => void,
    ): void;
    /** Save the missing translation */
    create(languages: string[], namespace: string, key: string, fallbackValue: string): void;
    /** Load multiple languages and namespaces. For backends supporting multiple resources loading */
    readMulti?(
      languages: string[],
      namespaces: string[],
      callback: (err: Error | null | undefined, data: Resource) => void,
    ): void;
    /** Store the translation. For backends acting as cache layer */
    save?(language: string, namespace: string, data: ResourceLanguage): void;
  }

  /**
   * Used to detect language in user land.
   * Can be provided as a singleton or as a prototype constructor (preferred for supporting multiple instances of i18next).
   * For singleton set property `type` to `'languageDetector'` For a prototype constructor set static property.
   */
  interface LanguageDetectorModule {
    type?: 'languageDetector';
    init(services: Services, detectorOptions: object, i18nextOptions: InitOptions): void;
    /** Must return detected language */
    detect(): string;
    cacheUserLanguage(lng: string): void;
  }

  /**
   * Used to detect language in user land.
   * Can be provided as a singleton or as a prototype constructor (preferred for supporting multiple instances of i18next).
   * For singleton set property `type` to `'languageDetector'` For a prototype constructor set static property.
   */
  interface LanguageDetectorAsyncModule {
    type?: 'languageDetector';
    /** Set to true to enable async detection */
    async: true;
    init(services: Services, detectorOptions: object, i18nextOptions: InitOptions): void;
    /** Must call callback passing detected language */
    detect(callback: (lng: string) => void): void;
    cacheUserLanguage(lng: string): void;
  }

  /**
   * Used to extend or manipulate the translated values before returning them in `t` function.
   * Need to be a singleton object.
   */
  interface PostProcessorModule {
    /** Unique name */
    name: string;
    type: 'postProcessor';
    process(value: string, key: string, options: TOptions, translator: any): string;
  }

  /**
   * Override the built-in console logger.
   * Do not need to be a prototype function.
   */
  interface LoggerModule {
    type?: 'logger';
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
  }

  interface I18nFormatModule {
    type?: 'i18nFormat';
  }

  interface ThirdPartyModule {
    type: '3rdParty';
    init(i18n: i18n): void;
  }

  interface Modules {
    backend?: BackendModule;
    logger?: LoggerModule;
    languageDetector?: LanguageDetectorModule | LanguageDetectorAsyncModule;
    i18nFormat?: I18nFormatModule;
    external: ThirdPartyModule[];
  }

  interface i18n extends WithT {
    /**
     * The default export of the i18next module is an i18next instance ready to be initialized by calling init.
     * You can create additional instances using the createInstance function.
     *
     * @param options - Initial options.
     * @param callback - will be called after all translations were loaded or with an error when failed (in case of using a backend).
     */
    init(callback?: Callback): Promise<TFunction>;
    init(options: InitOptions, callback?: Callback): Promise<TFunction>;

    loadResources(callback?: (err: any) => void): void;

    /**
     * The use function is there to load additional plugins to i18next.
     * For available module see the plugins page and don't forget to read the documentation of the plugin.
     */
    use(module: any): i18n;

    /**
     * List of modules used
     */
    modules: Modules;

    /**
     * Internal container for all used plugins and implementation details like languageUtils, pluralResolvers, etc.
     */
    services: Services;

    /**
     * Uses similar args as the t function and returns true if a key exists.
     */
    exists: ExistsFunction;

    /**
     * Returns a t function that defaults to given language or namespace.
     * Both params could be arrays of languages or namespaces and will be treated as fallbacks in that case.
     * On the returned function you can like in the t function override the languages or namespaces by passing them in options or by prepending namespace.
     */
    getFixedT(lng: string | string[], ns?: string | string[]): TFunction;
    getFixedT(lng: null, ns: string | string[]): TFunction;

    /**
     * Changes the language. The callback will be called as soon translations were loaded or an error occurs while loading.
     * HINT: For easy testing - setting lng to 'cimode' will set t function to always return the key.
     */
    changeLanguage(lng: string, callback?: Callback): Promise<TFunction>;

    /**
     * Is set to the current detected or set language.
     * If you need the primary used language depending on your configuration (whilelist, load) you will prefer using i18next.languages[0].
     */
    language: string;

    /**
     * Is set to an array of language-codes that will be used it order to lookup the translation value.
     */
    languages: string[];

    /**
     * Loads additional namespaces not defined in init options.
     */
    loadNamespaces(ns: string | string[], callback?: Callback): Promise<void>;

    /**
     * Loads additional languages not defined in init options (preload).
     */
    loadLanguages(lngs: string | string[], callback?: Callback): Promise<void>;

    /**
     * Reloads resources on given state. Optionally you can pass an array of languages and namespaces as params if you don't want to reload all.
     */
    reloadResources(
      lngs?: string | string[],
      ns?: string | string[],
      callback?: () => void,
    ): Promise<void>;
    reloadResources(lngs: null, ns: string | string[], callback?: () => void): Promise<void>;

    /**
     * Changes the default namespace.
     */
    setDefaultNamespace(ns: string): void;

    /**
     * Returns rtl or ltr depending on languages read direction.
     */
    dir(lng?: string): 'ltr' | 'rtl';

    /**
     * Exposes interpolation.format function added on init.
     */
    format: FormatFunction;

    /**
     * Will return a new i18next instance.
     * Please read the options page for details on configuration options.
     * Providing a callback will automatically call init.
     * The callback will be called after all translations were loaded or with an error when failed (in case of using a backend).
     */
    createInstance(options?: InitOptions, callback?: Callback): i18n;

    /**
     * Creates a clone of the current instance. Shares store, plugins and initial configuration.
     * Can be used to create an instance sharing storage but being independent on set language or namespaces.
     */
    cloneInstance(options?: InitOptions, callback?: Callback): i18n;

    /**
     * Gets fired after initialization.
     */
    on(event: 'initialized', callback: (options: InitOptions) => void): void;

    /**
     * Gets fired on loaded resources.
     */
    on(event: 'loaded', callback: (loaded: boolean) => void): void;

    /**
     * Gets fired if loading resources failed.
     */
    on(event: 'failedLoading', callback: (lng: string, ns: string, msg: string) => void): void;

    /**
     * Gets fired on accessing a key not existing.
     */
    on(
      event: 'missingKey',
      callback: (lngs: string[], namespace: string, key: string, res: string) => void,
    ): void;

    /**
     * Gets fired when resources got added or removed.
     */
    on(event: 'added' | 'removed', callback: (lng: string, ns: string) => void): void;

    /**
     * Gets fired when changeLanguage got called.
     */
    on(event: 'languageChanged', callback: (lng: string) => void): void;

    /**
     * Event listener
     */
    on(event: string, listener: (...args: any[]) => void): void;

    /**
     * Remove event listener
     */
    off(event: string, listener: (...args: any[]) => void): void;

    /**
     * Gets one value by given key.
     */
    getResource(lng: string, ns: string, key: string, options?: { keySeparator?: string }): any;

    /**
     * Adds one key/value.
     */
    addResource(
      lng: string,
      ns: string,
      key: string,
      value: string,
      options?: { keySeparator?: string; silent?: boolean },
    ): void;

    /**
     * Adds multiple key/values.
     */
    addResources(lng: string, ns: string, resources: any): void;

    /**
     * Adds a complete bundle.
     * Setting deep param to true will extend existing translations in that file.
     * Setting overwrite to true it will overwrite existing translations in that file.
     */
    addResourceBundle(
      lng: string,
      ns: string,
      resources: any,
      deep?: boolean,
      overwrite?: boolean,
    ): void;

    /**
     * Checks if a resource bundle exists.
     */
    hasResourceBundle(lng: string, ns: string): boolean;

    /**
     * Returns a resource bundle.
     */
    getResourceBundle(lng: string, ns: string): any;

    /**
     * Removes an existing bundle.
     */
    removeResourceBundle(lng: string, ns: string): void;

    /**
     * Current options
     */
    options: InitOptions;

    /**
     * Is initialized
     */
    isInitialized: boolean;
  }
}

declare const i18next: i18next.i18n;
export default i18next;
