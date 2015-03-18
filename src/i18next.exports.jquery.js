// Export the i18next object for **CommonJS**.
// If we're not in CommonJS, add `i18n` to the
// global object or to jquery.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18n;
    if (!$) {
        try {
            $ = require('jquery');
        } catch(e) {
            // just ignore
        }
    }

} else {
    root.i18n = root.i18n || i18n;
}

if ($) {
    $.i18n = $.i18n || i18n;
}
