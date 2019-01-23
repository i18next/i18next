import i18next from 'i18next';

const error404 = '404';
i18next.t([`error.${error404}`, 'error.unspecific']); // -> "The page was not found"

const error502 = '502';
i18next.t([`error.${error502}`, 'error.unspecific']); // -> "Something went wrong"

i18next.t('No one says a key can not be the fallback.');
// -> "Niemand sagt ein key kann nicht als Ersatz dienen."

i18next.t('This will be shown if the current loaded translations to not have this.');
// -> "This will be shown if the current loaded translations to not have this."

// key = 'hello {{what}}'
i18next.t('key', { what: i18next.format('world', 'uppercase') }); // -> hello WORLD

i18next.t('key', { what: 'i18next', how: 'great' });

const author = {
  name: 'Jan',
  github: 'jamuhl',
};
i18next.t('key', { author });

i18next.t('keyEscaped', { myVar: '<img />' });
// -> "no danger &lt;img &#x2F;&gt;"

i18next.t('keyUnescaped', { myVar: '<img />' });
// -> "dangerous <img />"

i18next.t('keyEscaped', {
  myVar: '<img />',
  interpolation: { escapeValue: false },
});
// -> "no danger <img />" (obviously could be dangerous)

i18next.t('key', { count: 0 }); // -> "items"
i18next.t('key', { count: 1 }); // -> "item"
i18next.t('key', { count: 5 }); // -> "items"
i18next.t('key', { count: 100 }); // -> "items"
i18next.t('keyWithCount', { count: 0 }); // -> "0 items"
i18next.t('keyWithCount', { count: 1 }); // -> "1 item"
i18next.t('keyWithCount', { count: 5 }); // -> "5 items"
i18next.t('keyWithCount', { count: 100 }); // -> "100 items"

i18next.t('key1_interval', { postProcess: 'interval', count: 1 }); // -> "one item"
i18next.t('key1_interval', { postProcess: 'interval', count: 4 }); // -> "a few items"
i18next.t('key1_interval', { postProcess: 'interval', count: 100 }); // -> "a lot of items"

// not matching into a range it will fallback to
// the regular plural form
i18next.t('key2_interval', { postProcess: 'interval', count: 1 }); // -> "one item"
i18next.t('key2_interval', { postProcess: 'interval', count: 4 }); // -> "a few items"
i18next.t('key2_interval', { postProcess: 'interval', count: 100 }); // -> "100 items"
i18next.t('friend', { context: 'male', count: 1 }); // -> "A boyfriend"
i18next.t('friend', { context: 'female', count: 100 }); // -> "100 girlfriends"
i18next.t('tree', { returnObjects: true, something: 'gold' });
// -> { res: 'added gold' }

i18next.t('array', { returnObjects: true });
// -> ['a', 'b', 'c']
i18next.t('arrayJoin', { joinArrays: '+' });
// -> "line1+line2+line3"

i18next.t('arrayJoinWithInterpolation', {
  myVar: 'interpolate',
  joinArrays: ' ',
});
// -> "you can interpolate"

i18next.t('arrayOfObjects.0.name');
// -> "tom"

i18next.t('friend');
i18next.t(['friend', 'tree']);
i18next.t('friend', { myVar: 'someValue' });
i18next.t(['friend', 'tree'], { myVar: 'someValue' });

// various returns <string> is the default
const s: string = i18next.t('friend'); // same as <string>
const o: object = i18next.t<object>('friend');
const sa: string[] = i18next.t<string[]>('friend');
const oa: object[] = i18next.t<object[]>('friend');
