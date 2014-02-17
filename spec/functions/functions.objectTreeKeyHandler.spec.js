describe('using objectTreeKeyHandler', function() {

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, {
      objectTreeKeyHandler: function(key, value, lng, ns, opts) {
        return i18n.t(key + '.a');
      },
      resStore: {
        'en-US': { translation: { 'simpleTest': { a: 'a value', b: 'b value' } } }
      },
      returnObjectTrees: false
    }), function(t) { done(); } );
  });

  it('it should apply objectTreeKeyHandler', function() {
    expect(i18n.t('simpleTest')).to.be('a value');
  });

});