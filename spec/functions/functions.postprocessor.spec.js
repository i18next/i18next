describe('postprocessing tranlation', function() {

  describe('having a postprocessor', function() {

    before(function(){
      i18n.addPostProcessor('myProcessor', function(val, key, opts) {
        return 'ok_from_postprocessor';
      });
      i18n.addPostProcessor('myProcessor2', function(val, key, opts) {
        return val + ' ok' ;
      });
    });

    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
        resStore: {
          'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
          'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
        }
      }), function(t) { done(); } );
    });

    it('it should postprocess the translation by passing in postProcess name to t function', function() {
      expect(i18n.t('simpleTest', {postProcess: 'myProcessor'})).to.be('ok_from_postprocessor');
    });

    it('it should postprocess on default value', function() {
      expect(i18n.t('notFound1', {defaultValue: 'defaultValue', postProcess: 'myProcessor2'})).to.be('defaultValue ok');
    });

    it('it should postprocess on missing value', function() {
      expect(i18n.t('notFound2', {postProcess: 'myProcessor2'})).to.be('notFound2 ok');
    });

    it('it should postprocess with multiple post processors', function() {
      expect(i18n.t('simpleTest', {postProcess: ['myProcessor', 'myProcessor2']})).to.be('ok_from_postprocessor ok');
    });

    describe('or setting it as default on init', function() {

      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          resStore: {
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
          },
          postProcess: 'myProcessor'
        }), function(t) { done(); } );
      });

      it('it should postprocess the translation by default', function() {
        expect(i18n.t('simpleTest')).to.be('ok_from_postprocessor');
      });

    });

  });

});