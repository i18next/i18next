import i18next from 'i18next';

i18next.exists('friend');
i18next.exists(['friend', 'tree']);
i18next.exists('friend', { myVar: 'someValue' });
i18next.exists(['friend', 'tree'], { myVar: 'someValue' });

const a: boolean = i18next.exists('my.key');
