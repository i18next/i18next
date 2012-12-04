function addJqueryFunct() {
    // $.t shortcut
    $.t = $.t || translate;

    function parse(ele, key, options) {
        if (key.length === 0) return;

        var attr = 'text';

        if (key.indexOf('[') === 0) {
            var parts = key.split(']');
            key = parts[1];
            attr = parts[0].substr(1, parts[0].length-1);
        }

        if (key.indexOf(';') === key.length-1) {
            key = key.substr(0, key.length-2);
        }

        var optionsToUse;
        if (attr === 'html') {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
            ele.html($.t(key, optionsToUse));
        } 
        else if (attr === 'text') {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.text() }, options) : options;
            ele.text($.t(key, optionsToUse));
        } else {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.attr(attr) }, options) : options;
            ele.attr(attr, $.t(key, optionsToUse));
        }
    }

    function localize(ele, options) {
        var key = ele.attr(o.selectorAttr);
        if (!key) return;

        if (!options && o.useDataAttrOptions === true) {
            options = ele.data("i18n-options");
        }
        options = options || {};

        if (key.indexOf(';') <= key.length-1) {
            var keys = key.split(';');

            $.each(keys, function(m, k) {
                parse(ele, k, options);
            });

        } else {
            parse(ele, k, options);
        }

        if (o.useDataAttrOptions === true) ele.data("i18n-options", options);
    }

    // fn
    $.fn.i18n = function (options) {
        return this.each(function() {
            // localize element itself
            localize($(this), options);

            // localize childs
            var elements =  $(this).find('[' + o.selectorAttr + ']');
            elements.each(function() { 
                localize($(this), options);
            });
        });
    };
}
