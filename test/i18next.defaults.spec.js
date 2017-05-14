import * as defaultFc from '../src/defaults';
const defaults = defaultFc.get();

describe('defaults', () => {

  it('it should have default shortcut', () => {
    expect(defaults.overloadTranslationOptionHandler(['key', 'my default value'])).to.eql({ defaultValue: 'my default value' });
  });

  it('it should have default format function', () => {
    expect(defaults.interpolation.format('my value', '###', 'de')).to.equal('my value');
  });

});
