var app = app || {};
(function ($) {
  'use strict';

  app.ElementView = Backbone.View.extend({

    model: app.Element,

    // Different element types like to be triggered differently, all point to same underlying handling method
    events: {
      'blur input[type=text]': 'updateModel',
      'click input[type=radio],[type=checkbox]': 'updateModel',
      'click input[type=button]': 'updateModel'
    },

    errorTemplate: _.template('<p class="alert alert-error"><%= obj.validationError %></p>'),

    initialize: function () {

      this.template = _.template(this.model.attributes.template);

      // TODO: Name this better
      if (this.model.attributes.labelTemplate) {
        this.labelTemplate = _.template(this.model.attributes.labelTemplate.type.template);
      }
      // Bind to the model when one of the three events are detected
      this.model.on('change:value', this.render, this);
      this.model.on('change:isVisible', this.render, this);
      this.model.on('change:isReadOnly', this.render, this);
      this.model.on('change:value', this.notifyModelUpdated, this);

      // Have this view pay attention to any external changes too (ie: button click to make read-only)
      Backbone.on(this.model.attributes.model + '-changed', this.changed, this);
    },

    changed: function (property, value) {

      // Update the model with a property change.
      var prop = this.model.attributes[property];
      if (prop && prop === value) {
        // do nothing
      } else {
        this.model.set(property, value);
      }
    },

    render: function () {
      console.log('rendering ElementView-' + this.model.attributes.id);

      // Remove from DOM an invisible Element
      if (!_.isUndefined(this.model.attributes.isVisible) && !this.model.attributes.isVisible) {
        this.$el.empty();
        return;
      }

      if (this.model.attributes.type === app.Type.Checkbox || this.model.attributes.type === app.Type.Radio) {
        this.$el.empty();
        _.each(this.model.attributes.list, function (item, i) {
          var option = this.model.toJSON();
          option.optionValue = item.value;
          option.optionLabel = item.label;

          if (this.model.attributes.type === app.Type.Checkbox) {
            option.checked = this.model.attributes.checked[item.value];
          } else if (this.model.attributes.type === app.Type.Radio) {
            if (_.isUndefined(this.model.attributes.value) || _.isNull(this.model.attributes.value)) {
              this.model.set('value', item.value, {silent: true}); // re-default a value to the first option
              this.notifyModelUpdated(); // important because we need to cascade down changes to other depended items
            }
            option.checked = this.model.attributes.value === item.value;
          }

          this.$el.append(this.template(option));
        }, this)
      } else {
        this.$el.html(this.template(this.model.toJSON()));
      }

      // TODO: Find out way to bundle non value attributes of an element
      if (!_.isUndefined(this.model.attributes.isReadOnly) && !this.model.attributes.isReadOnly) {
        this.$el.prop('readonly', this.model.attributes.isReadOnly);
      }

      // If validation errors were identified, add that template
      if (this.model.attributes.labelTemplate) {
        this.$el.prepend(this.labelTemplate(this.model.attributes.labelTemplate)); // = _.template(this.model.attributes.labelTemplate.type.template);
      }

      // If validation errors were identified, add that template
      if (this.model.validationError) {
        this.$el.prepend(this.errorTemplate(this.model));
      }
      return this;
    },

    updateModel: function (e) {
      // This line is here because readOnly element fields can have fired events,
      //  however we don't want to do anything about it
      if (this.model.attributes.isReadOnly) {
        return;
      }

      // Return if no model is associated with this element
      if (!this.model.attributes.model) {
        return;
      }

      // Check to see if the value changed, if it does, update the Model backing this View
      //  and let others know.
      var value = e.target.value;
      var type = e.target.type;
      var isChecked = e.target.checked;

      if (type === 'checkbox') {
        if (isChecked) {
          this.model.attributes.checked[value] = true;
        } else {
          delete this.model.attributes.checked[value];
        }
        value = _.keys(this.model.attributes.checked);
      }

      // Sanitize booleans
      if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      }

      // Don't trigger any event changes if the values are the same;
      if (this.model.attributes.value === value) {
        return;
      }

      this.model.set('value', value, {silent: true}); // silent because we don't want to re-render DOM if it's not valid

      this.model.isValid(); // validate the value is accurate
      this.render(); // only after it's accurate, repaint the dom

      this.notifyModelUpdated();

    },

    notifyModelUpdated: function () {
      // After we know this element field is good, let the parent form update itself with this data
      console.log('model-changed, ' + this.model.attributes.model + ', (' + this.model.attributes.value + ')');
      Backbone.trigger('model-changed', this.model.attributes.model, this.model.attributes.value);
    }

  });
})(jQuery);