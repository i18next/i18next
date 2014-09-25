describe('using bindings $([selector].i18n())', function() {
    
  describe('basic - setting text', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="simpleTest"></button></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
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
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest"></button></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
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

  describe('extended - empty key -> double ;;', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;;simpleTest"></button></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
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
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest"></button></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
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

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) {  done(); });
    });

    it('it should set inner html', function() {
      $('#container').i18n();
      expect($('#inner').html()).to.be('test');
    });
    
  });

  describe('extended - set data attribute', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': 'someData' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container" data-i18n="[data-test]simpleTest"></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) {  done(); });
    });

    it('it should set data', function() {
      $('#container').i18n();
      expect($('#container').data('test')).to.be('someData');
      expect($('#container').attr('data-test')).to.be('someData');
    });
    
  });

  describe('extended - append html', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': '<div id="inner">test</div>' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container" data-i18n="[append]simpleTest"><div></div></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) {  done(); });
    });

    it('it should append html', function() {
      $('#container').i18n();
      expect($('#container').html()).to.be('<div></div><div id="inner">test</div>');
    });
    
  });

  describe('extended - prepend html', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': '<div id="inner">test</div>' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container" data-i18n="[prepend]simpleTest"><div></div></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) {  done(); });
    });

    it('it should append html', function() {
      $('#container').i18n();
      expect($('#container').html()).to.be('<div id="inner">test</div><div></div>');
    });
    
  });

  describe('extended - with target set to inner element', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': 'test' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container" data-i18n-target="#inner" data-i18n="[html]simpleTest"><div id="inner"></div></div>');

      i18n.init(i18n.functions.extend(opts, { resStore: resStore }),
        function(t) {  done(); });
    });

    it('it should set inner html', function() {
      $('#container').i18n();
      expect($('#inner').html()).to.be('test');
    });
    
  });


  describe('extended - write/read options from data attribute', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest"></button></div>');

      i18n.init(i18n.functions.extend(opts, { 
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

  describe('extended - read options from data attribute', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest': '__replace__ ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '="[title]simpleTest;simpleTest" data-i18n-options={"replace":"replaced"}></button></div>');

      i18n.init(i18n.functions.extend(opts, { 
        resStore: resStore,
        useDataAttrOptions: true
      }),
        function(t) {
          done(); 
        });
    });

    it('it should set text with attributes options', function() {
      $('#container').i18n(); // without option
      expect($('#testBtn').text()).to.be('replaced ok_from_en-US');
    });
    
  });

  describe('extended - read key from inner content', function() {

    var resStore = {
      dev: { translation: {  } },
      en: { translation: {  } },            
      'en-US': { translation: { 'simpleTest2': 'ok_from_en-US' } }
    };
    
    beforeEach(function(done) {
      setFixtures('<div id="container"><button id="testBtn" ' + opts.selectorAttr + '>simpleTest2</button></div>');

      i18n.init(i18n.functions.extend(opts, { 
        resStore: resStore
      }),
        function(t) {
          done(); 
        });
    });

    it('it should read key from inner content', function() {
      $('#container').i18n(); // without option
      expect($('#testBtn').text()).to.be('ok_from_en-US');
    });
    
  });

});