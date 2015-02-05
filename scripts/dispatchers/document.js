/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2; -*- */
define(function (require) {
  'use strict';

  var Backbone = require("backbone");
  var React = require("react");
  var _ = require("underscore");

  require("PDFJS");

  PDFJS.workerSrc = '/static/scripts/vendor/pdfjs/pdf.worker.js';
  PDFJS.cMapUrl = '/static/scripts/vendor/pdfjs/generic/web/cmaps/';
  PDFJS.cMapPacked = true;
  PDFJS.disableWebGL = !Modernizr.webgl;

  // Models
  var documentModel = new (require("models/document"))();
  var marginaliaModel = new (require("models/marginalia"))();

  // Components
  var Document = require("jsx!components/document");
  var Marginalia = require("jsx!components/marginalia");

  var documentComponent = React.renderComponent(
    Document({pdf: documentModel}),
    document.getElementById("viewer")
  );

  var marginaliaComponent = React.renderComponent(
    Marginalia({marginalia: marginaliaModel}),
    document.getElementById("marginalia")
  );

  // Dispatch logic
  // Listen to model change callbacks -> trigger updates to components
  marginaliaModel.on("all", function(e, obj) {
    switch(e) {
    case "annotations:select":
      var fingerprint = documentModel.get("fingerprint");
      documentComponent.setState({select: obj});
      break;
    case "annotations:change":
      break;
    case "annotations:add":
    case "annotations:remove":
    case "change:description":
      console.log("changed", e, obj);
    default:
      documentModel.setActiveAnnotations(marginaliaModel);
      marginaliaComponent.forceUpdate();
    }
  });

  documentModel.on("all", function(e, obj) {
    switch(e) {
    case "change:raw":
      var fingerprint = obj.changed.raw.pdfInfo.fingerprint;
      documentComponent.setState({
        fingerprint: fingerprint
      });
      break;
    case "change:binary":
      marginaliaModel.reset();
      break;
    case "annotation:add":
      var model = marginaliaModel.findWhere({active: true}).get("annotations");
      model.add(obj);
      break;
    case "pages:change:state":
      if(obj.get("state") > window.RenderingStates.HAS_PAGE) {
        documentModel.setActiveAnnotations(marginaliaModel);
      }
      documentComponent.forceUpdate();
      break;
    case "pages:change:annotations":
      var annotations = marginaliaModel.pluck("annotations");
      var highlighted = _.find(annotations, function(annotation) { return annotation.findWhere({highlighted: true});});
      documentComponent.setProps({highlighted: highlighted && highlighted.findWhere({highlighted: true})});
      break;
    default:
      break;
    }
  });

  // Set initial state
  // marginaliaModel.reset(marginaliaModel.parse(window.models.marginalia));

});
