/* -*- mode: js2; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js2-basic-offset: 2 -*- */
define(function (require) {
  'use strict';

  var _ = require("underscore");
  var $ = require("jquery");
  var React = require("react");

  var Popup = require("jsx!./popup");
  var Minimap = require("jsx!./minimap");
  var Page = require("jsx!./page");
  var TextUtil = require("../helpers/textUtil");

  var Immutable = require("immutable");

  var PDFJS = require("PDFJS");
  var PDFJSUrl = require.toUrl('PDFJS');

  PDFJS.workerSrc = PDFJSUrl + ".worker.js";
  PDFJS.disableWebGL = !Modernizr.webgl;

  var Document = React.createClass({
    getInitialState: function() {
      return {fingerprint: null,
              $viewer: null};
    },
    componentWillUpdate: function(nextProps, nextState) {
      var $viewer = this.state.$viewer;
      if($viewer) {
        if(nextState.fingerprint !== this.state.fingerprint) {
          $viewer.scrollTop(0);
        }
      }
    },
    componentDidMount: function() {
      var $viewer = $(this.refs.viewer.getDOMNode());
      this.setState({$viewer: $viewer});
    },
    render: function() {
      var pdf = this.props.pdf;

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
            <div className="viewer"ref="viewer">
               {pagesElements}
             </div>
           </div>
        </div>);
    }
  });

  return Document;
});
