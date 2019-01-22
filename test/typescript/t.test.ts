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

type KeyList = 'friend' | 'tree';

interface CustomOptions {
  myVar: string;
}

i18next.t('friend');
i18next.t(['friend', 'tree']);
i18next.t('friend', { myVar: 'someValue' });
i18next.t(['friend', 'tree'], { myVar: 'someValue' });

const t1: i18next.TranslationFunction = (
  key: string | string[],
  options?: i18next.TranslationOptions,
) => '';
const t2: i18next.TranslationFunction<{ value: string }> = (
  key: string | string[],
  options?: i18next.TranslationOptions,
) => ({ value: 'asd' });
const t3: i18next.TranslationFunction<string, CustomOptions> = (
  key: string | string[],
  options?: i18next.TranslationOptions<CustomOptions>,
) => '';
const t4: i18next.TranslationFunction<string, object, KeyList> = (
  key: KeyList | KeyList[],
  options?: i18next.TranslationOptions,
) => '';

i18next.t<KeyList>('friend', { myVar: 'someValue' });
i18next.t<KeyList>(['friend', 'tree'], { myVar: 'someValue' });
i18next.t<KeyList, { myVar: 'someValue' }>('friend', { myVar: 'someValue' });
i18next.t<KeyList, { myVar: 'someValue' }>(['friend', 'tree'], { myVar: 'someValue' });

// NOTION: disable no-unnecessary-generics for generic pattern test.
/* tslint:disable:no-unnecessary-generics */
interface ExWithT extends i18next.WithT {
  t<Keys extends KeyList = KeyList, Val extends object = object, R = string>(
    keys: Keys | Keys[],
    options?: i18next.TranslationOptions<Val>,
  ): R;
  t<Keys extends OtherKeyList = OtherKeyList, Val extends object = object, R = string>(
    keys: Keys | Keys[],
    options?: i18next.TranslationOptions<Val>,
  ): R;
  t<Keys extends string = KeyList, R = string>(keys: Keys | Keys[]): R;
}

type OtherKeyList = 'private' | 'public';

(i18next as ExWithT).t('friend');
(i18next as ExWithT).t('tree');
(i18next as ExWithT).t('private');
(i18next as ExWithT).t('public');
(i18next as ExWithT).t('friend', {});
(i18next as ExWithT).t('private', {});
(i18next as ExWithT).t<KeyList, { myVar: 'someValue' }>('friend', { myVar: 'someValue' });
(i18next as ExWithT).t<OtherKeyList, { myVar: 'someValue' }>('private', { myVar: 'someValue' });
const result = (i18next as ExWithT).t<KeyList, { myVar: 'someValue' }, { result: 'result' }>(
  'friend',
  { myVar: 'someValue' },
);
type Check<T extends { result: 'result' }> = T;
type ExWithTResult = Check<typeof result>;
