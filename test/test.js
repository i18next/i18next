asyncTest("translation", function() {


    $.i18n.init({
        lng: 'en-US',
        ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'},
        useLocalStorage: false
    }, function(t) {
        //$('#add').text($.t('ns.common:add'));
        equals(t('ns.common:add'),'add');

        
	start();
    });
});
