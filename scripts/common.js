/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2; -*- */
'use strict';

require.config({
  baseUrl: '/static/scripts',
  jsx: {
    harmony: true,
    fileExtension: '.jsx'
  },
  paths: {
    'jQuery': 'vendor/jquery',
    'underscore': 'vendor/underscore',
    'Q': 'vendor/q',
    'react': 'vendor/react',
    'marked': 'vendor/marked',
    'JSXTransformer': 'vendor/JSXTransformer',
    'backbone': 'vendor/backbone',
    'PDFJS': 'vendor/pdfjs/pdf'
  },
  shim: {
    'jQuery': { exports : 'jQuery' },
    'underscore': { exports : '_' },
    "backbone": {
      deps: ["jQuery", "underscore"],
      exports: "Backbone"
    },
    'PDFJS': {
      exports: 'PDFJS',
      deps: ['vendor/pdfjs/generic/web/compatibility', 'vendor/ui_utils'] }
  }
});

require(["backbone"], function(Backbone) {
  var _sync = Backbone.sync;
  Backbone.sync = function(method, model, options){
    options.beforeSend = function(xhr){
      xhr.setRequestHeader('X-CSRF-Token', CSRF_TOKEN);
    };
    return _sync(method, model, options);
  };
});
