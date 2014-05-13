/* -*- mode: js2; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js2-basic-offset: 2 -*- */
define(['backbone', 'PDFJS'], function(Backbone, PDFJS) {
  'use strict';
  PDFJS.workerSrc = 'static/scripts/vendor/pdfjs/pdf.worker.js';
  PDFJS.cMapUrl = 'static/scripts/vendor/pdfjs/generic/web/cmaps/';
  PDFJS.cMapPacked = true;
  PDFJS.disableWebGL = false;

  var AppState = Backbone.Model.extend({
    initialize: function() {
      var self = this;
      this.on("change:data", function(e,data) {
        self.loadFromData(data);
      });
    },
    defaults: {
      data: '',
      textNodes: [],
      pdf: {}
    },
    loadFromData: function(data) {
      var self = this;
      PDFJS.getDocument(data).then(function(pdf) {
        self.set({pdf: pdf, textNodes: []});
      });
    }
  });
  return AppState;
});
