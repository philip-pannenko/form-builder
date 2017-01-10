var app = app || {};
(function () {
  'use strict';
  app.Input = Backbone.Model.extend({

    initialize: function (options) {
      if (!options.id) {
        this.attributes.id = _.uniqueId('form-id-');
      }

      if (options.type) {
        _.each(options.type, function (value, key) {
          if (!this.attributes[key]) {
            this.attributes[key] = value;
          }
        }, this);
        this.attributes.template = options.type.template;
      }

      // TODO: clean up the way labels are created by default
      // Add a label because it's wordy to have to define a separate component otherwise in the configuration
      if (!_.isUndefined(options.label) && options.type !== Type.Label) {
        this.attributes.labelTemplate = {
            type: Type.Label,
            label: options.label,
            forAttr: options.id,
            id: _.uniqueId('form-id-'),
            styleClass: null
          };
      }

      if(this.attributes.type === Type.Checkbox) {
        this.attributes.checked = {};
        _.each(this.attributes.default, function(value) {
          this.attributes.checked[value] = true;
        }, this);
      }

      if(this.attributes.type === Type.Radio) {
        this.attributes.value = options.default;
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