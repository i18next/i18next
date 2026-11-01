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
  read,
  create: () => {},
});

describe('26.7 deprecations', () => {
  describe('dotted language in the resource store', () => {
    it('warns once per method and keeps working', async () => {
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', resources: { en: { translation: {} } } });
      instance.addResource('en.translation.a', 'A');
      instance.addResource('en.translation.b', 'B');
      expect(instance.getResource('en.translation.a')).to.equal('A');
      expect(instance.getResource('en', 'translation', 'b')).to.equal('B');
      const msgs = warnings('dotted language');
      expect(msgs).toHaveLength(2);
      expect(msgs[0]).to.match(/^WARNING DEPRECATED: .*addResource:/);
      expect(msgs[1]).to.match(/getResource:/);
    });
  });

  describe('regex-escaped interpolation delimiters', () => {
    it('warns once and keeps working', async () => {
      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'en',
        // the escaped forms only apply when prefix and suffix are not set
        interpolation: {
          prefix: null,
          suffix: null,
          prefixEscaped: '\\[\\[',
          suffixEscaped: '\\]\\]',
        },
        resources: { en: { translation: { key: 'Hi [[name]]' } } },
      });
      expect(instance.t('key', { name: 'Ann' })).to.equal('Hi Ann');
      instance.t('key', { name: 'Bob', interpolation: { escapeValue: true } });
      const msgs = warnings('interpolation.prefixEscaped, interpolation.suffixEscaped');
      expect(msgs).toHaveLength(1);
    });
  });

  describe('bare language codes', () => {
    it('warns for a code v27 canonicalizes differently', async () => {
      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'EN',
        fallbackLng: 'iw',
        resources: { en: { translation: { hi: 'hi' } }, iw: { translation: { hi: 'shalom' } } },
      });
      expect(instance.language).to.equal('EN');
      const msgs = warnings('canonicalizes');
      expect(
        msgs.some((m) => m.includes("'EN' is used as 'EN'") && m.includes("to 'en'")),
      ).to.equal(true);
      expect(
        msgs.some((m) => m.includes("'iw' is used as 'iw'") && m.includes("to 'he'")),
      ).to.equal(true);
    });

    it('does not warn for canonical or custom codes', async () => {
      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'en',
        fallbackLng: 'my_custom',
        resources: { en: { translation: { hi: 'hi' } } },
      });
      instance.changeLanguage('EN');
      expect(warnings('canonicalizes')).toHaveLength(1);
      const cleaned = setup();
      await cleaned.instance.init({ debug: true, lng: 'EN', cleanCode: true, fallbackLng: 'en' });
      expect(cleaned.warnings('canonicalizes')).toHaveLength(0);
    });
  });

  describe("implicit fallbackLng 'dev'", () => {
    it('notices once when dev is requested because fallbackLng is not set', async () => {
      const { instance, warnings } = setup();
      await instance.use(backend()).init({ debug: true, lng: 'de', saveMissing: true });
      instance.t('missing');
      expect(warnings("language 'dev' is requested")).toHaveLength(1);
    });

    it('does not notice with an explicit fallbackLng, also with dev', async () => {
      const explicitDev = setup();
      await explicitDev.instance
        .use(backend())
        .init({ debug: true, lng: 'de', fallbackLng: 'dev' });
      expect(explicitDev.warnings("language 'dev'")).toHaveLength(0);
      const viaConstructor = setup();
      viaConstructor.instance.options.fallbackLng = ['en'];
      await viaConstructor.instance.use(backend()).init({ debug: true, lng: 'de' });
      expect(viaConstructor.warnings("language 'dev'")).toHaveLength(0);
    });
  });

  describe('post-processors shared across instances', () => {
    const pp = (name) => ({ type: 'postProcessor', name, process: (value) => `${value}!` });
    const resources = { en: { translation: { key: 'hi' } } };

    it('warns once when an instance runs a post-processor only another instance registered', async () => {
      const owner = i18next.createInstance().use(pp('r1-shared'));
      await owner.init({ lng: 'en', resources });
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', resources, postProcess: 'r1-shared' });
      expect(instance.t('key')).to.equal('hi!');
      instance.t('key');
      expect(warnings("'r1-shared' was registered with use() on another")).toHaveLength(1);
    });

    it("does not warn for its own, its parent's or a plugin-registered post-processor", async () => {
      const { instance, warnings } = setup();
      const plugin = { type: '3rdParty', init: (i18n) => i18n.use(pp('r1-plugin')) };
      await instance
        .use(pp('r1-own'))
        .use(plugin)
        .init({
          debug: true,
          lng: 'en',
          resources,
          postProcess: ['r1-own', 'r1-plugin'],
        });
      expect(instance.t('key')).to.equal('hi!!');
      const clone = instance.cloneInstance();
      expect(clone.t('key')).to.equal('hi!!');
      expect(warnings('was registered with use() on another')).toHaveLength(0);
    });
  });

  describe('logger shared across instances', () => {
    it("warns through the replaced logger when another instance's init() replaces it", async () => {
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', fallbackLng: 'en' });
      await i18next.createInstance().init({ lng: 'en', fallbackLng: 'en' });
      expect(warnings('replaces the logger another i18next instance set')).toHaveLength(1);
    });

    it('does not warn for the same logger, a re-init or a clone', async () => {
      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', fallbackLng: 'en' });
      await instance.init({ debug: true, lng: 'en', fallbackLng: 'en' });
      instance.cloneInstance({ lng: 'de' });
      const logger = instance.modules.logger;
      await i18next
        .createInstance()
        .use(logger)
        .init({ debug: true, lng: 'en', fallbackLng: 'en' });
      expect(warnings('replaces the logger')).toHaveLength(0);
    });
  });

  describe('plugin calling convention', () => {
    it('warns for a backend without callbackApi, not for a marked one', async () => {
      const unmarked = setup();
      await unmarked.instance.use(backend()).init({ debug: true, lng: 'en', fallbackLng: 'en' });
      expect(unmarked.warnings('backend: set callbackApi')).toHaveLength(1);
      const marked = setup();
      await marked.instance
        .use({ ...backend(), callbackApi: true })
        .init({ debug: true, lng: 'en', fallbackLng: 'en' });
      expect(marked.warnings('backend: set callbackApi')).toHaveLength(0);
    });

    it('callbackApi: true passes the callback and the options whatever the parameter count', async () => {
      const created = [];
      class Backend {
        // defaults make Function.length 4, which v26 guessing calls without options
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

    it('reloadResources() without languages reloads nothing instead of throwing', async () => {
      const read = vi.fn((lng, ns, callback) => callback(null, {}));
      const instance = i18next.createInstance().use({ type: 'backend', callbackApi: true, read });
      await instance.init({});
      expect(instance.languages).to.equal(undefined);
      read.mockClear();
      await instance.services.utils.reloadResources();
      expect(read).not.toHaveBeenCalled();
    });
  });

  describe('output that changes in v27', () => {
    it("warns once for a value with '/' under the default escape, and for an object hit", async () => {
      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'en',
        resources: { en: { translation: { price: 'Costs {{v}}', obj: { a: 'b' } } } },
      });
      expect(instance.t('price', { v: '$10/month' })).to.equal('Costs $10&#x2F;month');
      instance.t('price', { v: '1/2' });
      expect(instance.t('obj')).to.contain('returned an object instead of string');
      expect(warnings("from v27 the default escape leaves '/'")).toHaveLength(1);
      expect(warnings('from v27 t() returns the key')).toHaveLength(1);
    });

    it("does not warn about '/' when escaping is forced per call over escapeValue: false", async () => {
      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'en',
        interpolation: { escapeValue: false },
        resources: { en: { translation: { price: 'Costs {{v}}' } } },
      });
      // react-i18next Trans does this and decodes the entities after parsing
      instance.t('price', { v: '$10/month', interpolation: { escapeValue: true } });
      expect(warnings("leaves '/'")).toHaveLength(0);
    });

    it("does not warn about '/' with a custom escape or escapeValue: false", async () => {
      const { instance, warnings } = setup();
      await instance.init({
        debug: true,
        lng: 'en',
        interpolation: { escape: (v) => v },
        resources: { en: { translation: { price: 'Costs {{v}}' } } },
      });
      instance.t('price', { v: '$10/month' });
      instance.t('price', { v: '$10/month', interpolation: { escapeValue: false } });
      expect(warnings("leaves '/'")).toHaveLength(0);
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

    it('warns once when such a code from a detector or changeLanguage() is used, and still uses it', async () => {
      const { instance, warnings } = setup();
      await instance.use(detector(markup)).init({ debug: true, fallbackLng: 'en', resources: {} });
      expect(instance.language).to.equal(markup);
      await instance.changeLanguage('a/b');
      await instance.changeLanguage('a/b');
      expect(instance.language).to.equal('a/b');
      const msgs = warnings('from v27 such a code is refused');
      expect(msgs).toHaveLength(2);
      expect(msgs[0]).to.contain(markup);
    });

    it('never runs without debug, and passes the code to a fallbackLng function', async () => {
      const fallbackLng = vi.fn((code) => (code.startsWith('de') ? ['de'] : ['en']));
      const quiet = i18next.createInstance();
      await quiet.init({ lng: 'en', fallbackLng, resources: {} });
      fallbackLng.mockClear();
      await quiet.changeLanguage('en US');
      expect(quiet.language).to.equal('en US');

      const { instance, warnings } = setup();
      await instance.init({ debug: true, lng: 'en', fallbackLng, resources: {} });
      await instance.changeLanguage('de AT');
      expect(warnings('such a code is refused')).toHaveLength(1);
    });

    it('does not warn with supportedLngs, for configured codes or for codes of a safe shape', async () => {
      const supported = setup();
      await supported.instance
        .use(detector(markup))
        .init({ debug: true, supportedLngs: ['en'], fallbackLng: 'en', resources: {} });
      expect(supported.instance.language).to.equal('en');

      const configured = setup();
      await configured.instance.init({
        debug: true,
        lng: 'my lang',
        fallbackLng: 'en',
        resources: { 'my lang': { translation: { key: 'value' } } },
      });
      await configured.instance.changeLanguage('en_US');
      await configured.instance.changeLanguage('sr@latin');

      expect(supported.warnings('such a code is refused')).toHaveLength(0);
      expect(configured.warnings('such a code is refused')).toHaveLength(0);
    });
  });
});
