/* eslint-env node */
'use strict'

const IS_COVERAGE = !!process.env.IS_COVERAGE
const IS_TRAVIS = !!process.env.TRAVIS

module.exports = function (config) {
  config.set({
    basePath: '.',
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha-reporter',
      'karma-typescript',
    ],
    logLevel: 'info',
    frameworks: ['jasmine', 'karma-typescript'],
    browsers: [IS_TRAVIS ? 'FirefoxHeadless' : 'ChromeHeadless'],
    files: [
      {
        pattern: 'src/**/*.ts',
        watched: true,
        served: true,
        included: true,
      },
    ],
    exclude: [],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    reporters: [
      // 'progress',
      'mocha',
      'karma-typescript',
    ],
    mochaReporter: {
      output: 'minimal',
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /(\.spec\.ts)$/,
        sourceMap: true,
        validateSyntax: false,
      },
      exclude: ['dist'],
      // compilerOptions: tsconfig.compilerOptions,
      tsconfig: './tsconfig.cjs.json',
      converageOptions: {
        instrumentation: IS_COVERAGE,
        exclude: /\.(d|spec|test)\.ts/i,
        instrumenterOptions: {
          // a regex for excluding files from remapping
          // exclude: '',
          // a function for handling error messages
          warn: (msg) => console.log(msg),
        },
      },
      reports: {
        'text-summary': '',
        html: {
          directory: 'coverage',
          subdirectory: 'html',
        },
        lcovonly: {
          directory: 'coverage',
          subdirectory: 'lcov',
          filename: 'lcov.info',
        },
      },
    },
  })
}
