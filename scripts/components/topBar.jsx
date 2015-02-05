/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2 -*- */
define(function (require) {
  'use strict';

  var React = require("react");

  var TopBar = React.createClass({
    render: function() {
      return (
          <div>
            <ul className="title-area">
              <li className="name">
                <h1><a href="/">Vortext</a></h1>
              </li>
            </ul>

            <section className="top-bar-section">
              <ul className="right">
                <li><a href="example">About</a></li>
              </ul>

              <ul className="left">
                <li className="active"><a>Upload</a></li>
                <li><a>Example</a></li>
              </ul>
            </section>
          </div>
      );
    }
  });

  return TopBar;
});
