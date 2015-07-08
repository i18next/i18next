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
        } else if (attr === 'text') {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.text() }, options) : options;
            ele.text($.t(key, optionsToUse));
        } else if (attr === 'prepend') {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
            ele.prepend($.t(key, optionsToUse));
        } else if (attr === 'append') {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.html() }, options) : options;
            ele.append($.t(key, optionsToUse));
        } else if (attr.indexOf("data-") === 0) {
            var dataAttr = attr.substr(("data-").length);
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.data(dataAttr) }, options) : options;
            var translated = $.t(key, optionsToUse);
            //we change into the data cache
            ele.data(dataAttr, translated);
            //we change into the dom
            ele.attr(attr, translated);
        } else {
            optionsToUse = o.defaultValueFromContent ? $.extend({ defaultValue: ele.attr(attr) }, options) : options;
            ele.attr(attr, $.t(key, optionsToUse));
        }
    }

    function localize(ele, options) {
        var key = ele.attr(o.selectorAttr);
        if (!key && typeof key !== 'undefined' && key !== false) key = ele.text() || ele.val();
        if (!key) return;

        var target = ele
          , targetSelector = ele.data("i18n-target");
        if (targetSelector) {
            target = ele.find(targetSelector) || ele;
        }

        if (!options && o.useDataAttrOptions === true) {
            options = ele.data("i18n-options");
        }
        options = options || {};

        if (key.indexOf(';') >= 0) {
            var keys = key.split(';');

            $.each(keys, function(m, k) {
                if (k !== '') parse(target, k, options);
            });

        } else {
            parse(target, key, options);
        }

        if (o.useDataAttrOptions === true) {
          var clone = $.extend({lng: 'non', lngs: [], _origLng: 'non'}, options);
          delete clone.lng;
          delete clone.lngs;
          delete clone._origLng;
          ele.data("i18n-options", clone);
        }
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
