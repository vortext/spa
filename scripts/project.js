/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2; -*- */
'use strict';

require.config({
  baseUrl: '/static/scripts',
  jsx: {
    fileExtension: '.jsx'
  },
  paths: {
    'jQuery': 'vendor/jquery',
    'underscore': 'vendor/underscore',
    'Q': 'vendor/q',
    'react': 'vendor/react',
    'JSXTransformer': 'vendor/JSXTransformer',
    'backbone': 'vendor/backbone'
  },
  shim: {
    'jQuery': { exports : 'jQuery' },
    'underscore': { exports : '_' },
    "backbone": {
      deps: ["jQuery", "underscore"],
      exports: "Backbone"
    }
  },
  urlArgs: window.lastCommit
});

define(function (require) {
  var Dispatcher = require("dispatchers/project");
  window.dispatcher = new Dispatcher();
});
