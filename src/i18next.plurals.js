// definition http://translate.sourceforge.net/wiki/l10n/pluralforms
var pluralExtensions = {

    rules: {
        "ach": {
            "name": "Acholi", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "af": {
            "name": "Afrikaans", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ak": {
            "name": "Akan", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "am": {
            "name": "Amharic", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "an": {
            "name": "Aragonese", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ar": {
            "name": "Arabic", 
            "numbers": [
                0, 
                1, 
                2, 
                3, 
                11, 
                100
            ], 
            "plurals": function(n) { return Number(n===0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5); }
        }, 
        "arn": {
            "name": "Mapudungun", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "ast": {
            "name": "Asturian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ay": {
            "name": "Aymar\u00e1", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "az": {
            "name": "Azerbaijani", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "be": {
            "name": "Belarusian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "bg": {
            "name": "Bulgarian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "bn": {
            "name": "Bengali", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "bo": {
            "name": "Tibetan", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "br": {
            "name": "Breton", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "bs": {
            "name": "Bosnian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "ca": {
            "name": "Catalan", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "cgg": {
            "name": "Chiga", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "cs": {
            "name": "Czech", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }
        }, 
        "csb": {
            "name": "Kashubian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "cy": {
            "name": "Welsh", 
            "numbers": [
                3, 
                1, 
                2, 
                8
            ], 
            "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n != 8 && n != 11) ? 2 : 3); }
        }, 
        "da": {
            "name": "Danish", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "de": {
            "name": "German", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "dz": {
            "name": "Dzongkha", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "el": {
            "name": "Greek", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "en": {
            "name": "English", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "eo": {
            "name": "Esperanto", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "es": {
            "name": "Spanish", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "es_ar": {
            "name": "Argentinean Spanish", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "et": {
            "name": "Estonian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "eu": {
            "name": "Basque", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "fa": {
            "name": "Persian", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "fi": {
            "name": "Finnish", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "fil": {
            "name": "Filipino", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "fo": {
            "name": "Faroese", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "fr": {
            "name": "French", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "fur": {
            "name": "Friulian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "fy": {
            "name": "Frisian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ga": {
            "name": "Irish", 
            "numbers": [
                3, 
                1, 
                2, 
                7, 
                11
            ], 
            "plurals": function(n) { return Number(n==1 ? 0 : n==2 ? 1 : n<7 ? 2 : n<11 ? 3 : 4) ;}
        }, 
        "gd": {
            "name": "Scottish Gaelic", 
            "numbers": [
                20, 
                1, 
                2, 
                3
            ], 
            "plurals": function(n) { return Number((n==1 || n==11) ? 0 : (n==2 || n==12) ? 1 : (n > 2 && n < 20) ? 2 : 3); }
        }, 
        "gl": {
            "name": "Galician", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "gu": {
            "name": "Gujarati", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "gun": {
            "name": "Gun", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "ha": {
            "name": "Hausa", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "he": {
            "name": "Hebrew", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "hi": {
            "name": "Hindi", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "hr": {
            "name": "Croatian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "hu": {
            "name": "Hungarian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "hy": {
            "name": "Armenian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ia": {
            "name": "Interlingua", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "id": {
            "name": "Indonesian", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "is": {
            "name": "Icelandic", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n%10!=1 || n%100==11); }
        }, 
        "it": {
            "name": "Italian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ja": {
            "name": "Japanese", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "jbo": {
            "name": "Lojban", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "jv": {
            "name": "Javanese", 
            "numbers": [
                0, 
                1
            ], 
            "plurals": function(n) { return Number(n !== 0); }
        }, 
        "ka": {
            "name": "Georgian", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "kk": {
            "name": "Kazakh", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "km": {
            "name": "Khmer", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "kn": {
            "name": "Kannada", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ko": {
            "name": "Korean", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "ku": {
            "name": "Kurdish", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "kw": {
            "name": "Cornish", 
            "numbers": [
                4, 
                1, 
                2, 
                3
            ], 
            "plurals": function(n) { return Number((n==1) ? 0 : (n==2) ? 1 : (n == 3) ? 2 : 3); }
        }, 
        "ky": {
            "name": "Kyrgyz", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "lb": {
            "name": "Letzeburgesch", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ln": {
            "name": "Lingala", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "lo": {
            "name": "Lao", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "lt": {
            "name": "Lithuanian", 
            "numbers": [
                10, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "lv": {
            "name": "Latvian", 
            "numbers": [
                0, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n !== 0 ? 1 : 2); }
        }, 
        "mai": {
            "name": "Maithili", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "mfe": {
            "name": "Mauritian Creole", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "mg": {
            "name": "Malagasy", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "mi": {
            "name": "Maori", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "mk": {
            "name": "Macedonian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n==1 || n%10==1 ? 0 : 1); }
        }, 
        "ml": {
            "name": "Malayalam", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "mn": {
            "name": "Mongolian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "mnk": {
            "name": "Mandinka", 
            "numbers": [
                0, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(0 ? 0 : n==1 ? 1 : 2); }
        }, 
        "mr": {
            "name": "Marathi", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ms": {
            "name": "Malay", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "mt": {
            "name": "Maltese", 
            "numbers": [
                2, 
                1, 
                11, 
                20
            ], 
            "plurals": function(n) { return Number(n==1 ? 0 : n===0 || ( n%100>1 && n%100<11) ? 1 : (n%100>10 && n%100<20 ) ? 2 : 3); }
        }, 
        "nah": {
            "name": "Nahuatl", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "nap": {
            "name": "Neapolitan", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "nb": {
            "name": "Norwegian Bokmal", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ne": {
            "name": "Nepali", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "nl": {
            "name": "Dutch", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "nn": {
            "name": "Norwegian Nynorsk", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "no": {
            "name": "Norwegian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "nso": {
            "name": "Northern Sotho", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "oc": {
            "name": "Occitan", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "or": {
            "name": "Oriya", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "pa": {
            "name": "Punjabi", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "pap": {
            "name": "Papiamento", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "pl": {
            "name": "Polish", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "pms": {
            "name": "Piemontese", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ps": {
            "name": "Pashto", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "pt": {
            "name": "Portuguese", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "pt_br": {
            "name": "Brazilian Portuguese", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "rm": {
            "name": "Romansh", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ro": {
            "name": "Romanian", 
            "numbers": [
                2, 
                1, 
                20
            ], 
            "plurals": function(n) { return Number(n==1 ? 0 : (n===0 || (n%100 > 0 && n%100 < 20)) ? 1 : 2); }
        }, 
        "ru": {
            "name": "Russian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "sah": {
            "name": "Yakut", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "sco": {
            "name": "Scots", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "se": {
            "name": "Northern Sami", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "si": {
            "name": "Sinhala", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "sk": {
            "name": "Slovak", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number((n==1) ? 0 : (n>=2 && n<=4) ? 1 : 2); }
        }, 
        "sl": {
            "name": "Slovenian", 
            "numbers": [
                5, 
                1, 
                2, 
                3
            ], 
            "plurals": function(n) { return Number(n%100==1 ? 1 : n%100==2 ? 2 : n%100==3 || n%100==4 ? 3 : 0); }
        }, 
        "so": {
            "name": "Somali", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "son": {
            "name": "Songhay", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "sq": {
            "name": "Albanian", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "sr": {
            "name": "Serbian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "su": {
            "name": "Sundanese", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "sv": {
            "name": "Swedish", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "sw": {
            "name": "Swahili", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "ta": {
            "name": "Tamil", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "te": {
            "name": "Telugu", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "tg": {
            "name": "Tajik", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "th": {
            "name": "Thai", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "ti": {
            "name": "Tigrinya", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "tk": {
            "name": "Turkmen", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "tr": {
            "name": "Turkish", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "tt": {
            "name": "Tatar", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "ug": {
            "name": "Uyghur", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "uk": {
            "name": "Ukrainian", 
            "numbers": [
                5, 
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2); }
        }, 
        "ur": {
            "name": "Urdu", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "uz": {
            "name": "Uzbek", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "vi": {
            "name": "Vietnamese", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "wa": {
            "name": "Walloon", 
            "numbers": [
                1, 
                2
            ], 
            "plurals": function(n) { return Number(n > 1); }
        }, 
        "wo": {
            "name": "Wolof", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }, 
        "yo": {
            "name": "Yoruba", 
            "numbers": [
                2, 
                1
            ], 
            "plurals": function(n) { return Number(n != 1); }
        }, 
        "zh": {
            "name": "Chinese", 
            "numbers": [
                1
            ], 
            "plurals": function(n) { return 0; }
        }
    },

    // for demonstration only sl and ar is added but you can add your own pluralExtensions
    addRule: function(lng, obj) {
        pluralExtensions.rules[lng] = obj;    
    },

    setCurrentLng: function(lng) {
        if (!pluralExtensions.currentRule || pluralExtensions.currentRule.lng !== lng) {
            var parts = lng.split('-');

            pluralExtensions.currentRule = {
                lng: lng,
                rule: pluralExtensions.rules[parts[0]]
            };
        }
    },

    get: function(lng, count) {
        var parts = lng.split('-');

        function getResult(l, c) {
            var ext;
            if (pluralExtensions.currentRule && pluralExtensions.currentRule.lng === lng) {
                ext = pluralExtensions.currentRule.rule; 
            } else {
                ext = pluralExtensions.rules[l];
            }
            if (ext) {
                var i = ext.plurals(c);
                var number = ext.numbers[i];
                if (ext.numbers.length === 2) {
                    if (number === 2) { 
                        number = 1;
                    } else if (number === 1) {
                        number = -1;
                    }
                } //console.log(count + '-' + number);
                return number;
            } else {
                return c === 1 ? '1' : '-1';
            }
        }
                    
        return getResult(parts[0], count);
    }

};