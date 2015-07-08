describe('CI mode', function() {

  beforeEach(function(done) {
    i18n.init(i18n.functions.extend(opts, {
      resStore: {
        'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
        'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
      }
    }), function(t) { done(); } );
  });

  it('it should provide resources for set language', function(done) {
    expect(i18n.t('simpleTest')).to.be('ok_from_en-US');

    i18n.setLng('CIMode', function(err, t) {
        expect(t('simpleTest')).to.be('simpleTest');
        done();
    });

  });

});
