var app = app || {};
(function () {
  'use strict';
  app.Form = Backbone.Model.extend({

    updateModel: function (modelProperty, value) {
      if (this.attributes[modelProperty] !== undefined) {
        this.set(modelProperty, value);
      }
    }

  });
})();