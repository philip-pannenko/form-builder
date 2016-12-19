var app = app || {};
(function () {
  'use strict';
  app.Input = Backbone.Model.extend({
    defaults: {
      domId: -1,
      label: null,
      class: 'u-full-width',
      type: 'text',
      placeholder: null,
      dataModel: null,
      value: null,
      validationRules: null,
      behaviors: null,
      isVisible: true,
      isReadOnly: false,
      uiAttribute: false
    },

    initialize: function () {
      this.on('invalid', function (model, error) {
        this.set('error', error);
      });
    },

    validate: function (attrs, options) {
      var errors = [];

      // Go through each of the validation rules that are contextually specific to
      //  just this one Input
      _.each(this.attributes.validationRules, function (validation) {
        var error = (validation.method(attrs.value, this.attributes.label, validation.options));
        if (error) errors.push(error);
      }, this);

      return errors.length ? errors : null;

    }
  });
})();