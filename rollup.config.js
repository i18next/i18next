import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const getBabelOptions = ({ useESModules }) => ({
  exclude: /node_modules/,
  runtimeHelpers: true,
  plugins: [['@babel/transform-runtime', { useESModules }]],
  comments: false,
});

const input = './src/index.js';
const name = 'i18next';
// check relative and absolute paths for windows and unix
const external = id => !id.startsWith('.') && !id.startsWith('/') && !id.includes(':');

export default [
  {
    input,
    output: { format: 'cjs', file: pkg.main },
    external,
    plugins: [babel(getBabelOptions({ useESModules: false }))],
  },

  {
    input,
    output: { format: 'esm', file: pkg.module },
    external,
    plugins: [babel(getBabelOptions({ useESModules: true }))],
  },

  {
    input,
    output: { format: 'umd', name, file: `dist/umd/${name}.js` },
    plugins: [babel(getBabelOptions({ useESModules: true })), nodeResolve()],
  },
  {
    input,
    output: { format: 'umd', name, file: `dist/umd/${name}.min.js` },
    plugins: [babel(getBabelOptions({ useESModules: true })), nodeResolve(), terser()],
  },
];
