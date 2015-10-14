'use strict';
require('babel/register')()

module.exports = function (config) {

  config.set({

    basePath: '',

    frameworks: ['mocha', 'sinon-chai'],

    reporters: ['mocha'],

    files: [
      '_test.js'
    ],

    port: 9876,
    colors: true,
    autoWatch: true,
    singleRun: false,

    logLevel: config.LOG_INFO,

    browsers: ['jsdom'],

    preprocessors: {
      '_test.js': ['webpack', 'sourcemap']
    },

    webpack: require('./webpack/test-config.babel'),

    webpackServer: {
      noInfo: true
    }

  });
};
