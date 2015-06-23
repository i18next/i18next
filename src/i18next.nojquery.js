function addJqueryLikeFunctionality() {

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

        if (attr === 'html') {
            ele.innerHTML = translate(key, options);
        } else if (attr === 'text') {
            ele.textContent = translate(key, options);
        } else if (attr === 'prepend') {
            ele.insertAdjacentHTML(translate(key, options), 'afterbegin');
        } else if (attr === 'append') {
            ele.insertAdjacentHTML(translate(key, options), 'beforeend');
        } else {
            ele.setAttribute(attr, translate(key, options));
        }
    }

    function localize(ele, options) {
        var key = ele.getAttribute(o.selectorAttr);
        if (!key && typeof key !== 'undefined' && key !== false) key = ele.textContent || ele.value;
        if (!key) return;

        var target = ele
          , targetSelector = ele.getAttribute("i18n-target");
        if (targetSelector) {
            target = ele.querySelector(targetSelector) || ele;
        }
        
        if (key.indexOf(';') >= 0) {
            var keys = key.split(';'), index = 0, length = keys.length;
            
            for ( ; index < length; index++) {
                if (keys[index] !== '') parse(target, keys[index], options);
            }

        } else {
            parse(target, key, options);
        }
    }

    // fn
    i18n.translateObject = function (object, options) {
        // localize childs
        var elements =  object.querySelectorAll('[' + o.selectorAttr + ']');
        var index = 0, length = elements.length;
        for ( ; index < length; index++) {
            localize(elements[index], options);
        }
    };
}
