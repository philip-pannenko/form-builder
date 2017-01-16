var app = app || {};
(function () {
  'use strict';
  app.Form = Backbone.Model.extend({

    defaults: {
      rules: {},
      findRuleNameByDataModel: {},
      uiBehaviors: {}
    },

    initialize: function() {
      this.set('elements', new app.Elements(), {silent:true});
    },

    updateModel: function (modelProperty, value) {
      if (this.attributes[modelProperty] !== undefined) {
        this.set(modelProperty, value);
      }
    }

  });
})();