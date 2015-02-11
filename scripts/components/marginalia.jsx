/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2 -*- */
define(function (require) {
  'use strict';

  var _ = require("underscore");
  var React = require("react");

  var Editable = require("jsx!./editable");

  var Annotation = React.createClass({
    destroy: function() {
      this.props.annotation.destroy();
    },
    select: function(annotation) {
      this.props.annotation.select();
    },
    render: function() {
      var annotation = this.props.annotation;
      var text = annotation.get("content");

      var isActive = this.props.isActive;
      var content;
      if(isActive) {
        content = <a className="wrap" title="Jump to annotation" onClick={this.select}>{text}</a> ;
      } else {
        content = <span className="wrap">{text}</span>;
      }

      var remove = <i className="fa fa-remove remove" />;

      return (<li>
               <p className="text-left">
                 {content}
                 {isActive ? <a onClick={this.destroy}>{remove}</a> : null}
               </p>
              </li>);
    }
  });

  var Block = React.createClass({
    getInitialState: function() {
      return { annotationsActive: false };
    },
    toggleActivate: function(e) {
      var marginalia = this.props.marginalia;
      marginalia.setActive(this.props.marginalis);
    },
    foldAnnotations: function() {
      this.setState({annotationsActive: !this.state.annotationsActive});
    },
    setDescription: function(val) {
      this.props.marginalis.set("description", val);
    },
    render: function() {
      var marginalis = this.props.marginalis;
      var description = marginalis.get("description");
      var isActive = marginalis.get("active");
      var annotationsActive = this.state.annotationsActive;
      var style = {
        "backgroundColor": isActive ? "rgb(" + marginalis.get("color") + ")" : "inherit",
        "color": isActive ? "white" : "inherit"
      };

      var annotations = marginalis.get("annotations").map(function(annotation, idx) {
        return <Annotation annotation={annotation} isActive={isActive} key={idx} />;
      });

      var divider =  (annotationsActive ? "▾" : "▸") +  " annotations (" + annotations.length + ")";

      return (<div className="block">
               <h4>
                 <a onClick={this.toggleActivate} style={style}>{marginalis.get("title")} </a>
               </h4>
               <div className="content">
                 <Editable content={description} callback={this.setDescription} />
                 <div className="divider"><a onClick={this.foldAnnotations}>{divider}</a></div>
                 <ul className="no-bullet annotations" style={{"maxHeight": annotationsActive ? 500 : 0}} >{annotations}</ul>
               </div>
              </div>);
    }
  });

  var Marginalia = React.createClass({
    render: function() {
      var marginalia = this.props.marginalia;
      var blocks = marginalia.map(function(marginalis, idx) {
        return <Block key={idx} marginalia={marginalia} marginalis={marginalis}  />;
      });
      return (<div>{blocks}</div>);
    }
  });

  return Marginalia;
});
