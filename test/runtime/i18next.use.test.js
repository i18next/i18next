import { describe, it, expect, vi } from 'vitest';
import i18next from '../../src/i18next.js';

describe('i18next.use()', () => {
  describe('passing an undefined module', () => {
    it('it should throw accordingly', () => {
      const badFn = () => i18next.use(undefined);
      expect(badFn).to.throw(/undefined module/);
    });
  });

  describe('passing a module with wrong interface', () => {
    it('it should throw accordingly', () => {
      const badFn = () => i18next.use({});
      expect(badFn).to.throw(/wrong module/);
    });
  });

  describe('replacing a module', () => {
    const backendA = { type: 'backend', read: (lng, ns, cb) => cb(null, {}) };
    const backendB = { type: 'backend', read: (lng, ns, cb) => cb(null, {}) };
    const logger = () => {
      const warn = vi.fn();
      return { warn, module: { type: 'logger', log: () => {}, warn, error: () => {} } };
    };

    it('warns in debug mode once init() has set up the logger', async () => {
      const { warn, module } = logger();
      const instance = i18next.createInstance().use(module).use(backendA).use(backendB);
      expect(instance.modules.backend).to.equal(backendB);
      await instance.init({ debug: true, lng: 'en', fallbackLng: 'en' });
      const msgs = warn.mock.calls.map((args) => args[0][0]);
      expect(msgs.filter((m) => m.includes('replaces the backend'))).toHaveLength(1);
    });

    it('warns right away after init()', async () => {
      const { warn, module } = logger();
      const instance = i18next.createInstance().use(module);
      await instance.init({ debug: true, lng: 'en', fallbackLng: 'en' });
      instance.use({ type: 'formatter', init: () => {}, format: (v) => v, add: () => {} });
      instance.use({ type: 'formatter', init: () => {}, format: (v) => v, add: () => {} });
      const msgs = warn.mock.calls.map((args) => args[0][0]);
      expect(msgs.filter((m) => m.includes('replaces the formatter'))).toHaveLength(1);
    });

    it('does not warn for the same module twice or without debug', async () => {
      const { warn, module } = logger();
      const instance = i18next.createInstance().use(module).use(backendA).use(backendA);
      await instance.init({ debug: true, lng: 'en', fallbackLng: 'en' });
      const quiet = logger();
      await i18next
        .createInstance()
        .use(quiet.module)
        .use(backendA)
        .use(backendB)
        .init({ lng: 'en', fallbackLng: 'en' });
      const msgs = [...warn.mock.calls, ...quiet.warn.mock.calls].map((args) => args[0][0]);
      expect(msgs.filter((m) => m.includes('replaces the backend'))).toHaveLength(0);
    });
  });

  describe('dir()', () => {
    it('returns ltr without a language', () => {
      expect(i18next.createInstance().dir()).to.equal('ltr');
    });
  });
});
