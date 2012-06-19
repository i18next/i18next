describe('i18next', function() {

  var i18n = $.i18n
    , opts;

  beforeEach(function() {
    opts = {
      lng: 'en-US',
      lowerCaseLng: false,
      ns: 'translation',
      resGetPath: 'locales/__lng__/__ns__.json',
      dynamicLoad: false,
      useLocalStorage: false,
      sendMissing: false,
      resStore: false,
      getAsync: true,
      returnObjectTrees: false,
      debug: true
    };
  });

  describe('Initialisation', function() {

    describe('with passed in resource set', function() {

      var resStore = {
        dev: { translation: { 'simple_dev': 'ok_from_dev' } },
        en: { translation: { 'simple_en': 'ok_from_en' } },            
        'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });

      it('it should provide passed in resources for translation', function() {
        expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
        expect(i18n.t('simple_en')).to.be('ok_from_en');
        expect(i18n.t('simple_dev')).to.be('ok_from_dev');
      });

    });

    describe('loading from server', function() {

      describe('with static route', function() {

        beforeEach(function(done) {
          i18n.init(opts, function(t) { done(); });
        });

        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });

      });

      describe('with dynamic route', function() {

        beforeEach(function(done) {

          var res = {
            dev: { translation: { 'simple_dev': 'ok_from_dev' } },
            en: { translation: { 'simple_en': 'ok_from_en' } },
            'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
          };

          var server = sinon.fakeServer.create();
          server.autoRespond = true;

          server.respondWith([200, { "Content-Type": "application/json" }, JSON.stringify(res)]);

          i18n.init( $.extend(opts, { 
              resGetPath: 'locales/resources.json?lng=__lng__&ns=__ns__',
              dynamicLoad: true }),
            function(t) { server.restore(); done(); });
        });

        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });

      });

    });

    describe('advanced initialisation options', function() {

      describe('with synchronous flag', function() {

        beforeEach(function() {
          i18n.init( $.extend(opts, { getAsync: false }) );
        });

        it('it should provide loaded resources for translation', function() {
          expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          expect(i18n.t('simple_en')).to.be('ok_from_en');
          expect(i18n.t('simple_dev')).to.be('ok_from_dev');
        });

      });

      describe('with namespace', function() {

        describe('with one namespace set', function() {

          beforeEach(function(done) {
            i18n.init( $.extend(opts, { ns: 'ns.special'} ),
              function(t) { done(); });
          });

          it('it should provide loaded resources for translation', function() {
            expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
            expect(i18n.t('simple_en')).to.be('ok_from_special_en');
            expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');
          });

        });

        describe('with more than one namespace set', function() {

          beforeEach(function(done) {
            i18n.init( $.extend(opts, { ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'} } ),
              function(t) { done(); });
          });

          it('it should provide loaded resources for translation', function() {
            // default ns
            expect(i18n.t('simple_en-US')).to.be('ok_from_special_en-US');
            expect(i18n.t('simple_en')).to.be('ok_from_special_en');
            expect(i18n.t('simple_dev')).to.be('ok_from_special_dev');

            // ns prefix
            expect(i18n.t('ns.common:simple_en-US')).to.be('ok_from_common_en-US');
            expect(i18n.t('ns.common:simple_en')).to.be('ok_from_common_en');
            expect(i18n.t('ns.common:simple_dev')).to.be('ok_from_common_dev');
          });

        });

      });

      describe('using function provided in callback\'s argument', function() {

        var cbT;

        beforeEach(function(done) {
          i18n.init(opts, function(t) { cbT = t; done(); });
        });

        it('it should provide loaded resources for translation', function() {
          expect(cbT('simple_en-US')).to.be('ok_from_en-US');
          expect(cbT('simple_en')).to.be('ok_from_en');
          expect(cbT('simple_dev')).to.be('ok_from_dev');
        });

      });

      describe('with lowercase flag', function() {

        describe('default behaviour will uppercase specifc country part.', function() {

          beforeEach(function() {
            i18n.init( $.extend(opts, { 
              lng: 'en-us',
              resStore: {
                'en-US': { translation: { 'simple_en-US': 'ok_from_en-US' } }
              }
            }, function(t) { done(); }) );
          });

          it('it should translate the uppercased lng value', function() {
            expect(i18n.t('simple_en-US')).to.be('ok_from_en-US');
          });

          it('it should get uppercased set language', function() {
            expect(i18n.lng()).to.be('en-US');
          });

        });

        describe('overridden behaviour will accept lowercased country part.', function() {

          beforeEach(function() {
            i18n.init( $.extend(opts, { 
              lng: 'en-us',
              lowerCaseLng: true,
              resStore: {
                'en-us': { translation: { 'simple_en-us': 'ok_from_en-us' } }
              }
            }, function(t) { done(); }) );
          });

          it('it should translate the lowercase lng value', function() {
            expect(i18n.t('simple_en-us')).to.be('ok_from_en-us');
          });

          it('it should get lowercased set language', function() {
            expect(i18n.lng()).to.be('en-us');
          });

        });

      });

    });

  });

/* ################################################################################
###################################################################################
##########
##########  BASIC FUNCTIONS
##########
###################################################################################
#################################################################################*/

  describe('basic functionality', function() {

    describe('setting language', function() {

      beforeEach(function(done) {
        i18n.init( $.extend(opts, {
          resStore: {
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
          }
        }), function(t) { done(); } );
      });

      it('it should provide resources for set language', function(done) {
        expect(i18n.t('simpleTest')).to.be('ok_from_en-US');

        i18n.setLng('de-DE', function(t) {
            expect(t('simpleTest')).to.be('ok_from_de-DE');
            done();
        });

      });

    });

    describe('post missing resources', function() {

      var server, stub; 

      beforeEach(function(done) {
        server = sinon.fakeServer.create();
        stub = sinon.stub(i18n.functions, "ajax"); 

        server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

        i18n.init( $.extend(opts, {
          sendMissing: true,
          resStore: {
            'en-US': { translation: {  } },
            'en': { translation: {  } },
            'dev': { translation: {  } }
          }
        }), function(t) { done(); } );
      });

      afterEach(function() {
        server.restore();
        stub.restore();
      });

      it('it should post missing resource to server', function() {
        i18n.t('missing');
        server.respond();
        expect(stub.calledOnce).to.be(true);
      });

    });

  });

/* ################################################################################
###################################################################################
##########
##########  TRANSLATION FUNCTIONS
##########
###################################################################################
#################################################################################*/

  describe('translation functionality', function() {

    describe('accessing nested values', function() {

      beforeEach(function(done) {
        i18n.init(opts, function(t) { done(); } );
      });

      it('it should return nested string', function() {
        expect(i18n.t('test.simple_en-US')).to.be('ok_from_en-US');
      });

      it('it should not fail silently on accessing a objectTree', function() {
        expect(i18n.t('test')).to.be('key \'translation:test (en-US)\' returned a object instead of string.');
      });

      describe('optional return an objectTree for UI components,...', function() {

        describe('with init flag', function() {

          var resStore = {
            dev: { translation: {  } },
            en: { translation: {  } },            
            'en-US': { 
              translation: {                      
                test: { res: 'added __replace__' }
              } 
            }
          };
          
          beforeEach(function(done) {
            i18n.init( $.extend(opts, { 
              returnObjectTrees: true,
              resStore: resStore }
              ), function(t) { done(); });
          });

          it('it should return objectTree applying options', function() {
            expect(i18n.t('test', { replace: 'two' })).to.eql({ 'res': 'added two' });
          });

        });

        describe('with flag in options', function() {

          beforeEach(function(done) {
            i18n.init($.extend(opts, { returnObjectTrees: false }),
              function(t) { done(); } );
          });

          it('it should return objectTree', function() {
            expect(i18n.t('test', { returnObjectTrees: true })).to.eql({ 'simple_en-US': 'ok_from_en-US' });
          });

        });

      });

    });

    describe('resource nesting', function() {
      var resStore = {
        dev: { translation: { nesting1: '1 $t(nesting2)' } },
        en: { translation: { nesting2: '2 $t(nesting3)' } },            
        'en-US': { translation: {  nesting3: '3' } }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });

      it('it should translate nested value', function() {
        expect(i18n.t('nesting1')).to.be('1 2 3');
      });
    });

    describe('interpolation - replacing values inside a string', function() {
      var resStore = {
        dev: { translation: {  } },
        en: { translation: {  } },            
        'en-US': { 
          translation: {                      
            interpolationTest1: 'added __toAdd__',
            interpolationTest2: 'added __toAdd__ __toAdd__ twice',
            interpolationTest3: 'added __child.one__ __child.two__'
          } 
        }
      };
      
      beforeEach(function(done) {
        i18n.init( $.extend(opts, { resStore: resStore }),
          function(t) { done(); });
      });

      it('it should replace passed in key/values', function() {
        expect(i18n.t('interpolationTest1', {toAdd: 'something'})).to.be('added something');
        expect(i18n.t('interpolationTest2', {toAdd: 'something'})).to.be('added something something twice');
        expect(i18n.t('interpolationTest3', { child: { one: '1', two: '2'}})).to.be('added 1 2');
      });
    });

    describe('plural usage', function() {

      describe('basic usage - singular and plural form', function() {
        var resStore = {
          dev: { translation: {  } },
          en: { translation: {  } },            
          'en-US': { 
            translation: {                      
                pluralTest: 'singular',
                pluralTest_plural: 'plural',
                pluralTestWithCount: '__count__ item',
                pluralTestWithCount_plural: '__count__ items'
            } 
          }
        };
        
        beforeEach(function(done) {
          i18n.init( $.extend(opts, { resStore: resStore }),
            function(t) { done(); });
        });

        it('it should provide correct plural or singular form', function() {
          expect(i18n.t('pluralTest', {count: 0})).to.be('plural');
          expect(i18n.t('pluralTest', {count: 1})).to.be('singular');
          expect(i18n.t('pluralTest', {count: 2})).to.be('plural');
          expect(i18n.t('pluralTest', {count: 7})).to.be('plural');

          expect(i18n.t('pluralTestWithCount', {count: 1})).to.be('1 item');
          expect(i18n.t('pluralTestWithCount', {count: 7})).to.be('7 items');
        });
      });

      describe('extended usage - multiple plural forms', function() {
        var resStore = {
            dev: { translation: { } },
            ar: { translation: { 
                key: 'singular',
                key_plural_zero: 'zero',
                key_plural_two: 'two',
                key_plural_few: 'few',
                key_plural_many: 'many',
                key_plural: 'plural'
              } 
            },            
            'ar-??': { translation: { } }
        };
        
        beforeEach(function(done) {
          i18n.init( $.extend(opts, { lng: 'ar', resStore: resStore }),
            function(t) { done(); });
        });

        it('it should provide correct plural forms', function() {
          expect(i18n.t('key', {count: 0})).to.be('zero');
          expect(i18n.t('key', {count: 1})).to.be('singular');
          expect(i18n.t('key', {count: 2})).to.be('two');
          expect(i18n.t('key', {count: 3})).to.be('few');
          expect(i18n.t('key', {count: 4})).to.be('few');
          expect(i18n.t('key', {count: 104})).to.be('few');
          expect(i18n.t('key', {count: 11})).to.be('many');
          expect(i18n.t('key', {count: 99})).to.be('many');
          expect(i18n.t('key', {count: 199})).to.be('many');
          expect(i18n.t('key', {count: 100})).to.be('plural');
        });
      });

    });

    describe('context usage', function() {

      describe('basic usage', function() {
        var resStore = {
            dev: { translation: { } },
            en: { translation: { 
                friend_context: 'A friend',
                friend_context_male: 'A boyfriend',
                friend_context_female: 'A girlfriend'
              } 
            },            
            'en-US': { translation: { } }
        };
        
        beforeEach(function(done) {
          i18n.init( $.extend(opts, { resStore: resStore }),
            function(t) { done(); });
        });

        it('it should provide correct context form', function() {
          expect(i18n.t('friend_context')).to.be('A friend');
          expect(i18n.t('friend_context', {context: ''})).to.be('A friend');
          expect(i18n.t('friend_context', {context: 'male'})).to.be('A boyfriend');
          expect(i18n.t('friend_context', {context: 'female'})).to.be('A girlfriend');
        });
      });

      describe('extended usage - in combination with plurals', function() {
        var resStore = {
            dev: { translation: { } },
            en: { translation: { 
                friend_context: '__count__ friend',
                friend_context_male: '__count__ boyfriend',
                friend_context_female: '__count__ girlfriend',
                friend_context_plural: '__count__ friends',
                friend_context_male_plural: '__count__ boyfriends',
                friend_context_female_plural: '__count__ girlfriends'
              } 
            },            
            'en-US': { translation: { } }
        };
        
        beforeEach(function(done) {
          i18n.init( $.extend(opts, { resStore: resStore }),
            function(t) { done(); });
        });

        it('it should provide correct context with plural forms', function() {
          expect(i18n.t('friend_context', { count: 1 })).to.be('1 friend');
          expect(i18n.t('friend_context', {context: '', count: 1 })).to.be('1 friend');
          expect(i18n.t('friend_context', {context: 'male', count: 1 })).to.be('1 boyfriend');
          expect(i18n.t('friend_context', {context: 'female', count: 1 })).to.be('1 girlfriend');
          
          expect(i18n.t('friend_context', { count: 10 })).to.be('10 friends');
          expect(i18n.t('friend_context', {context: '', count: 10 })).to.be('10 friends');
          expect(i18n.t('friend_context', {context: 'male', count: 10 })).to.be('10 boyfriends');
          expect(i18n.t('friend_context', {context: 'female', count: 10 })).to.be('10 girlfriends');
        });
      });

    });

  });

/* ################################################################################
###################################################################################
##########
##########  JQUERY STUFF
##########
###################################################################################
#################################################################################*/

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
            $('#container').i18n(); console.log($('#container').html());
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

});