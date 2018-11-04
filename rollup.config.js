import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import pkg from './package.json'

const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
  output = { file: `dist/react-final-form-hooks.es.js`, format: 'es' }
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/react-final-form-hooks.umd.min.js`,
      format: 'umd'
    }
  } else {
    output = { file: `dist/react-final-form-hooks.umd.js`, format: 'umd' }
  }
} else if (cjs) {
  output = { file: `dist/react-final-form-hooks.cjs.js`, format: 'cjs' }
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
  input: 'src/index.js',
  output: Object.assign(
    {
      name: 'react-final-form-hooks',
      exports: 'named',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
        'final-form': 'FinalForm'
      }
    },
    output
  ),
  external: umd
    ? Object.keys(pkg.peerDependencies || {})
    : [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
      ],
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs({ include: 'node_modules/**' }),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            loose: true,
            modules: false
          }
        ],
        '@babel/preset-react'
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-syntax-import-meta',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-json-strings',
        [
          '@babel/plugin-proposal-decorators',
          {
            legacy: true
          }
        ],
        '@babel/plugin-proposal-function-sent',
        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-numeric-separator',
        '@babel/plugin-proposal-throw-expressions'
      ]
    }),
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development'
          )
        })
      : null,
    minify ? uglify() : null
  ].filter(Boolean)
}
