/* -*- mode: js2; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js2-basic-offset: 2 -*- */
define(function (require) {
  'use strict';

  var _ = require("underscore");
  var $ = require("jquery");
  var React = require("react");

  var Annotate = require("jsx!./annotate");
  var Minimap = require("jsx!./minimap");
  var Page = require("jsx!./page");
  var TextUtil = require("../helpers/textUtil");

  var Immutable = require("immutable");

  var PDFJS = require("PDFJS");
  var PDFJSUrl = require.toUrl('PDFJS');

  PDFJS.cMapUrl = PDFJSUrl.replace(/\/pdf$/, '') + '/generic/web/cmaps/';
  PDFJS.cMapPacked = true;
  PDFJS.disableWebGL = false;

  PDFJS.workerSrc = PDFJSUrl + ".worker.js";

  var Document = React.createClass({
    getInitialState: function() {
      return {fingerprint: null,
              $viewer: null};
    },
    componentWillUpdate: function(nextProps, nextState) {
      var $viewer = this.state.$viewer;
      if($viewer) {
        if(nextState.select !== this.state.select) {
          var delta = $viewer.find("[data-uuid*="+ nextState.select + "]").offset().top;
          var viewerHeight = $viewer.height();
          var center = viewerHeight / 2;
          $viewer.animate({scrollTop: $viewer.scrollTop() + delta - center});
        }
      }
    },
    toggleHighlights: function(e, uuid) {
      var $annotations = this.state.$viewer.find("[data-uuid*="+uuid+"]");
      $annotations.toggleClass("highlight");
    },
    componentWillUnmount: function() {
      $(window).off("highlight", this.toggleHighlights);
    },
    componentDidMount: function() {
      $(window).on("highlight", this.toggleHighlights);

      var $viewer = $(this.refs.viewer.getDOMNode());
      this.setState({$viewer: $viewer});
    },
    render: function() {
      var pdf = this.props.pdf;
      var marginalia = this.props.marginalia;

      var fingerprint = this.state.fingerprint;
      var pages = pdf.get("pages");

      var annotations = Immutable.fromJS(pages.map(function(page, index) {
        return page.get("annotations");
      }));

      var pagesElements = pdf.get("pages").map(function(page, pageIndex) {
        return (<Page page={page} key={fingerprint + pageIndex} annotations={annotations.get(pageIndex)} />);
      });

      return(
        <div>
          <Minimap $viewer={this.state.$viewer} pdf={pdf} annotations={annotations} />
          <div className="viewer-container">
            <div className="viewer" ref="viewer">
               <Annotate marginalia={marginalia} />
               {pagesElements}
             </div>
           </div>
        </div>);
    }
  });

  return Document;
});
