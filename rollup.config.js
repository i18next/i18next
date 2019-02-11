import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { argv } from 'yargs';

const format = argv.format || argv.f || 'iife';
const compress = argv.uglify;

const babelOptions = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: false,
        },
      },
    ],
  ],
  babelrc: false,
};

const file = {
  amd: `dist/amd/i18next${compress ? '.min' : ''}.js`,
  umd: `dist/umd/i18next${compress ? '.min' : ''}.js`,
  iife: `dist/iife/i18next${compress ? '.min' : ''}.js`,
}[format];

export default {
  input: 'src/i18next.js',
  plugins: [babel(babelOptions), nodeResolve({ jsnext: true, main: true }), commonjs({})].concat(
    compress ? terser() : [],
  ),
  external: ['react', 'react-dom'],
  // moduleId: 'i18next',
  output: {
    name: 'i18next',
    format,
    file,
  },
};
