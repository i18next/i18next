asyncTest("load one namespace", function() {


    $.i18n.init({
        lng: 'en-US',
        ns: 'ns.special',
        useLocalStorage: false
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
        useLocalStorage: false
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
