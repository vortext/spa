/* -*- tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2; js-indent-level: 2; -*- */
define(['jQuery', 'underscore', 'Q', 'backbone'], function($, _, Q, Backbone) {
  'use strict';

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
    return str ? str.replace(/ /g, "-").toLowerCase() : null;
  };

  var Annotator = {
    _postProcess: function(data) {
      data = _.clone(data);
      _.each(data, function(result, idx) {
        var id = toClassName(result.name);
        result.active = idx == 0 ? true : false;
        result.id = id;
        result.color = colors[idx % colors.length];
      });
      return data;
    },
    annotate: function(document) {
      var self = this;
      var deferred = Q.defer();
      var contents = _.pluck(document.pages, "content");
      $.ajax({
        url: '/annotate',
        type: 'POST',
        data: JSON.stringify({pages: contents}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: true,
        error: function(request, error) {
          console.error("Could not request annotations", error);
          deferred.reject(request);
        },
        success: function(data) {
          deferred.resolve(self._postProcess(data.result));
        }});
      return deferred.promise;
    }
  };

  var Result = Backbone.Model.extend({
    defaults: {
      id: "",
      document: null,
      color: null,
      name: "",
      active: false,
      annotations: []
    }
  });

  var Results = Backbone.Collection.extend({
    model: Result,
    fetch: function(document) {
      var self = this;
      Annotator.annotate(document)
        .then(function(results) {
          self.reset(results);
        });
    }
  });

  return Results;
});
