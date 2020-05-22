import i18next, { TFunction } from 'i18next';

function basicUsage(t: TFunction) {
  t('friend');
  t`friend`;
  t(['friend', 'tree']);
  t('friend', { myVar: 'someValue' });
  t(['friend', 'tree'], { myVar: 'someValue' });
}

function overloadedUsage(t: TFunction) {
  t('friend', 'test {{myVar}}', { myVar: 'someValue' });
  t(['friend', 'tree'], 'test {{myVar}}', { myVar: 'someValue' });
}

function returnCasts(t: TFunction) {
  const s: string = t('friend'); // same as <string>
  const s2: string = t`friend`;
  const o: object = t<object>('friend');
  const sa: string[] = t<string[]>('friend');
  const oa: object[] = t<object[]>('friend');
}

function defautValue(t: TFunction) {
  t('translation:test', { defaultValue: 'test_en' });
  t('translation:test', { defaultValue: 'test_en', count: 1 });
  t('translation:test', {
    defaultValue_plural: 'test_en_plural',
    defaultValue: 'test_en',
    count: 10,
  });

  // string (only) default value as second arg
  //  https://www.i18next.com/translation-function/essentials#passing-a-default-value
  //  https://github.com/i18next/i18next/blob/master/src/Translator.js#L66
  t('translation:test', 'test_en');
}

function callsMethodWithOptionalNullArg(t: TFunction) {
  function displayHint(hint?: string | null) {
    return String(hint);
  }
  displayHint(t('friend'));
}

function callsMethodWithOptionalArg(t: TFunction) {
  function displayHint(hint?: string) {
    return String(hint);
  }
  displayHint(t('friend'));
}

function callsMethodWithRequiredNullArg(t: TFunction) {
  function displayHint(hint: string | null) {
    return String(hint);
  }
  displayHint(t('friend'));
}

function callsMethodWithRequiredArg(t: TFunction) {
  function displayHint(hint: string) {
    return String(hint);
  }
  displayHint(t('friend'));
}

function arrayKey(t: TFunction) {
  const error404 = '404';
  t([`error.${error404}`, 'error.unspecific']); // -> "The page was not found"

  const error502 = '502';
  t([`error.${error502}`, 'error.unspecific']); // -> "Something went wrong"
}

function stringKey(t: TFunction) {
  t('No one says a key can not be the fallback.');
  // -> "Niemand sagt ein key kann nicht als Ersatz dienen."

  t('This will be shown if the current loaded translations to not have this.');
  // -> "This will be shown if the current loaded translations to not have this."
}

function interpolation(t: TFunction) {
  // key = 'hello {{what}}'
  t('key', { what: i18next.format('world', 'uppercase') }); // -> hello WORLD

  t('key', { what: 'i18next', how: 'great' });

  const author = {
    name: 'Jan',
    github: 'jamuhl',
  };
  t('key', { author });

  t('keyEscaped', { myVar: '<img />' });
  // -> "no danger &lt;img &#x2F;&gt;"

  t('keyUnescaped', { myVar: '<img />' });
  // -> "dangerous <img />"

  t('keyEscaped', {
    myVar: '<img />',
    interpolation: { escapeValue: false },
  });
  // -> "no danger <img />" (obviously could be dangerous)

  t('key', { count: 0 }); // -> "items"
  t('key', { count: 1 }); // -> "item"
  t('key', { count: 5 }); // -> "items"
  t('key', { count: 100 }); // -> "items"
  t('keyWithCount', { count: 0 }); // -> "0 items"
  t('keyWithCount', { count: 1 }); // -> "1 item"
  t('keyWithCount', { count: 5 }); // -> "5 items"
  t('keyWithCount', { count: 100 }); // -> "100 items"

  t('key1_interval', { postProcess: 'interval', count: 1 }); // -> "one item"
  t('key1_interval', { postProcess: 'interval', count: 4 }); // -> "a few items"
  t('key1_interval', { postProcess: 'interval', count: 100 }); // -> "a lot of items"

  // not matching into a range it will fallback to
  // the regular plural form
  t('key2_interval', { postProcess: 'interval', count: 1 }); // -> "one item"
  t('key2_interval', { postProcess: 'interval', count: 4 }); // -> "a few items"
  t('key2_interval', { postProcess: 'interval', count: 100 }); // -> "100 items"
  t('friend', { context: 'male', count: 1 }); // -> "A boyfriend"
  t('friend', { context: 'female', count: 100 }); // -> "100 girlfriends"
  t('tree', { returnObjects: true, something: 'gold' });
  // -> { res: 'added gold' }

  t('array', { returnObjects: true });
  // -> ['a', 'b', 'c']
  t('arrayJoin', { joinArrays: '+' });
  // -> "line1+line2+line3"

  t('arrayJoinWithInterpolation', {
    myVar: 'interpolate',
    joinArrays: ' ',
  });
  // -> "you can interpolate"

  t('arrayOfObjects.0.name');
  // -> "tom"

  t('welcome here :)', { nsSeparator: false });
  // -> "welcome here :)"
  t('welcome ...', { keySeparator: false });
  // -> "welcome ..."
}
