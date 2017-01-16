var app = app || {};
(function () {
  'use strict';
  app.Element = Backbone.Model.extend({

    defaults: {
      id: null,
      type: undefined,
      template: undefined,
      label: undefined,
      value: undefined,
      model: undefined,
      styleClass: undefined,
      forAttr: undefined,
      checked: undefined,
      validationRules: {},
      isReadOnly: false,
      isVisible: true
    },

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

      // TODO: Clean up the way labels are created by default
      // Add a label because it's wordy to have to define a separate component otherwise in the configuration
      if (!_.isUndefined(options.label) && options.type !== app.Type.Label) {
        this.attributes.labelTemplate = {
          type: app.Type.Label,
          label: options.label,
          forAttr: options.id,
          id: _.uniqueId('form-id-'),
          styleClass: null
        };
      }

      if (this.attributes.type === app.Type.Checkbox) {
        this.attributes.checked = {};
        _.each(this.attributes.default, function (value) {
          this.attributes.checked[value] = true;
        }, this);
      }

      if (this.attributes.type === app.Type.Radio) {
        this.attributes.value = options.default;
      }

      this.on('invalid', function (model, error) {
        this.set('error', error);
      });
    },

    validate: function (attrs, options) {
      var errors = [];

      // Go through each of the validation rules that are contextually specific to
      //  just this one Element
      _.each(this.attributes.validationRules, function (validation) {
        var error = (validation.method(attrs.value, validation.options));
        if (error) errors.push(error);
      }, this);

      return errors.length ? errors : null;

    }
  });
})();