describe('Check for existence of keys', function() {
    var resStore = {
        dev: { translation: { iExist: '' } },
        en: { translation: { } },
        'en-US': { translation: { } }
    };

    beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
            function(t) { done(); });
    });

    it('it should exist', function() {
        expect(i18n.exists('iExist')).to.be(true);
    });

    it('it should not exist', function() {
        expect(i18n.exists('iDontExist')).to.be(false);
    });

    describe('missing on unspecific', function() {
        var resStore = {
            dev: { translation: { iExist: 'text' } },
            en: { translation: { } },
            'en-US': { translation: { empty: '' } }
        };

        beforeEach(function(done) {
            i18n.init(i18n.functions.extend(opts, { resStore: resStore, lng: 'en' }),
                function(t) { done(); });
        });

        it('it should exist', function() {
            expect(i18n.exists('iExist')).to.be(true);
        });

        it('it should not exist', function() {
            expect(i18n.exists('iDontExist')).to.be(false);
        });
    });
});
