/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2; -*- */
'use strict';


/* This is an example of what modules should be defined by the main (wrapping) app */

require.config({
  jsx: {
    harmony: true,
    fileExtension: '.jsx'
  },
  paths: {
    'underscore': "vendor/underscore",
    'jquery': "vendor/jquery",
    'Q': 'vendor/q',
    'marked': 'vendor/marked',
    'backbone': 'vendor/backbone',

    'react': "vendor/react",

    'JSXTransformer': "vendor/JSXTransformer",
    'PDFJS': "vendor/pdfjs/pdf"
  },
  shim: {
    'PDFJS': {
      exports: 'PDFJS',
      deps: ['vendor/pdfjs/generic/web/compatibility',
             'vendor/ui_utils'] }
  }

});
