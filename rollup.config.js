import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import nodeResolve from 'rollup-plugin-node-resolve';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
  exclude: 'node_modules/**',
  presets: [['es2015', { modules: false }], 'stage-0'],
  plugins: ['external-helpers', ['transform-es2015-classes', { loose: true }], 'transform-proto-to-assign'],
  babelrc: false
};

const dest = {
  amd: `dist/amd/i18next${compress ? '.min' : ''}.js`,
  umd: `dist/umd/i18next${compress ? '.min' : ''}.js`,
  iife: `dist/iife/i18next${compress ? '.min' : ''}.js`
}[format];

export default {
  entry: 'src/i18next.js',
  format,
  plugins: [
    babel(babelOptions),
    nodeResolve({ jsnext: true })
  ].concat(compress ? uglify() : []),
  moduleName: 'i18next',
  //moduleId: 'i18next',
  dest
};
