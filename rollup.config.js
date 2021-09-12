/* eslint-env node */

import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import sourcemaps from 'rollup-plugin-sourcemaps'
import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  watch: {
    include: 'src/**',
  },
  external: ['mithril'],
  plugins: [
    resolve(),
    sourcemaps(),
    typescript(),
    replace({
      preventAssignment: true,
      VERSION_STRING: JSON.stringify(pkg.version),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    commonjs(),
  ],
  output: [
    {
      name: pkg.name,
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      globals: {
        mithril: 'm',
      },
    },
    {
      name: pkg.name,
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
      globals: {
        mithril: 'm',
      },
    },
    {
      name: pkg.name,
      file: 'dist/index.min.js',
      format: 'umd',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        mithril: 'm',
      },
    },
  ],
}
