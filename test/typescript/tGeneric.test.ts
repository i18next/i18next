import i18next from 'i18next';

type Keys = 'friend' | 'tree';

// check keys
i18next.t<Keys, {}, string>('friend', { myVar: 'someValue' });
i18next.t<Keys, {}, string>(['friend', 'tree'], { myVar: 'someValue' });

// check interpolation values
i18next.t<Keys, {}, '{{myVar}}'>('friend', { myVar: 'someValue' });
i18next.t<Keys, {}, '{{myVar}}'>(['friend', 'tree'], { myVar: 'someValue' });
