/*
 * Jake JavaScript build tool
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *               http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/
var fs = require('fs')
    , glob; // Lazy-required

// Constants
// ---------------
// List of all the builtin Array methods we want to override
var ARRAY_METHODS = Object.getOwnPropertyNames(Array.prototype)
// Array methods that return a copy instead of affecting the original
    , SPECIAL_RETURN = {
          'concat': true
        , 'slice': true
        , 'filter': true
        , 'map': true
        }
// Default file-patterns we want to ignore
    , DEFAULT_IGNORE_PATTERNS = [
          /(^|[\/\\])CVS([\/\\]|$)/
        , /(^|[\/\\])\.svn([\/\\]|$)/
        , /(^|[\/\\])\.git([\/\\]|$)/
        , /\.bak$/
        , /~$/
        ]
// Ignore core files
    , DEFAULT_IGNORE_FUNCS = [
            function (name) {
                var isDir = false
                    , stats;
                try {
                    stats = fs.statSync(name);
                    isDir = stats.isDirectory();
                }
                catch(e) {}
                return (/(^|[\/\\])core$/).test(name) && !isDir;
            }
        ];

// Utility methods
// ---------------
// Escapes special characters in a string to be used in generating
// a regex
var regexpEscape = (function() {
    var specials = [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\' ]
    , sRE = new RegExp('(\\' + specials.join('|\\') + ')', 'g');
    return function (text) { return text.replace(sRE, '\\$1'); };
})();


var FileList = function () {
    var self = this
        , wrap;

    // Lazy-require glob so that require of this file in cli.js won't bomb
    if (!glob) {
        try {
            glob = require('glob');
        }
        catch(e) {
            console.log('FileList requires glob (https://github.com/isaacs/node-glob). Try `npm install glob`.');
        }
    }

    // List of glob-patterns or specific filenames
    this.pendingAdd = [];
    // Switched to false after lazy-eval of files
    this.pending = true;
    // Used to calculate exclusions from the list of files
    this.excludes = {
      pats: DEFAULT_IGNORE_PATTERNS.slice()
    , funcs: DEFAULT_IGNORE_FUNCS.slice()
    , regex: null
    };
    this.items = [];

    // Wrap the array methods with the delegates
    wrap = function (prop) {
        var arr;
        self[prop] = function () {
            if (self.pending) {
                self.resolve();
            }
            if (typeof self.items[prop] == 'function') {
                // Special method that return a copy
                if (SPECIAL_RETURN[prop]) {
                    arr = self.items[prop].apply(self.items, arguments);
                    return FileList.clone(self, arr);
                }
                else {
                    return self.items[prop].apply(self.items, arguments);
                }
            }
            else {
                return self.items[prop];
            }
        };
    };
    for (var i = 0, ii = ARRAY_METHODS.length; i < ii; i++) {
        wrap(ARRAY_METHODS[i]);
    }

    // Include whatever files got passed to the constructor
    this.include.apply(this, arguments);

    // Fix constructor linkage
    this.constructor = FileList;
};

FileList.prototype = new (function () {
    var globPattern = /[*?\[\{]/;

    var _addMatching = function (pat) {
                var matches = glob.globSync(pat);
                this.items = this.items.concat(matches);
            }

        , _resolveAdd = function (name) {
                if (globPattern.test(name)) {
                    _addMatching.call(this, name);
                }
                else {
                    this.push(name);
                }
            }

        , _calculateExcludeRe = function () {
                var pats = this.excludes.pats
                    , pat
                    , excl = []
                    , matches = [];

                for (var i = 0, ii = pats.length; i < ii; i++) {
                    pat = pats[i];
                    if (typeof pat == 'string') {
                        // Glob, look up files
                        if (/[*?]/.test(pat)) {
                            matches = glob.globSync(pat);
                            excl = excl.concat(matches);
                        }
                        // String for regex
                        else {
                            excl.push(regexpEscape(pat));
                        }
                    }
                    // Regex, grab the string-representation
                    else if (pat instanceof RegExp) {
                        excl.push(pat.toString().replace(/^\/|\/$/g, ''));
                    }
                }
                if (excl.length) {
                    this.excludes.regex = new RegExp('(' + excl.join(')|(') + ')');
                }
                else {
                    this.excludes.regex = /^$/;
                }
            }

        , _resolveExclude = function () {
                var self = this;
                _calculateExcludeRe.call(this);
                // No `reject` method, so use reverse-filter
                this.items = this.items.filter(function (name) {
                    return !self.shouldExclude(name);
                });
            }

    /**
     * Includes file-patterns in the FileList. Should be called with one or more
     * pattern for finding file to include in the list. Arguments should be strings
     * for either a glob-pattern or a specific file-name, or an array of them
     */
    this.include = function () {
        var args = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        for (var i = 0, ii = args.length; i < ii; i++) {
            this.pendingAdd.push(args[i]);
        }
    };

    /**
     * Indicates whether a particular file would be filtered out by the current
     * exclusion rules for this FileList.
     * @param {String} name The filename to check
     * @return {Boolean} Whether or not the file should be excluded
     */
    this.shouldExclude = function (name) {
        if (!this.excludes.regex) {
            _calculateExcludeRe.call(this);
        }
        var excl = this.excludes;
        return excl.regex.test(name) || excl.funcs.some(function (f) {
            return !!f(name);
        });
    };

    /**
     * Excludes file-patterns from the FileList. Should be called with one or more
     * pattern for finding file to include in the list. Arguments can be:
     * 1. Strings for either a glob-pattern or a specific file-name
     * 2. Regular expression literals
     * 3. Functions to be run on the filename that return a true/false
     */
    this.exclude = function () {
        var args = Array.isArray(arguments[0]) ? arguments[0] : arguments
            , arg;
        for (var i = 0, ii = args.length; i < ii; i++) {
            arg = args[i];
            if (typeof arg == 'function' && !(arg instanceof RegExp)) {
                this.excludes.funcs.push(arg);
            }
            else {
                this.excludes.pats.push(arg);
            }
        }
        if (!this.pending) {
            _resolveExclude.call(this);
        }
    };

    /**
     * Populates the FileList from the include/exclude rules with a list of
     * actual files
     */
    this.resolve = function () {
        var name;
        if (this.pending) {
            this.pending = false;
            while ((name = this.pendingAdd.shift())) {
                _resolveAdd.call(this, name);
            }
            _resolveExclude.call(this);
        }
    };

    /**
     * Convert to a plain-jane array
     */
    this.toArray = function () {
        // Call slice to ensure lazy-resolution before slicing items
        var ret = this.slice().items.slice();
        return ret;
    };

    /**
     * Get rid of any current exclusion rules
     */
    this.clearExclude = function () {
        this.excludes = {
            pats: []
        , funcs: []
        , regex: null
        };
    };

})();

// Static method, used to create copy returned by special
// array methods
FileList.clone = function (list, items) {
    var clone = new FileList();
    if (items) {
        clone.items = items;
    }
    clone.pendingAdd = list.pendingAdd;
    clone.pending = list.pending;
    for (var p in list.excludes) {
        clone.excludes[p] = list.excludes[p];
    }
    return clone;
};

exports.FileList = FileList;
