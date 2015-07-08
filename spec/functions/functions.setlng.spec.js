describe('setting language', function() {

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

    i18n.setLng('de-DE', function(err, t) {
        expect(t('simpleTest')).to.be('ok_from_de-DE');
        done();
    });

  });

  it('should be possible to call setLng multiple times to get specialized callbacks', function(done) {
    i18n.setLng('de-DE', { fixLng: true }, function(err, deDE) {
        expect(deDE.lng).to.be('de-DE');

        i18n.setLng('en-US', { fixLng: true }, function(err, enUS) {
            expect(deDE.lng).to.be('de-DE');
            expect(enUS.lng).to.be('en-US');

            expect(deDE('simpleTest')).to.be('ok_from_de-DE');
            expect(enUS('simpleTest')).to.be('ok_from_en-US');

            done();
        });
    });
  })

});
