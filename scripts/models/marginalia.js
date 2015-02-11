/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2; -*- */
define(function (require) {
  'use strict';

  var _ = require("underscore");
  var $ = require("jquery");
  var Backbone = require("backbone");
  var Annotation = require('./annotation');

  var colors = // from Cynthia Brewer (ColorBrewer)
        [[102,166,30],
         [230,171,2],
         [117,112,179],
         [27,158,119],
         [217,95,2],
         [231,41,138],
         [166,118,29],
         [27,158,119],
         [217,95,2],
         [117,112,179],
         [231,41,138],
         [102,166,30],
         [230,171,2],
         [166,118,29],
         [102,102,102]];

  function toClassName(str) {
    return str.replace(/ /g, "-").toLowerCase();
  };

  var guid = function() {
    // RFC4122 version 4 compliant
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  };

  var Annotations = Backbone.Collection.extend({
    model: Annotation
  });

  var Marginalis = Backbone.Model.extend({
    defaults: {
      id: null,
      description: "",
      color: null,
      title: null,
      active: false
    },
    initialize: function(data) {
      var self = this;
      var annotations = new Annotations(data.annotations);
      this.set("annotations", annotations);
      annotations.on("all", function(e, obj)  {
        self.trigger("annotations:" + e, obj);
      });
    },
    toJSON: function() {
      var json = _.clone(this.attributes);
      for(var attr in json) {
        if((json[attr] instanceof Backbone.Model) || (json[attr] instanceof Backbone.Collection)) {
          json[attr] = json[attr].toJSON();
        }
      }
      return json;
    }
  });

  var Marginalia = Backbone.Collection.extend({
    model: Marginalis,
    parse: function(data, options) {
      var marginalia = _.clone(data.marginalia);
      _.each(marginalia, function(marginalis, idx) {
        var id = marginalis.id || toClassName(marginalis.title);
        marginalis.active = idx === 0;
        marginalis.id = id;
        marginalis.color = colors[idx % colors.length];
      });
      return marginalia;
    },
    save: _.throttle(function(beforeSend, successCallback, errorCallback) {
      var self = this;
      beforeSend();
      $.ajax({
        url: window.location.href,
        type: "PUT",
        data: {data: JSON.stringify({marginalia: self.toJSON()})},
        headers: {"X-CSRF-Token": CSRF_TOKEN},
        success: function(data) {
          successCallback(data);
        },
        error: function(err) {
          errorCallback(err);
        }
      });
    }, 2500),
    setActive: function(marginalia) {
      this.each(function(marginalis) { marginalis.set("active", false, {silent: true}); });
      this.get(marginalia.cid).set("active", true);
    },
    getActive: function() {
      return this.findWhere({active: true});
    },
    addAnnotation: function(content) {
      var marginalia = this.getActive();
      if(!marginalia) return;
      var annotations = marginalia.get("annotations");

      annotations.add(new Annotation({
        content: content,
        uuid: guid()
      }));
    }
  });

  return Marginalia;
});
