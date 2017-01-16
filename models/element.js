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
      validationMessages: [],
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

    },

    /*
     * Extend basic Backbone.set method
     * Reason for this is because we want to do a soft validate.
     * Instead of preventing a value set to occur when validation fails,
     *  we actually want to set the value on the model but we want to also show a validation message
     * */
    set: function (key, value, options) {

      // This method can be called with a single attribute or an object attribute.
      //  Convert it into a common object that can be handled.
      var attrs = {};
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs[key] = value;
      }

      // Check to see if the attributes.value is defined in this Backbone.set call
      // If it is defined, validate it against our custom validate method so that
      //  messages can show up for the user indicating if the value was appropriate or not
      if (!_.isUndefined(this.attributes.model) && !_.isUndefined(attrs.value)) {
        this.validate(attrs);
      }

      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    /*
     * Override validate method
     * If a {'validate': true} is passed into the setter, this method will be called however,
     *  this method is only used internally by the extended Backbone.set method above.
     * */
    validate: function (attrs, options) {

      var errors = [];

      // Go through each of the validation rules that are contextually specific to just this one Element
      _.each(this.attributes.validationRules, function (validation) {
        var error = (validation.method(attrs.value, validation.options));
        if (error) errors.push(error);
      }, this);

      // Clear our the previous validation messages if there are any
      if (this.attributes.validationMessages.length) {
        this.attributes.validationMessages.splice(0, this.attributes.validationMessages.length);
      }

      if (errors.length) {
        this.attributes.validationMessages.push(errors);
        return errors;
      } else {
        return null;
      }

    },

    changeAttribute: function (attribute, value) {
      // If the attribute set to be changed is isVisible, also clear out the value associated with it.
      if (attribute === 'isVisible' && value === false) {
        this.set('value', null, {silent: true}); // May want to un-silent this so that we can propogate down this change
      }
      this.set(attribute, value);
    }

  });
})();