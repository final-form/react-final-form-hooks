const npsUtils = require('nps-utils')

const series = npsUtils.series
const concurrent = npsUtils.concurrent
const rimraf = npsUtils.rimraf

module.exports = {
  scripts: {
    test: {
      default: 'jest --coverage --detectOpenHandles',
      watch: 'jest --coverage --watch'
    },
    size: {
      description: 'check the size of the bundle',
      script: 'bundlesize'
    },
    build: {
      description: 'delete the dist directory and run all builds',
      default: series(
        rimraf('dist'),
        concurrent.nps(
          'build.es',
          'build.cjs',
          'build.umd.main',
          'build.umd.min',
          'copyTypes'
        )
      ),
      es: {
        description: 'run the build with rollup (uses rollup.config.js)',
        script: 'rollup --config --environment FORMAT:es'
      },
      cjs: {
        description: 'run rollup build with CommonJS format',
        script: 'rollup --config --environment FORMAT:cjs'
      },
      umd: {
        min: {
          description: 'run the rollup build with sourcemaps',
          script: 'rollup --config --sourcemap --environment MINIFY,FORMAT:umd'
        },
        main: {
          description: 'builds the cjs and umd files',
          script: 'rollup --config --sourcemap --environment FORMAT:umd'
        }
      },
      andTest: series.nps('build', 'size')
    },
    copyTypes: series(npsUtils.copy('src/*.d.ts dist')),
    docs: {
      description: 'Generates table of contents in README',
      script: 'doctoc README.md'
    },
    lint: {
      description: 'lint the entire project',
      script: 'eslint .'
    },
    typescript: {
      description: 'typescript check the entire project',
      script: 'tsc'
    },
    validate: {
      description:
        'This runs several scripts to make sure things look good before committing or on clean install',
      default: concurrent.nps('lint', 'build.andTest', 'typescript', 'test')
    }
  },
  options: {
    silent: false
  }
}
