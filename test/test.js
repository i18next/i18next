asyncTest("inject resStore on init", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        dynamicLoad: false,
        useLocalStorage: false,
        debug: true,
        resStore: {
            dev: { translation: { simpleTest_dev: 'ok_from_dev' } },
            en: { translation: { simpleTest_en: 'ok_from_en' } },            
            'en-US': { translation: { 'simpleTest_en-US': 'ok_from_en-US' } }
        }
    }, function(t) {
        equals(t('simpleTest_en-US'),'ok_from_en-US', 'from specific lng with namespace given');
        equals(t('simpleTest_en'),'ok_from_en', 'from unspecific lng with namespace given');
        equals(t('simpleTest_dev'),'ok_from_dev', 'from fallback lng with namespace given');

        start();
    });
});

asyncTest("accessing an invalid key which returns an object won't fail silently", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        dynamicLoad: false,
        useLocalStorage: false,
        resStore: {
            dev: { translation: { simpleTest_dev: 'ok_from_dev' } },
            en: { translation: { simpleTest_en: 'ok_from_en' } },            
            'en-US': { translation: { 
                'simpleTest_en-US': 'ok_from_en-US',
                'nested': { 'nested' : 'nested' }
            } }
        }
    }, function(t) {
        equals(t('nested'),'key \'translation:nested (en-US)\' returned a object instead of string.', 'access nested key object');
        start();
    });
});

asyncTest("lowercase lng will be uppercased by default", function() {
    $.i18n.init({
        lng: 'en-us',
        lowerCaseLng: false,
        ns: 'translation',
        dynamicLoad: false,
        useLocalStorage: false,
        resStore: {
            dev: { translation: { simpleTest_dev: 'ok_from_dev' } },
            en: { translation: { simpleTest_en: 'ok_from_en' } },            
            'en-US': { translation: { 'simpleTest_en-US': 'ok_from_en-US' } }
        }
    }, function(t) {
        equals(t('simpleTest_en-US'),'ok_from_en-US', 'from specific lng with namespace given');
        equals(t('simpleTest_en'),'ok_from_en', 'from unspecific lng with namespace given');
        equals(t('simpleTest_dev'),'ok_from_dev', 'from fallback lng with namespace given');

        start();
    });
});

asyncTest("lowercase lng will work if option set", function() {
    $.i18n.init({
        lng: 'en-us',
        lowerCaseLng: true,
        ns: 'translation',
        dynamicLoad: false,
        useLocalStorage: false,
        resStore: {
            dev: { translation: { simpleTest_dev: 'ok_from_dev' } },
            en: { translation: { simpleTest_en: 'ok_from_en' } },            
            'en-us': { translation: { 'simpleTest_en-US': 'ok_from_en-US' } }
        }
    }, function(t) {
        equals(t('simpleTest_en-US'),'ok_from_en-US', 'from specific lng with namespace given');
        equals(t('simpleTest_en'),'ok_from_en', 'from unspecific lng with namespace given');
        equals(t('simpleTest_dev'),'ok_from_dev', 'from fallback lng with namespace given');

        start();
    });
});

asyncTest("load one namespace", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'ns.special',
        dynamicLoad: false,
        useLocalStorage: false,
        resStore: false
    }, function(t) {
        equals(t('test.simple_fallback_en-US'),'ok_from_special_en-US', 'from specific lng with namespace given');
        equals(t('test.simple_fallback_en'),'ok_from_special_en', 'from unspecific lng with namespace given');
        equals(t('test.simple_fallback_dev'),'ok_from_special_dev', 'from fallback lng with namespace given');

        start();
    });
});

asyncTest("load two namespaces", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'},
        dynamicLoad: false,
        useLocalStorage: false,
        resStore: false
    }, function(t) {
        //$('#add').text($.t('ns.common:add'));
        equals(t('ns.common:test.simple_fallback_en-US'),'ok_from_common_en-US', 'from specific lng with namespace given');
        equals(t('ns.common:test.simple_fallback_en'),'ok_from_common_en', 'from unspecific lng with namespace given');
        equals(t('ns.common:test.simple_fallback_dev'),'ok_from_common_dev', 'from fallback lng with namespace given');

        equals(t('test.simple_fallback_en-US'),'ok_from_special_en-US', 'from specific lng with namespace given');
        equals(t('test.simple_fallback_en'),'ok_from_special_en', 'from unspecific lng with namespace given');
        equals(t('test.simple_fallback_dev'),'ok_from_special_dev', 'from fallback lng with namespace given');

        start();
    });
});

asyncTest("load non-static (dynamcic) route", function() {

    var res = {
        dev: { translation: { simpleTest_dev: 'ok_from_dev' } },
        en: { translation: { simpleTest_en: 'ok_from_en' } },            
        'en-US': { translation: { 'simpleTest_en-US': 'ok_from_en-US' } }
    };

    var server = sinon.fakeServer.create();

    server.respondWith([200, { "Content-Type": "application/json" },
                        JSON.stringify(res)]);

    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        resGetPath: 'locales/resources.json?lng=__lng__&ns=__ns__',
        dynamicLoad: true,
        useLocalStorage: false
    }, function(t) {
        equals(t('simpleTest_en-US'),'ok_from_en-US', 'from specific lng with namespace given');
        equals(t('simpleTest_en'),'ok_from_en', 'from unspecific lng with namespace given');
        equals(t('simpleTest_dev'),'ok_from_dev', 'from fallback lng with namespace given');

        server.restore();
        start();
    });

    server.respond();
});

asyncTest("extended functions", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
            dev: { translation: { 
                    nesting1: '1 $t(nesting2)'
                } 
            },
            en: { translation: { 
                    nesting2: '2 $t(nesting3)' 
                } 
            },            
            'en-US': { translation: { 
                    nesting3: '3',
                    pluralTest: 'no plural',
                    pluralTest_plural: 'plural',
                    interpolationTest: 'added __toAdd__',
                    interpolationTest2: 'added __toAdd__ __toAdd__ twice'
                } 
            }
        }
    }, function(t) {
        equals(t('nesting1'),'1 2 3', 'nesting through 3 lngs');
        equals(t('pluralTest', {count: 0}), 'plural', 'call plural with count = 0');
        equals(t('pluralTest', {count: 1}), 'no plural', 'call plural with count = 1');
        equals(t('pluralTest', {count: 2}), 'plural', 'call plural with count = 2');
        equals(t('interpolationTest', {toAdd: 'something'}), 'added something', 'insert variable into resource');
        equals(t('interpolationTest2', {toAdd: 'something'}), 'added something something twice', 'insert variable into resource');

        start();
    });
});

asyncTest("extended plural support", function() {
    $.i18n.init({
        lng: 'sl',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
            dev: { translation: { } },
            sl: { translation: { 
                    beer: 'Pivo',
                    beer_plural_two: 'Pivi',
                    beer_plural_few: 'Piva',
                    beer_plural: 'no idea ;)'
                } 
            },            
            'sl-??': { translation: { } }
        }
    }, function(t) {
        equals(t('beer', {count: 0}), 'no idea ;)', 'call plural with count = 0');
        equals(t('beer', {count: 1}), 'Pivo', 'call plural with count = 1');
        equals(t('beer', {count: 2}), 'Pivi', 'call plural with count = 2');
        equals(t('beer', {count: 3}), 'Piva', 'call plural with count = 3');
        equals(t('beer', {count: 4}), 'Piva', 'call plural with count = 4');
        equals(t('beer', {count: 5}), 'no idea ;)', 'call plural with count = 5');

        start();
    });
});

asyncTest("extended plural support with zero", function() {
    $.i18n.init({
        lng: 'ar',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
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
        }
    }, function(t) {
        equals(t('key', {count: 0}), 'zero', 'call plural with count = 0');
        equals(t('key', {count: 1}), 'singular', 'call plural with count = 1');
        equals(t('key', {count: 2}), 'two', 'call plural with count = 2');
        equals(t('key', {count: 3}), 'few', 'call plural with count = 3');
        equals(t('key', {count: 4}), 'few', 'call plural with count = 4');
        equals(t('key', {count: 104}), 'few', 'call plural with count = 104');
        equals(t('key', {count: 11}), 'many', 'call plural with count = 11');
        equals(t('key', {count: 99}), 'many', 'call plural with count = 99');
        equals(t('key', {count: 199}), 'many', 'call plural with count = 199');
        equals(t('key', {count: 100}), 'plural', 'call plural with count = 100');

        start();
    });
});

asyncTest("context support", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
            dev: { translation: { } },
            en: { translation: { 
                    friend_context: 'A friend',
                    friend_context_male: 'A boyfriend',
                    friend_context_female: 'A girlfriend'
                } 
            },            
            'en-US': { translation: { } }
        }
    }, function(t) {
        equals(t('friend_context'), 'A friend', 'call without context');
        equals(t('friend_context', {context: ''}), 'A friend', 'call with empty context');
        equals(t('friend_context', {context: 'male'}), 'A boyfriend', 'call with context = male');
        equals(t('friend_context', {context: 'female'}), 'A girlfriend', 'call with context = female');

        start();
    });
});

asyncTest("context support with plurals", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
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
        }
    }, function(t) {
        equals(t('friend_context', { count: 1 }), '1 friend', 'call without context and count = 1');
        equals(t('friend_context', {context: '', count: 1 }), '1 friend', 'call with empty context and count = 1');
        equals(t('friend_context', {context: 'male', count: 1 }), '1 boyfriend', 'call with context = male and count = 1');
        equals(t('friend_context', {context: 'female', count: 1 }), '1 girlfriend', 'call with context = female and count = 1');
        
        equals(t('friend_context', { count: 10 }), '10 friends', 'call without context and count = 10');
        equals(t('friend_context', {context: '', count: 10 }), '10 friends', 'call with empty context and count = 10');
        equals(t('friend_context', {context: 'male', count: 10 }), '10 boyfriends', 'call with context = male and count = 10');
        equals(t('friend_context', {context: 'female', count: 10 }), '10 girlfriends', 'call with context = female and count = 10');
        start();
    });
});

asyncTest("jquery shortcut", function() {
    var testJqueryShortcut = function() {
        equals($.t('simpleTest_en-US'),'ok_from_en-US', 'via jquery shortcut');
        start();
    };

    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {         
            'en-US': { translation: { 'simpleTest_en-US': 'ok_from_en-US' } }
        }
    }, function(t) {
        testJqueryShortcut();
    });
});

asyncTest("basic binding (.i18n()) test", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {         
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
        }
    }, function(t) {
        // given
        $('#qunit-fixture').append('<button id="testBtn" data-i18n="simpleTest"></button>');

        // when
        $('#qunit-fixture').i18n();

        // then
        equals($('#testBtn').text(),'ok_from_en-US', 'set text via fn .i18n()');
        start();
    });
});

asyncTest("binding on object itself (.i18n()) test", function() {
    $.i18n.init({
        lng: 'en-US',
        ns: 'translation',
        useLocalStorage: false,
        resStore: {         
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
        }
    }, function(t) {
        // given
        $('#qunit-fixture').append('<button id="testBtn" data-i18n="simpleTest"></button>');

        // when
        $('#testBtn').i18n();

        // then
        equals($('#testBtn').text(),'ok_from_en-US', 'set text via fn .i18n()');
        start();
    });
});

asyncTest("extended binding (.i18n()) test", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {         
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } }
        }
    }, function(t) {
        // given
        $('#qunit-fixture').append('<button id="testBtn" data-i18n="[title]simpleTest;simpleTest"></button>');

        // when
        $('#qunit-fixture').i18n();

        // then
        equals($('#testBtn').text(),'ok_from_en-US', 'set text via fn .i18n()');
        equals($('#testBtn').attr('title'),'ok_from_en-US', 'set other attr via fn .i18n()');
        start();
    });
});

asyncTest("basic binding (.i18n()) test with options", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
            'en-US': { translation: { 'simpleTest': '__firstoption__' } }
        }
    }, function(t) {
        // given
        $('#qunit-fixture').append('<button id="testBtn" data-i18n="simpleTest"></button>');

        // when
        $('#qunit-fixture').i18n({"firstoption":"ok_via_options"});

        // then
        equals($('#testBtn').text(),'ok_via_options', 'set text via fn .i18n(options)');
        start();
    });
});

asyncTest("binding (.i18n()) test with nested options", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {
            'en-US': { translation: { 'simpleTest': '__rootoption.first__ and then __rootoption.second__' } }
        }
    }, function(t) {
        // given
        $('#qunit-fixture').append('<button id="testBtn" data-i18n="simpleTest"></button>');

        // when
        $('#qunit-fixture').i18n({"rootoption":{"first":"ok_first_nested", "second":"ok_second_nested"}});

        // then
        equals($('#testBtn').text(),'ok_first_nested and then ok_second_nested', 'set text via fn .i18n(nested.options)');
        start();
    });
});

asyncTest("switching lng", function() {
    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        useLocalStorage: false,
        resStore: {          
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
        }
    }, function(t) {
        equals(t('simpleTest'),'ok_from_en-US', 'from specific lng');

        $.i18n.setLng('de-DE', function(t) {
            equals(t('simpleTest'),'ok_from_de-DE', 'from new specific lng');
        });

        start();
    });
});

asyncTest("auto upload missing resources", function() {
    var server = sinon.fakeServer.create();
    var stub = sinon.stub($.i18n.functions, "ajax"); 

    server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

    $.i18n.init({
        lng: 'en-US',
        lowerCaseLng: false,
        ns: 'translation',
        sendMissing: true,
        useLocalStorage: false,
        resStore: {          
            'en-US': { translation: { } },
            'en': { translation: { } },
            'dev': { translation: { } }
        }
    }, function(t) {
        t('simpleTest');
        server.respond();

        ok(stub.calledOnce); 

        server.restore();
        stub.restore();
        start();
    });
});
