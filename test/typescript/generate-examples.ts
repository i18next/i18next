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

const translations1 = fc.dictionary(property, property, options);
const translations2 = fc.dictionary(property, translations1, options);
const translations3 = fc.dictionary(property, translations2, options);
const translations4 = fc.dictionary(property, translations3, options);
const translations5 = fc.dictionary(property, translations4, options);
const translations6 = fc.dictionary(property, translations5, options);
const translations7 = fc.dictionary(property, translations6, options);
const translations8 = fc.dictionary(property, translations7, options);
const translations9 = fc.dictionary(property, translations8, options);

const [translations] = fc.sample(translations9, 1);
const json = JSON.stringify(translations, null, 2);
const code = `export const translations = ${json} as const`;

function main() {
  return fs.writeFileSync(PATH.target, `${code}\n`);
}

main();
