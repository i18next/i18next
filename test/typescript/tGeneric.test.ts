import i18next from 'i18next';

type Keys = 'friend' | 'tree';

// check keys
i18next.t<Keys, {}>('friend', { myVar: 'someValue' });
i18next.t<Keys, {}>(['friend', 'tree'], { myVar: 'someValue' });
