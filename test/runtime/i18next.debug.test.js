import { describe, it, expect, beforeAll, vi } from 'vitest';
import i18next from '../../src/i18next.js';
import logger from '../../src/logger.js';

describe('i18next debug', () => {
  let logSpy;
  beforeAll(async () => {
    logSpy = vi.spyOn(logger, 'log');
    await i18next.init({
      foo: 'bar',
      debug: true,
    });
    i18next.changeLanguage('en');
  });

  describe('init log options filtering', () => {
    it('logs a subset of the options object', () => {
      expect(logSpy).toHaveBeenCalledWith('initialized', i18next.options);
    });
  });
});
