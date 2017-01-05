var app = app || {};
(function () {
  'use strict';
  app.Input = Backbone.Model.extend({

    initialize: function (options) {
      if (!options.domId) {
        this.attributes.domId = _.uniqueId('form-input-');
      }

      if (options.template) {
        _.each(options.template, function (value, key) {
          if (!this.attributes[key]) {
            this.attributes[key] = value;
          }
        }, this);
        this.attributes.template = options.template.template;
      }
      this.on('invalid', function (model, error) {
        this.set('error', error);
      });
    },

    validate: function (attrs, options) {
      var errors = [];

      // Go through each of the validation rules that are contextually specific to
      //  just this one Input
      _.each(this.attributes.validationRules, function (validation) {
        var error = (validation.method(attrs.value, validation.options));
        if (error) errors.push(error);
      }, this);

      return errors.length ? errors : null;

    }
  });
})();