var app = app || {};
(function () {
  'use strict';
  app.Elements = Backbone.Collection.extend({
    model: app.Element
  });
})();