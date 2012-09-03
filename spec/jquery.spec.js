describe('jQuery integration / specials', function() {

  describe('initialise - use deferrer instead of callback', function() {

    describe('with passed in resource set', function() {

      var resStore = {
        dev: { translation: { 'simple_dev': 'ok_from_dev' } },
        en: { translation: { 'simple_en': 'ok_from_en' } },            
        'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore })).done(function(t) { done(); });
      });

      it('it should provide passed in resources for translation', function() {
        expect($.t('simple_en-US')).to.be('ok_from_en-US');
        expect($.t('simple_en')).to.be('ok_from_en');
        expect($.t('simple_dev')).to.be('ok_from_dev');
      });

    });

    describe('loading from server', function() {

      beforeEach(function(done) {
        i18n.init(opts).done(function() { done(); });
      });

      it('it should provide loaded resources for translation', function() {
        expect($.t('simple_en-US')).to.be('ok_from_en-US');
        expect($.t('simple_en')).to.be('ok_from_en');
        expect($.t('simple_dev')).to.be('ok_from_dev');
      });

    });

  });

  describe('use translation function shortcut $.t', function() {

    beforeEach(function(done) {
      i18n.init(opts, function(t) { done(); });
    });

    it('it should provide translation via $.t', function() {
      expect($.t('simple_en-US')).to.be('ok_from_en-US');
      expect($.t('simple_en')).to.be('ok_from_en');
      expect($.t('simple_dev')).to.be('ok_from_dev');
    });

  });

  describe('using bindings $([selector].i18n())', function() {
      
    describe('basic - setting text', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        setFixtures('<div id="container"><button id="testBtn" data-i18n="simpleTest"></button></div>');

        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) {  done(); });
      });

      it('it should set text of elements inside selector having data-i18n attribute', function() {
        $('#container').i18n();
        expect($('#testBtn').text()).to.be('ok_from_en-US');
      });

      it('it should set text of element itself if having data-i18n attribute', function() {
        $('#testBtn').i18n();
        expect($('#testBtn').text()).to.be('ok_from_en-US');
      });

    });

    describe('extended - setting other attributes', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        setFixtures('<div id="container"><button id="testBtn" data-i18n="[title]simpleTest;simpleTest"></button></div>');

        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) {  done(); });
      });

      it('it should set text of elements inside selector having data-i18n attribute', function() {
        $('#container').i18n();
        expect($('#testBtn').text()).to.be('ok_from_en-US');
      });

      it('it should set attributes of elements inside selector having data-i18n attribute', function() {
        $('#container').i18n();
        expect($('#testBtn').attr('title')).to.be('ok_from_en-US');
      });
      
    });

    describe('extended - pass in options', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        setFixtures('<div id="container"><button id="testBtn" data-i18n="[title]simpleTest;simpleTest"></button></div>');

        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) {  done(); });
      });

      it('it should set text with passed in options', function() {
        $('#container').i18n({ replace: 'replaced' });
        expect($('#testBtn').text()).to.be('replaced ok_from_en-US');
      });
      
    });

    describe('extended - render inner html', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { translation: { 'simpleTest': '<div id="inner">test</div>' } }
      };
      
      beforeEach(function(done) {
        setFixtures('<div id="container" data-i18n="[html]simpleTest"></div>');

        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) {  done(); });
      });

      it('it should set inner html', function() {
        $('#container').i18n();
        expect($('#inner').html()).to.be('test');
      });
      
    });


    describe('extended - read options from data attribute', function() {

      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        setFixtures('<div id="container"><button id="testBtn" data-i18n="[title]simpleTest;simpleTest"></button></div>');

        i18n.init( $.extend(opts, { 
          resStore: resStore,
          useDataAttrOptions: true
        }),
          function(t) {
            $('#container').i18n({ replace: 'replaced' });
            $('#testBtn').text('');
            done(); 
          });
      });

      it('it should set text with attributes options', function() {
        $('#container').i18n(); // without option
        expect($('#testBtn').text()).to.be('replaced ok_from_en-US');
      });
      
    });

  });

});