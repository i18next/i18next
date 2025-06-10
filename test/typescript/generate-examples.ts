#!/usr/bin/env npx tsx
import * as path from 'node:path';
import * as fs from 'node:fs';
import * as fc from 'fast-check';

const PATH = {
  target: path.join(path.resolve(), 'test', 'typescript', 'test.namespace.generated.ts'),
};

const options = {
  minKeys: 2,
  maxKeys: 3,
} satisfies fc.DictionaryConstraints;

const property = fc.stringMatching(/^[$a-zA-Z][$a-zA-Z0-9]*$/);

const translations_01 = fc.dictionary(property, property, options);
const translations_02 = fc.dictionary(property, translations_01, options);
const translations_03 = fc.dictionary(property, translations_02, options);
const translations_04 = fc.dictionary(property, translations_03, options);
const translations_05 = fc.dictionary(property, translations_04, options);
const translations_06 = fc.dictionary(property, translations_05, options);
const translations_07 = fc.dictionary(property, translations_06, options);
const translations_08 = fc.dictionary(property, translations_07, options);
const translations_09 = fc.dictionary(property, translations_08, options);

const [trans_09] = fc.sample(translations_09, 1);
const json_09 = JSON.stringify(trans_09, null, 2);
const typescript_09 = 'export const translations = ' + json_09 + ' as const';

function main(): void {
  fs.writeFileSync(PATH.target, typescript_09 + '\n');
}

void main();
