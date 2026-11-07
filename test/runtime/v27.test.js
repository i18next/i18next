import { describe, it, expect, vi } from 'vitest';
import i18next from '../../src/i18next.js';
import { isSafeLanguageCode } from '../../src/index.js';

// a debug-mode instance whose warnings are collected
const setup = () => {
  const warn = vi.fn();
  const instance = i18next
    .createInstance()
    .use({ type: 'logger', log: () => {}, warn, error: () => {} });
  const warnings = (text) =>
    warn.mock.calls.map((args) => args[0][0]).filter((m) => m.includes(text));
  return { instance, warnings };
};

const backend = (read = (lng, ns, cb) => cb(null, { key: lng })) => ({
  type: 'backend',
  callbackApi: true,
  read: vi.fn(read),
  create: vi.fn(),
});

describe('v27 behavior', () => {
  describe('defaults', () => {
    it("fallbackLng is false: no 'dev' request, missing keys go to the current language", async () => {
      const b = backend();
      const instance = i18next.createInstance().use(b);
      await instance.init({ lng: 'de-CH', saveMissing: true });
      expect(b.read.mock.calls.map(([lng]) => lng)).to.eql(['de-CH', 'de']);
      expect(instance.languages).to.eql(['de-CH', 'de']);
      instance.t('missing');
      expect(b.create.mock.calls[0].slice(0, 3)).to.eql([['de-CH'], 'translation', 'missing']);
    });

    it("fallbackLng: 'dev' keeps the v26 behavior", async () => {
      const b = backend();
      const instance = i18next.createInstance().use(b);
      await instance.init({ lng: 'de', fallbackLng: 'dev', saveMissing: true });
      expect(b.read.mock.calls.map(([lng]) => lng)).to.eql(['de', 'dev']);
      instance.t('missing');
      expect(b.create.mock.calls[0][0]).to.eql(['dev']);
    });

    it('a language code without a region gets its canonical casing, cleanCode: false keeps it', async () => {
      const resources = {
        en: { translation: { hi: 'hi' } },
        iw: { translation: { hi: 'shalom' } },
      };
      const instance = i18next.createInstance();
      await instance.init({ lng: 'EN', fallbackLng: 'iw', resources });
      expect(instance.language).to.equal('en');
      // casing only: an alias like 'iw' (he), 'tl' (fil) or 'eng' (en) stays as it is
      expect(instance.languages).to.eql(['en', 'iw']);
      expect(instance.t('hi')).to.equal('hi');
      expect(instance.services.languageUtils.formatLanguageCode('zh-hant-tw')).to.equal(
        'zh-Hant-TW',
      );
      expect(instance.services.languageUtils.formatLanguageCode('eng')).to.equal('eng');
      // an upper-case alias only gets lower-cased
      ['TL', 'ENG', 'IW'].forEach((code) =>
        expect(instance.services.languageUtils.formatLanguageCode(code)).to.equal(
          code.toLowerCase(),
        ),
      );

      const custom = i18next.createInstance();
      // not BCP 47: kept as it is
      await custom.init({ lng: 'My_Custom', fallbackLng: 'en', resources });
      expect(custom.languages).to.eql(['My_Custom', 'my', 'en']);

      const lowerCase = i18next.createInstance();
      await lowerCase.init({ lng: 'EN-us', lowerCaseLng: true, resources });
      expect(lowerCase.languages).to.eql(['en-us', 'en']);

      const v26 = i18next.createInstance();
      await v26.init({ lng: 'EN', cleanCode: false, fallbackLng: 'iw', resources });
      expect(v26.languages).to.eql(['EN', 'iw']);
    });

    it("keeps an alias like 'tl', also in supportedLngs", async () => {
      const resources = {
        tl: { translation: { hi: 'Kumusta' } },
        en: { translation: { hi: 'Hello' } },
      };
      const instance = i18next.createInstance();
      await instance.init({ lng: 'tl', fallbackLng: 'en', resources });
      expect(instance.languages).to.eql(['tl', 'en']);
      expect(instance.t('hi')).to.equal('Kumusta');
      await instance.changeLanguage('TL');
      expect(instance.languages).to.eql(['tl', 'en']);
      expect(instance.t('hi')).to.equal('Kumusta');

      const supported = i18next.createInstance();
      await supported.init({
        lng: 'tl',
        supportedLngs: ['tl', 'en'],
        fallbackLng: 'en',
        resources,
      });
      expect(supported.language).to.equal('tl');
      expect(supported.t('hi')).to.equal('Kumusta');
      // a code with a region is canonicalized fully, as before v27; its language part stays
      expect(supported.services.languageUtils.toResolveHierarchy('tl-PH')).to.eql(['tl', 'en']);
    });

    it("an empty translation falls back, an explicit '' default from code does not", async () => {
      const instance = i18next.createInstance();
      await instance.init({
        lng: 'de',
        fallbackLng: 'en',
        resources: {
          de: { translation: { title: '' } },
          en: { translation: { title: 'Settings' } },
        },
      });
      expect(instance.t('title')).to.equal('Settings');
      expect(instance.t('missing', '')).to.equal('');
      expect(instance.t('missing', { defaultValue: '' })).to.equal('');
      expect(instance.t('missing')).to.equal('missing');
    });
  });

  describe('createInstance(options)', () => {
    it('with a callback initializes right away, as before', () => {
      const callback = vi.fn();
      const instance = i18next.createInstance(
        { lng: 'en', resources: { en: { translation: { key: 'value' } } } },
        callback,
      );
      expect(callback).toHaveBeenCalledOnce();
      expect(instance.isInitialized).to.equal(true);
      expect(instance.t('key')).to.equal('value');
    });

    it('logs with its own debug option before init()', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      try {
        i18next.createInstance({ debug: true }).t('key');
        i18next.createInstance().t('key');
        expect(warn).toHaveBeenCalledOnce();
        expect(warn.mock.calls[0][0]).to.contain('t: called before init()');
      } finally {
        warn.mockRestore();
      }
    });

    it('merges the defaults before init()', () => {
      const instance = i18next.createInstance({ keySeparator: false });
      expect(instance.options.interpolation.escapeValue).to.equal(true);
      expect(instance.options.keySeparator).to.equal(false);
      expect(instance.options.fallbackLng).to.equal(false);
      expect(instance.getFixedT('en')('key')).to.equal('');
      expect(instance.isInitialized).toBeFalsy();
    });

    it("init() still tells the user's options from the defaults", async () => {
      const instance = i18next.createInstance({ keySeparator: false });
      await instance.init({ lng: 'en', resources: { en: { translation: { 'a.b': 'flat' } } } });
      expect(instance.options.userDefinedKeySeparator).to.equal(false);
      expect(instance.t('a.b')).to.equal('flat');
      const plain = i18next.createInstance();
      await plain.init({ lng: 'en', resources: {} });
      expect(plain.options.userDefinedKeySeparator).to.equal(undefined);
    });

    it('loadNamespaces() before init() does nothing and calls back', async () => {
      const instance = i18next.createInstance();
      const callback = vi.fn();
      await instance.loadNamespaces('common', callback);
      expect(callback).toHaveBeenCalledOnce();
      expect(instance.options.ns).to.eql(['translation']);
    });
  });

  describe('post-processors per instance', () => {
    const pp = (name, suffix = '!') => ({
      type: 'postProcessor',
      name,
      process: (value) => `${value}${suffix}`,
    });
    const resources = { en: { translation: { key: 'hi' } } };

    it('another instance does not see them, a clone sees its parent ones', async () => {
      const owner = i18next.createInstance().use(pp('per-instance'));
      await owner.init({ lng: 'en', resources, postProcess: 'per-instance' });
      expect(owner.t('key')).to.equal('hi!');

      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', resources, postProcess: 'per-instance' });
      expect(instance.t('key')).to.equal('hi');
      instance.t('key');
      expect(warnings("'per-instance' is not registered on this i18next instance")).toHaveLength(1);

      const clone = owner.cloneInstance();
      expect(clone.t('key')).to.equal('hi!');
      // registered on the parent after cloning: the clone sees it too
      owner.use(pp('later', '?'));
      expect(clone.t('key', { postProcess: 'later' })).to.equal('hi?');
      // registered on the clone: the parent does not see it
      clone.use(pp('clone-only', '#'));
      expect(clone.t('key', { postProcess: 'clone-only' })).to.equal('hi#');
      expect(owner.t('key', { postProcess: 'clone-only' })).to.equal('hi');
    });

    it("a plugin's use() from its own init() registers right away", async () => {
      const instance = i18next.createInstance();
      const plugin = { type: '3rdParty', init: (i18n) => i18n.use(pp('from-plugin')) };
      await instance
        .use(pp('own'))
        .use(plugin)
        .init({ lng: 'en', resources, postProcess: ['own', 'from-plugin'] });
      expect(instance.t('key')).to.equal('hi!!');
    });

    it('the default instance does not share its post-processors', async () => {
      i18next.use(pp('on-default'));
      const instance = i18next.createInstance();
      await instance.init({ lng: 'en', resources, postProcess: 'on-default' });
      expect(instance.t('key')).to.equal('hi');
    });
  });

  describe('logger per instance', () => {
    it("another instance's init() does not change it", async () => {
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', resources: {} });
      const other = i18next.createInstance();
      await other.init({ debug: false, lng: 'en', resources: {} });
      instance.logger.warn('still here');
      expect(warnings('still here')).toHaveLength(1);
      expect(other.logger).not.to.equal(instance.logger);
      expect(other.services.logger).to.equal(other.logger);
      expect(instance.services.logger).to.equal(instance.logger);
    });

    it("an instance without debug logs nothing through another instance's logger", async () => {
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', resources: {} });
      const quiet = i18next.createInstance();
      await quiet.init({ lng: 'en', resources: { en: { translation: { obj: { a: 'b' } } } } });
      quiet.t('obj');
      quiet.t('missing');
      expect(warnings('accessing an object')).toHaveLength(0);
    });

    it("a clone logs through its parent's logger, or a copy with its own debug", async () => {
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', resources: {} });
      expect(instance.cloneInstance().logger).to.equal(instance.logger);
      const quietClone = instance.cloneInstance({ debug: false });
      quietClone.logger.warn('from the quiet clone');
      expect(warnings('from the quiet clone')).toHaveLength(0);
      instance.cloneInstance().logger.warn('from a clone');
      expect(warnings('from a clone')).toHaveLength(1);
    });
  });

  describe('plugin calling convention', () => {
    it('warns for a backend without callbackApi, not for a marked one', async () => {
      const unmarked = setup();
      await unmarked.instance
        .use({ ...backend(), callbackApi: undefined })
        .init({ debug: true, lng: 'en', fallbackLng: 'en' });
      expect(unmarked.warnings('backend: set callbackApi')).toHaveLength(1);
      const marked = setup();
      await marked.instance.use(backend()).init({ debug: true, lng: 'en', fallbackLng: 'en' });
      expect(marked.warnings('backend: set callbackApi')).toHaveLength(0);
    });

    it('callbackApi: true passes the callback and the options whatever the parameter count', async () => {
      const created = [];
      class Backend {
        // defaults make Function.length 4, which guessing calls without options
        create(languages, ns, key, fallbackValue, callback = () => {}, options = {}) {
          created.push([key, options.isUpdate, typeof callback]);
        }

        read(lng, ns, callback) {
          callback(null, { key: 'value' });
        }
      }
      Backend.type = 'backend';
      Backend.callbackApi = true;
      const instance = i18next.createInstance().use(Backend);
      await instance.init({ lng: 'en', fallbackLng: 'en', saveMissing: true });
      instance.t('missing');
      expect(created).to.eql([['missing', false, 'function']]);
    });

    it('callbackApi: false expects promises whatever the parameter count', async () => {
      const created = [];
      const instance = i18next.createInstance().use({
        type: 'backend',
        callbackApi: false,
        read: (lng, ns, unused) => Promise.resolve({ key: `${lng} value` }),
        create: (languages, ns, key, fallbackValue, options) => {
          created.push([key, options.isUpdate]);
          return Promise.resolve();
        },
      });
      await instance.init({ lng: 'de', fallbackLng: 'en', saveMissing: true });
      expect(instance.t('key')).to.equal('de value');
      instance.t('missing');
      expect(created).to.eql([['missing', false]]);
    });

    it('async languageDetector: callbackApi decides between detect(callback) and a promise', async () => {
      const promiseDetector = {
        type: 'languageDetector',
        async: true,
        callbackApi: false,
        detect: (unused) => Promise.resolve('de'),
      };
      const { instance, warnings } = setup();
      await instance.use(promiseDetector).init({ debug: true, fallbackLng: 'en', resources: {} });
      expect(instance.language).to.equal('de');
      expect(warnings('languageDetector: set callbackApi')).toHaveLength(0);

      const unmarked = setup();
      await unmarked.instance
        .use({ type: 'languageDetector', async: true, detect: (callback) => callback('fr') })
        .init({ debug: true, fallbackLng: 'en', resources: {} });
      expect(unmarked.instance.language).to.equal('fr');
      expect(unmarked.warnings('languageDetector: set callbackApi')).toHaveLength(1);
    });
  });

  describe('public reload and hydration', () => {
    it('services.utils.reloadResources lets a backend refresh its bundles, also after cloning', async () => {
      let version = 1;
      const refreshing = {
        type: 'backend',
        callbackApi: true,
        init(services) {
          this.services = services;
        },
        read: (lng, ns, callback) => callback(null, { key: `v${version}` }),
      };
      const instance = i18next.createInstance().use(refreshing);
      await instance.init({ lng: 'en', fallbackLng: 'en' });
      instance.cloneInstance();
      version = 2;
      await refreshing.services.utils.reloadResources();
      expect(instance.t('key')).to.equal('v2');
      expect(instance.services.backendConnector.backend).to.equal(refreshing);
    });

    it('hydrate() fills the store and changes the language once', async () => {
      const instance = i18next.createInstance();
      await instance.init({ fallbackLng: 'en', ns: ['common'], defaultNS: 'common' });
      instance.hydrate({ de: { common: { key: 'Hallo' }, extra: { key: 'Extra' } } }, 'de');
      expect(instance.initializedStoreOnce).to.equal(true);
      expect(instance.initializedLanguageOnce).to.equal(true);
      expect(instance.isInitialized).to.equal(true);
      expect(instance.options.ns).to.eql(['common', 'extra']);
      expect(instance.language).to.equal('de');
      expect(instance.t('key')).to.equal('Hallo');

      instance.hydrate({ fr: { common: { key: 'Salut' } } }, 'fr');
      expect(instance.language).to.equal('de');
      expect(instance.getResourceBundle('fr', 'common')).to.equal(undefined);
    });

    it('the init flags stay writable, as react-i18next 17 useSSR writes them', async () => {
      const instance = i18next.createInstance();
      await instance.init({ fallbackLng: 'en', resources: {} });
      instance.initializedStoreOnce = true;
      instance.initializedLanguageOnce = true;
      instance.isInitialized = false;
      expect([
        instance.initializedStoreOnce,
        instance.initializedLanguageOnce,
        instance.isInitialized,
      ]).to.eql([true, true, false]);
    });

    it('hydrate() before init() warns and changes nothing, also with only a language', () => {
      const instance = i18next.createInstance();
      expect(instance.hydrate({ de: { translation: {} } }, 'de')).to.equal(instance);
      expect(instance.hydrate(undefined, 'de')).to.equal(instance);
      expect(instance.initializedStoreOnce).to.equal(undefined);
      expect(instance.initializedLanguageOnce).to.equal(undefined);
      expect(instance.language).to.equal(undefined);
    });

    it('hydrate() on a clone leaves the store it shares with its parent alone', async () => {
      const parent = i18next.createInstance();
      await parent.init({
        lng: 'en',
        fallbackLng: 'en',
        resources: { en: { translation: { a: 'A' } } },
      });
      parent.cloneInstance().hydrate({ fr: { translation: { a: 'FR' } } }, 'fr');
      expect(Object.keys(parent.store.data)).to.eql(['en']);
      expect(parent.t('a')).to.equal('A');
    });

    it('reloadResources() without languages and with nothing loaded reloads nothing', async () => {
      const read = vi.fn((lng, ns, callback) => callback(null, {}));
      const instance = i18next.createInstance().use({ type: 'backend', callbackApi: true, read });
      await instance.init({});
      expect(instance.languages).to.equal(undefined);
      read.mockClear();
      await instance.services.utils.reloadResources();
      expect(read).not.toHaveBeenCalled();
    });
  });

  describe('output', () => {
    it("does not escape '/' in a value", async () => {
      const instance = i18next.createInstance();
      await instance.init({
        lng: 'en',
        resources: { en: { translation: { price: 'Costs {{v}}' } } },
      });
      expect(instance.t('price', { v: '$10/month <b>' })).to.equal('Costs $10/month &lt;b&gt;');
    });

    it('handles an object or array hit without returnObjects like a missing key', async () => {
      const { instance, warnings } = setup();
      const b = backend();
      await instance.use(b).init({
        debug: true,
        lng: 'en',
        saveMissing: true,
        partialBundledLanguages: true,
        resources: { en: { translation: { obj: { a: 'b' }, arr: ['a', 'b'] } } },
      });
      expect(instance.t('obj')).to.equal('obj');
      expect(instance.t('arr')).to.equal('arr');
      expect(instance.t('obj', { returnObjects: true })).to.eql({ a: 'b' });
      expect(instance.t('obj', 'Default {{x}}', { x: 1 })).to.equal('Default 1');
      expect(instance.t('obj', { defaultValue: { not: 'returned' } })).to.equal('obj');
      expect(warnings('accessing an object')).toHaveLength(4);
      // the key exists: nothing is saved as missing
      expect(b.create).not.toHaveBeenCalled();

      const missingKey = i18next.createInstance().use({
        type: 'postProcessor',
        name: 'mark',
        process: (value) => `[${value}]`,
      });
      await missingKey.init({
        lng: 'en',
        appendNamespaceToMissingKey: true,
        postProcess: 'mark',
        resources: { en: { translation: { obj: { a: 'b' } } } },
      });
      // as for a missing key: post-processed, and the namespace is appended to the key itself
      expect(missingKey.t('obj')).to.equal('[obj]');
      expect(missingKey.t('obj', { postProcess: [] })).to.equal('translation:obj');
      const parsed = i18next.createInstance();
      await parsed.init({
        lng: 'en',
        parseMissingKeyHandler: (key, defaultValue) => `parsed ${key} ${defaultValue}`,
        resources: { en: { translation: { obj: { a: 'b' } } } },
      });
      expect(parsed.t('obj')).to.equal('parsed obj undefined');
      expect(parsed.t('obj', 'dv')).to.equal('parsed obj dv');

      const handled = i18next.createInstance();
      await handled.init({
        lng: 'en',
        returnedObjectHandler: (key, value) => `${key}: ${Object.keys(value)}`,
        resources: { en: { translation: { obj: { a: 'b' } } } },
      });
      expect(handled.t('obj')).to.equal('obj: a');
    });
  });

  describe('keySeparator: false', () => {
    const resources = {
      en: { translation: { nested: { c: 'nested c' }, 'nested.c': 'flat nested.c', a: 'A' } },
    };

    it("looks up flat keys only and does not split at the text 'false'", async () => {
      const instance = i18next.createInstance();
      await instance.init({ lng: 'en', keySeparator: false, resources });
      expect(instance.t('nestedfalsec')).to.equal('nestedfalsec');
      expect(instance.t('nested.c')).to.equal('flat nested.c');
      expect(instance.t('a')).to.equal('A');
      expect(instance.getFixedT('en', null, 'nested')('c')).to.equal('flat nested.c');
      // a selector path is joined with '.', as a key prefix is
      expect(instance.t(($) => $.nested.c)).to.equal('flat nested.c');
    });

    it('interpolates nested variables as before', async () => {
      const instance = i18next.createInstance();
      await instance.init({
        lng: 'en',
        keySeparator: false,
        resources: { en: { translation: { hi: 'Hi {{user.name}}' } } },
      });
      expect(instance.t('hi', { user: { name: 'Ann' } })).to.equal('Hi Ann');
      expect(instance.t('hi', { userfalsename: 'no' })).to.equal('Hi {{user.name}}');
    });
  });

  describe('language codes from outside', () => {
    it('isSafeLanguageCode accepts codes in any common format, not markup or paths', () => {
      [
        'en',
        'en-US',
        'en_US',
        'zh_Hant_TW',
        'sr@latin',
        'de_DE.UTF-8',
        'cimode',
        'x'.repeat(128),
      ].forEach((code) => expect(isSafeLanguageCode(code), code).to.equal(true));
      [
        '"><img src=x onerror=alert(1)>',
        '../de',
        'a/b',
        'a\\b',
        'en US',
        '__proto__',
        'constructor',
        '',
        'x'.repeat(129),
        undefined,
        42,
      ].forEach((code) => expect(isSafeLanguageCode(code), String(code)).to.equal(false));
    });

    const markup = '"><img src=x onerror=alert(1)>';
    const detector = (code) => ({ type: 'languageDetector', detect: () => code });
    const resources = { en: { translation: { key: 'en' } }, de: { translation: { key: 'de' } } };

    it('refuses such a code from a detector or changeLanguage() and uses the fallback language', async () => {
      const { instance, warnings } = setup();
      await instance.use(detector(markup)).init({ debug: true, fallbackLng: 'en', resources });
      expect(instance.language).to.equal('en');
      await instance.changeLanguage('de');
      await instance.changeLanguage('a/b');
      expect(instance.language).to.equal('en');
      expect(instance.t('key')).to.equal('en');
      const msgs = warnings('refused the language code');
      expect(msgs).toHaveLength(2);
      expect(msgs[0]).to.contain(markup);
    });

    it("skips to a detector's next code", async () => {
      const instance = i18next.createInstance().use(detector([markup, 'de', 'en']));
      await instance.init({ fallbackLng: 'en', resources });
      expect(instance.language).to.equal('de');
    });

    it('with fallbackLng: false a code refused at init() leaves the language unset', async () => {
      const b = backend();
      const instance = i18next.createInstance().use(b);
      await instance.init({ lng: '../../etc/passwd' });
      expect(instance.language).to.equal(undefined);
      expect(instance.languages).to.equal(undefined);
      expect(b.read).not.toHaveBeenCalled();
      expect(instance.t('key')).to.equal('key');
    });

    it('refuses without debug, and then uses the fallback for no code, as for an unsupported code', async () => {
      const fallbackLng = vi.fn((code) => (code?.startsWith('de') ? ['de'] : ['en']));
      const instance = i18next.createInstance();
      await instance.init({ lng: 'de', fallbackLng, resources });
      await instance.changeLanguage('de AT');
      expect(instance.language).to.equal('en');
    });

    it('a fallbackLng function that returns the code it gets does not make the code configured', async () => {
      // the shape of the docs example: const fallbacks = [code]
      const fallbackLng = (code) => (code ? [code, 'en'] : ['en']);
      const instance = i18next.createInstance();
      await instance.init({ lng: 'de', fallbackLng, resources });
      await instance.changeLanguage(markup);
      expect(instance.language).to.equal('en');
    });

    it('loadLanguages() refuses such a code too, and does not make it configured', async () => {
      const b = backend();
      const { instance, warnings } = setup();
      await instance.use(b).init({ debug: true, lng: 'en', fallbackLng: 'en' });
      b.read.mockClear();
      await instance.loadLanguages([markup, 'de']);
      expect(b.read.mock.calls.map(([lng]) => lng)).to.eql(['de']);
      expect(instance.options.preload).to.eql(['de']);
      await instance.changeLanguage(markup);
      expect(instance.language).to.equal('en');
      expect(warnings('refused the language code')).toHaveLength(1);
      // added resources do not count either: configured is what init() got
      instance.addResourceBundle(markup, 'translation', { key: 'x' });
      await instance.changeLanguage(markup);
      expect(instance.language).to.equal('en');
    });

    it('with supportedLngs the input is matched as before, only an unsafe match is refused', async () => {
      const instance = i18next.createInstance();
      await instance.init({ lng: 'en', supportedLngs: ['en', 'de'], fallbackLng: 'en', resources });
      for (const code of ['de-DE ', 'de-DE;q=0.9', 'de_DE:utf8', 'de-<x>']) {
        await instance.changeLanguage('en');
        await instance.changeLanguage(code);
        expect(instance.language, code).to.equal('de');
      }
      const noFallback = i18next.createInstance();
      await noFallback.init({ lng: 'en', supportedLngs: ['en', 'de'], resources });
      await noFallback.changeLanguage('de-DE;q=0.9');
      expect(noFallback.language).to.equal('de');

      // nonExplicitSupportedLngs matches the input itself, which is refused
      const nonExplicit = i18next.createInstance();
      await nonExplicit.init({
        lng: 'en',
        supportedLngs: ['en', 'de'],
        nonExplicitSupportedLngs: true,
        fallbackLng: 'en',
        resources,
      });
      await nonExplicit.changeLanguage('de-AT');
      expect(nonExplicit.language).to.equal('de-AT');
      await nonExplicit.changeLanguage('de-<x>');
      expect(nonExplicit.language).to.equal('en');
    });

    it('a clone does not count languages added to the shared store as configured', async () => {
      const parent = i18next.createInstance({
        lng: 'en',
        resources: { en: { translation: { key: 'en' } } },
      });
      await parent.init();
      parent.addResourceBundle(markup, 'translation', { a: 'x' });
      await parent.changeLanguage(markup);
      expect(parent.language).to.equal('en');
      const clone = parent.cloneInstance();
      await clone.changeLanguage(markup);
      expect(clone.language).to.equal('en');
      // the options given to cloneInstance() count
      const listed = parent.cloneInstance({ supportedLngs: [markup, 'en'] });
      await listed.changeLanguage(markup);
      expect(listed.language).to.equal(markup);
    });

    it('a clone takes the codes its parent was configured with', async () => {
      const parent = i18next.createInstance();
      await parent.init({ lng: 'en', preload: ['b+sr+Latn'], resources });
      const clone = parent.cloneInstance();
      await clone.changeLanguage('b+sr+Latn');
      expect(clone.language).to.equal('b+sr+Latn');
    });

    it('passes configured codes and codes of a safe shape', async () => {
      const supported = i18next.createInstance().use(detector(markup));
      await supported.init({ supportedLngs: ['en'], fallbackLng: 'en', resources });
      expect(supported.language).to.equal('en');

      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'my lang',
        fallbackLng: 'en',
        resources: { 'my lang': { translation: { key: 'value' } } },
      });
      expect(instance.language).to.equal('my lang');
      expect(instance.t('key')).to.equal('value');
      await instance.changeLanguage('en_US');
      expect(instance.language).to.equal('en_US');
      await instance.changeLanguage('sr@latin');
      expect(instance.language).to.equal('sr@latin');

      const listed = i18next.createInstance();
      await listed.init({ lng: 'b+sr+Latn', supportedLngs: ['b+sr+Latn'], resources: {} });
      expect(listed.language).to.equal('b+sr+Latn');
      expect(warnings('refused the language code')).toHaveLength(0);
    });
  });
});
