var utils = {};

utils.mergeOptions = function(options, defaultOptions) {
    if (!options || typeof options === 'function') {
        return defaultOptions;
    }
    
    var merged = {};
    for (var attrname in defaultOptions) { merged[attrname] = defaultOptions[attrname]; }
    for (var attrname in options) { if (options[attrname]) merged[attrname] = options[attrname]; }
    return merged;  
};

utils.getConfig = function() {
    var siteConfig;
    
    try {
        // Usually we check for siteConfig.js in project root.
        siteConfig = require('../../siteConfig');
    } catch(e) {
        try {
            siteConfig = require(process.env.HOME+'/siteConfig'); // Looks for siteConfig in home dir, used for no.de
        } catch(e) {
            throw new Error('Could not load site config.');
        }
    }
    
    return siteConfig;
}

module.exports = utils;