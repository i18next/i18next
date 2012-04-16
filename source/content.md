### Grab the sources

<Download the latest source or fork the project from github:

<section id="download"> 
    <a class="button" href="public/downloads/i18next-1.2.5.zip">i18next v1.2.5</a> 
</section>

# Introduction

There are a lot of great javascripts modules around to bring translation to clientside web, but there 
where always some features i missed.

Mostly:

- Usage of namespaces: split needed translation in more than one file (to share them to other projects, eg. for buttons)
- load resourcesfiles from static source or from a dynamic generated file
- have a jquery function to translate all tags marked with a __data-i18n__ attibute
- have an option to post missing translations to the server
- graceful fallback: if it doesn't find a translation in _en-US_ look first in _en_ befor taking value from fallback language
- support for localstorage


What else will you find:

- support for pluralized strings
- insertion of variables into translations
- translation nesting
- translation contexts

# Usage Sample

Add the i18next.js after the jquery JavaScript.

    <script type="text/javascript" src="jquery-1.6.4.min.js"></script>
    <script type="text/javascript" src="i18next-[version].js"></script>

Add your resourcefile under /locales/en-US/translation.json

    {
        "app": {
            "name": "i18n"
        },
        "creator": {
            "firstname": "Jan",
            "lastname": "Mühlemann"
        }
    }

Init and use the module:

    $.i18n.init({}, function(t) { // will init i18n with default settings and set language from navigator
        var appName = t('app.name'); // -> i18n
        var creator = t('creator.firstname') + ' ' + t('creator.lastname'); // -> Jan Mühlemann
    });

After initialisation you can use __$.t()__ instead of setting translation in the init callback:

    var appName = $.t('app.name'); // -> i18n

To change the language:

    $.i18n.setLng('de-DE', function(t) {
        // will load needed resources if not provided on init 
        // and set the currentLanguage
    });

You can also switch the language via querystring `?setLng=de-DE`.

If no resource string is found in the specific language (en-US) it will be looked up in _en_ befor taken from fallback language. 
If the key is not in the fallback language the key or a optional defaultValue will be displayed:

    var takeDefault = $.t('app.type', {defaultValue: 'OpenSource'}); // -> OpenSource

### or use the jquery function

    // given resource
    "nav": {
        "home": "home",
        "1": "link1",
        "2": "link2"
    }

    // given html
    <ul class="nav">
        <li class="active"><a href="#" data-i18n="nav.home">home</a></li>
        <li><a href="#" data-i18n="nav.1">link1</a></li>
        <li><a href="#" data-i18n="nav.2">link2</a></li>
    </ul>

    // just do to translate all elements having attribute _data-i18n_
    $('.nav').i18n();

Every child element with an _data-i18n_ attribute will be translated with given key.

### Basic options for init

    $.i18n.init({
          lng: 'en-US'                               // defaults to get from navigator
        , fallbackLng: 'en'                          // defaults to 'dev'
        , ns: 'myNamespace'                          // defaults to 'tranalation'
        , resGetPath: 'myFolder/__lng__/__ns__.json' // defaults to 'locales/__lng__/__ns__.json' where ns = translation (default)
        , useLocalStorage: false                     // defaults to true
        , resStore: {...}                            // if you don't want your resources to be loaded you can provide the resources
    });


# Extended Samples

### loading multiple namespaces

Set the ns option to an array on i18n init:

    $.i18n.init({
        lng: 'en-US',
        ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'}
    });

This will load __en-US__, __en__ and __dev__ resources for two namespaces ('ns.special' and 'ns.common'):

    locales
       |
       +-- en-US
       |     |
       |     +-- ns.common
       |     +-- ns.special
       |      
       +-- en
       |    |
       |    +-- ns.common
       |    +-- ns.special
       | 
       +-- dev
            |
            +-- ns.common
            +-- ns.special

    // let's asume this will load following resource strings
    {
      "en_US": {
        "ns.special": {
          "app": {
            "name": "i18n"
          }
        },
        "ns.common": {}
      },
      "en": {
        "ns.special": {
          "app": {
            "area": "Area 51"
          }
        },
        "ns.common": {}
      },
      "dev": {
        "ns.common": {
          "app": {
            "company": {
              "name": "my company"
            }
          },
          "add": "add"
        }
      }
    }


you can translate using _$.t([namespace:]key, [options])_

    $.t('app.name');                   // -> i18n (from 'en-US' resourcefile)
    $.t('app.area');                   // -> Area 51 (from 'en' resourcefile)
    $.t('ns.common:app.company.name'); // -> my company (from 'dev' resourcefile)
    $.t('ns.common:add');              // -> add (from 'dev' resourcefile)

If no namespace is prepended to the resource key i18n will take the default namespace provided on initalisation.

### insert values into your translation

    // given resource
    "insert": "you are __myVar__",

	$.t('insert', {myVar: 'great'}) // -> you are great

### support for plurals

    // given resource
    "child": "__count__ child",
    "child_plural": "__count__ children"

	  $.t('child', {count: 1}); // -> 1 child
    $.t('child', {count: 3}); // -> 3 children

You can set the _pluralSuffix_ as an option on initialisation.

### extended plural support for multiple plurals

    // given resource
    sl: { 
        translation: { 
            beer: 'Pivo',
            beer_plural_two: 'Pivi',
            beer_plural_few: 'Piva',
            beer_plural: 'stop drinking ;)'
        } 
    }

    $.t('beer', {count: 1});   // 'Pivo'
    $.t('beer', {count: 2});   // Pivi'
    $.t('beer', {count: 3});   // Piva'
    $.t('beer', {count: 4});   // Piva'
    $.t('beer', {count: 5});   // stop drinking ;)'

__HINT:__ For now we added only _slovenian_ to the plural rules set as a sample how to do it, but you can easily add new rules 
on runtime or feel free to fork the project and send a pull request.

    $.i18n.pluralExtensions.addRule('sl', function (n) {
        return n % 100 === 1 ? 'one' : n % 100 === 2 ? 'two' : n % 100 === 3 || n % 100 === 4 ? 'few' : 'other';
    });

    // return value 'one' will map to the singular form '[key]'
    // return value 'other' will map to the common plural form '[key]_plural'
    // return value 'two' will map to the extended plural in form '[key]_plural_two'
    // return value 'few' will map to the extended plural in form '[key]_plural_few'

You can find the plural rules on [unicode.org](http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html).

### NEW v1.2: translation contexts

You can provide a translation key in form `[key]_[yourContext]`. By passing in _context_ through options i18next 
can choose correct form:

    // given resource
    en-US: { 
        translation: { 
            friend: 'a friend',
            friend_male: 'a boyfriend',
            friend_female: 'a girlfriend'
        } 
    }

    $.t('friend');                        // returns default 'a friend'
    $.t('friend', {context: 'male'});     // returns 'a boyfriend'
    $.t('friend', {context: 'female'});   // returns 'a girlfriend'

__hint:__ might be a good idea to suffix your keys using context with _\_context_.

You can even use context and plurals in combination:

    // given resource
    en-US: { 
        translation: { 
            friend: '__count__ friend',
            friend_male: '__count__ boyfriend',
            friend_female: '__count__ girlfriend'
            friend_plural: '__count__ friends',
            friend_male_plural: '__count__ boyfriends',
            friend_female_plural: '__count__ girlfriends'
        } 
    }

    $.t('friend', {count: 1});                        // returns '1 friend'
    $.t('friend', {context: 'female', count: 10});    // returns '10 girlfriends'


### nesting

    // given resource
    "app": {
      "area": "Area 51",
      "district": "District 9 is more fun than $t(app.area)"
    }

    $.t('app.district'); // -> District 9 is more fun than Area 51

### extended use of the jquery function

    // given resource
    "attr": {
        "placeholderText": "search...",
        "hoverText": "don't have fear click me!",
        "btnText": "search"
    }

    // given html
    <form id="form">
        <input type="text" data-i18n="[placeholder]attr.placeholderText"></input>
        // the placeholder text will be set to 'search...'
        <button data-i18n="[title]attr.hoverText;attr.btnText"></button>
        // the button's text will be 'search' and on hover you should see 'don't have fear click me!'
    </form>

    // just do to translate all elements having attribute _data-i18n_
    $('.nav').i18n();

You can set multiple attributes from wihin the __data-i18n__ attribute by specifing the attribute by enclosing 
it with __[...]__ followed by the translation key and seperated by __';'__.

When not setting a specific attribute (like on the button in above sample -> attr.btnText) i18next will set the 
text of given element.

### dynamic (non-static) resouce route

Set the _dynamicLoad_ option to true on init

    $.i18n.init({
        lng: 'en-US'
        ns: { namespaces: ['ns.common', 'ns.special'], defaultNs: 'ns.special'},
        dynamicLoad: true,
        resGetPath: 'myPath/resources.json?ns=__ns__&lng__lng__' // set this according to your needs
    });

On init i18n will call the provided route with the querystring parameters language and namespaces (they will be 
seperated by a + which should be a space on serverside).

You will have to return something like:

    {
      "en_US": {
        "ns.special": {...},
        "ns.common": {...}
      },
      "en": {
        "ns.special": {..},
        "ns.common": {...}
      },
      "dev": {
        "ns.special": {..},
        "ns.common": {..}
        }
      }
    }

### post missing resources

Just init i18n with the according options (you shouldn't use this option in production):

    $.i18n.init({
        // ...
        sendMissing: true,
        resPostPath: 'myPath/add/__lng__/__ns__', // defaults to 'locales/add/__lng__/__ns__',
    });

## serverside integrations

- [i18next-node](https://github.com/jamuhl/i18next-node) is bringing i18next to node.js
  
  - Translation inside your serverside code or templates
  - express middleware
  - loading resourcefiles from filesystem
  - update resourcefiles with missing strings
  - serve clientscript and same resources to the browser


## Inspiration

- [jsperanto](https://github.com/jpjoyal/jsperanto). Simple translation for your javascripts, yummy with your favorite templates engine like EJS.

## Release Notes

### v1.2.5
- fix for IE8

### v1.2.4
- added indexOf for non ECMA-262 standard compliant browsers (IE < 9)
- calling i28n() on element with data-i18n attribute will localize it now (i18n now not only works on container elements child)

### v1.2.3

- extended detectLng: switch via qs _setLng=_ or cookie _i18next_
- assert county in locale will be uppercased `en-us` -> `en-US`
- provide option to have locale always lowercased _option lowerCaseLng_
- set lng cookie when set in init function

### v1.2

- support for translation context
- fixed zero count in plurals
- init without options, callback

### v1.1

- support for multiple plural forms
- common.js enabled (for node.js serverside)
- changes to be less dependent on jquery (override it's functions, add to root if no jquery)
- enable it on serverside with node.js [i18next-node](https://github.com/jamuhl/i18next-node)

### v1.0

- support for other attribute translation via _data-i18n_ attribute
- bug fixes
- tests with qunit and sinon

### v0.9

- multi-namespace support
- loading static files or dynamic route
- jquery function for _data-i18n_ attibute
- post missing translations to the server
- graceful fallback en-US -> en -> fallbackLng
- localstorage support
- support for pluralized strings
- insertion of variables into translations
- translation nesting


