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

  var self = this;

  // Models
  var documentModel = new (require("models/document"))();
  var marginaliaModel = new (require("models/marginalia"))();

  // Components
  var Document = require("jsx!components/document");
  var Marginalia = require("jsx!components/marginalia");
  var TopBar = require("jsx!components/topBar");

  var documentComponent = React.renderComponent(
    Document({pdf: documentModel}),
    document.getElementById("viewer")
  );

  var marginaliaComponent = React.renderComponent(
    Marginalia({marginalia: marginaliaModel}),
    document.getElementById("marginalia")
  );

  var topBar = React.renderComponent(
    TopBar({marginalia: marginaliaModel}),
    document.getElementById("top-bar")
  );

  // Routes
  var Router = Backbone.Router.extend({
    routes: {
      "projects/:project/documents/:fingerprint":                "view",
      "projects/:project/documents/:fingerprint/a/:annotation":  "view"
    },
    view: function(project, fingerprint, annotation) {
      marginaliaModel.reset();
      documentModel.loadFromUrl(window.location.href + "?mime=application/pdf");
    }
  });

  new Router();

  // Dispatch logic
  // Listen to model change callbacks -> trigger updates to components
  marginaliaModel.on("all", function(e, obj) {
    switch(e) {
    case "annotations:select":
      var fingerprint = documentModel.get("fingerprint");
      documentComponent.setState({select: obj});
      //self.router.navigate(window.location.href + "/a/" + obj);
      break;
    case "annotations:change":
      break;
    case "annotations:add":
    case "annotations:remove":
    case "change:description":
      marginaliaModel.save(
        function() {topBar.setState({isSaving: "saving"});},
        function() {topBar.setState({isSaving: "done"});},
        function(err) {topBar.setState({isSaving: "error"});}
      );
    default:
      documentModel.setActiveAnnotations(marginaliaModel);
      marginaliaComponent.forceUpdate();
    }
  });

  documentModel.on("all", function(e, obj) {
    switch(e) {
    case "change:raw":
      var fingerprint = obj.changed.raw.pdfInfo.fingerprint;
      //self.router.navigate("view/" + fingerprint);
      documentComponent.setState({
        fingerprint: fingerprint
      });
      break;
    case "change:binary":
      marginaliaModel.reset();
      break;
    case "annotation:add":
      var model = marginaliaModel.findWhere({"active": true}).get("annotations");
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

  Backbone.history.start({pushState: true});

  // Set initial state
  marginaliaModel.reset(marginaliaModel.parse(window.models.marginalia));

});