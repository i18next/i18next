import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';
import * as defaultFc from '../../src/defaults';

const defaults = defaultFc.get();

describe('defaults', () => {
  it('the typings document the runtime default of each top-level boolean option', () => {
    const typings = readFileSync(new URL('../../typescript/options.d.ts', import.meta.url), 'utf8');
    // `@default true|false`, the rest of the doc comment, then the option name
    const documented = [
      ...typings.matchAll(/@default (true|false)\r?\n(?:\s*\*.*\n)*?\s*\*\/\r?\n\s*(\w+)\??:/g),
    ].filter(([, , name]) => typeof defaults[name] === 'boolean');
    expect(documented.length).toBeGreaterThan(10);
    documented.forEach(([, doc, name]) =>
      expect(`${name}: ${defaults[name]}`).toBe(`${name}: ${doc}`),
    );
  });

  it('it should have default shortcut', () => {
    expect(defaults.overloadTranslationOptionHandler(['key', 'my default value'])).to.eql({
      defaultValue: 'my default value',
    });
  });

  it('defaultValue as option', () => {
    expect(
      defaults.overloadTranslationOptionHandler(['key', { defaultValue: 'option default value' }]),
    ).to.eql({ defaultValue: 'option default value' });
  });

  it('description', () => {
    expect(
      defaults.overloadTranslationOptionHandler(['key', 'my default value', 'the description']),
    ).to.eql({ defaultValue: 'my default value', tDescription: 'the description' });
  });

  it('description with options defaultValue', () => {
    // Options overwrites params default value
    expect(
      defaults.overloadTranslationOptionHandler(['key', 'my default value', 'the description']),
    ).to.eql({ defaultValue: 'my default value', tDescription: 'the description' });
  });

  it('interpolation', () => {
    expect(
      defaults.overloadTranslationOptionHandler([
        'key',
        'my default value {{params}}',
        { params: 'the value' },
      ]),
    ).to.eql({ defaultValue: 'my default value {{params}}', params: 'the value' });
  });

  it('interpolation with options defaultValue', () => {
    // Options overwrites params default value
    expect(
      defaults.overloadTranslationOptionHandler([
        'key',
        'my default value {{params}}',
        { defaultValue: 'options default value', params: 'the value' },
      ]),
    ).to.eql({ defaultValue: 'options default value', params: 'the value' });
  });

  it('interpolation description', () => {
    expect(
      defaults.overloadTranslationOptionHandler([
        'key',
        'my default value {{params}}',
        'the description',
        { params: 'the value' },
      ]),
    ).to.eql({
      defaultValue: 'my default value {{params}}',
      params: 'the value',
      tDescription: 'the description',
    });
  });

  it('interpolation description with options defaultValue', () => {
    // Options overwrites params default value
    expect(
      defaults.overloadTranslationOptionHandler([
        'key',
        'my default value {{params}}',
        'the description',
        { defaultValue: 'options default value', params: 'the value' },
      ]),
    ).to.eql({
      defaultValue: 'options default value',
      params: 'the value',
      tDescription: 'the description',
    });
  });

  it('it should not have a default format function (legacy format removed)', () => {
    expect(defaults.interpolation.format).to.be.undefined;
  });
});
