asyncTest("inject resStore on init", function() {
    $.i18n.init({
        lng: 'en-US',
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

asyncTest("load one namespace", function() {
    $.i18n.init({
        lng: 'en-US',
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
                    interpolationTest: 'added __toAdd__'
                } 
            }
        }
    }, function(t) {
        equals(t('nesting1'),'1 2 3', 'nesting through 3 lngs');
        equals(t('pluralTest', {count: 1}), 'no plural', 'call plural with count = 1');
        equals(t('pluralTest', {count: 2}), 'plural', 'call plural with count = 2');
        equals(t('interpolationTest', {toAdd: 'something'}), 'added something', 'insert variable into resource');

        start();
    });
});

asyncTest("extended plural support", function() {
    $.i18n.init({
        lng: 'sl',
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
        equals(t('beer', {count: 1}), 'Pivo', 'call plural with count = 1');
        equals(t('beer', {count: 2}), 'Pivi', 'call plural with count = 2');
        equals(t('beer', {count: 3}), 'Piva', 'call plural with count = 3');
        equals(t('beer', {count: 4}), 'Piva', 'call plural with count = 4');
        equals(t('beer', {count: 5}), 'no idea ;)', 'call plural with count = 5');

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

asyncTest("extended binding (.i18n()) test", function() {
    $.i18n.init({
        lng: 'en-US',
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

asyncTest("switching lng", function() {
    $.i18n.init({
        lng: 'en-US',
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
    var stub = sinon.stub(jQuery, "ajax"); 

    server.respondWith([200, { "Content-Type": "text/html", "Content-Length": 2 }, "OK"]);

    $.i18n.init({
        lng: 'en-US',
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
