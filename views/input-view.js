var app = app || {};
(function ($) {
  'use strict';


  // radioCheckboxTemplateMixin

  app.InputView = Backbone.View.extend({

    model: app.Input,

    // Different input types like to be triggered differently, all point to same underlying handling method
    events: {
      'blur input[type=text],[type=email]': 'updateModel',
      'click input[type=radio],[type=checkbox]': 'updateModel',
      'click input[type=button]': 'updateModel'
    },

    // Three separate groupings of templates
    textTemplate: _.template(
      '<label for="<%= obj.attributes.domId %>"><%= obj.attributes.label %></label>' +
      '<input class="u-full-width" type="<%= obj.attributes.type %>" placeholder="<%= obj.attributes.placeholder %>" ' +
      'id="<%= obj.attributes.domId %>" <%= obj.attributes.value ? "value=" + obj.attributes.value : ""%> <%= obj.attributes.isReadOnly? "readonly" : "" %>>'
    ),

    groupTemplate: _.template('' +
      '<fieldset>' +
      '<label id="<%= obj.attributes.domId %>"><%= obj.attributes.label %></label>' +
      '</fieldset>'
    ),

    buttonTemplate: _.template(
      '<input type="<%= obj.attributes.type %>" id="<%= obj.attributes.domId %>" value="<%= obj.attributes.label %>" data-value="<%= obj.attributes.value %>" <%= obj.attributes.isReadOnly? "readonly" : "" %>>'
    ),

    errorTemplate: _.template('<p class="alert alert-error"><%= obj.validationError %></p>'),

    initialize: function () {

      // Bind to the model when one of the three events are detected
      this.model.on('change:value', this.render, this);
      this.model.on('change:isVisible', this.render, this);
      this.model.on('change:isReadOnly', this.render, this);

      // Have this view pay attention to any external changes too (ie: button click to make read-only)
      Backbone.on(this.model.attributes.dataModel + '-changed', this.changed, this);
    },

    changed: function (property, value) {

      // Update the model with a property change.
      var prop = this.model.attributes[property];
      if (prop && prop === value) {
      } else {
        this.model.set(property, (value === 'toggle' ? !this.model.attributes[property] : value));
      }
    },

    render: function () {
      //console.log('rendering InputView');

      // Remove from DOM an invisible Input
      if (!this.model.attributes.isVisible) {
        this.$el.empty();
        return;
      }

      // Depending on the Model type, pick a fitting template
      switch (this.model.attributes.type) {
        case 'text':
        case 'email':
          this.$el.html(this.textTemplate(this.model));
          break;
        // case 'checkbox':
        // case 'radio':
        //   this.$el.html(this.groupTemplate(this.model));
        //   var checkedDom;
        //   var $group = this.$('#' + this.model.attributes.domId);
        //   _.each(this.model.attributes.inputs, function (input) {
        //     if (this.model.attributes.value === input.value) {
        //       checkedDom = input.domId;
        //     }
        //     if (!input.isReadOnly) {
        //       input.isReadOnly = false;
        //     }
        //     $group.append(this.radioCheckboxTemplate(input));
        //   }, this);
        //
        //   if (checkedDom) {
        //     this.$('#' + checkedDom).prop("checked", this.model.attributes.value);
        //   }
        //   break;
        case 'button':
          this.$el.html(this.buttonTemplate(this.model));
          break;
      }

      // Assign a ReadOnly if appropriate
      this.$el.prop('readonly', this.model.attributes.isReadOnly);

      // If validation errors were identified, add that template
      if (this.model.validationError) {
        this.$el.prepend(this.errorTemplate(this.model));
      }
      return this;
    },

    getValue: function () {
      // Get the value from the HTML element, again, unique per type
      var result = null;
      if (this.model.attributes.type === 'text' || this.model.attributes.type === 'email') {
        result = this.$('#' + this.model.attributes.domId).val();
      } else if (this.model.attributes.type === 'radio') {
        result = this.$el.find(':checked').val()
      } else if (this.model.attributes.type === 'checkbox') {
        result = this.$el.find(':checked').val() ? true : false;
      } else if (this.model.attributes.type === 'button') {
        result = this.$el.children().data('value');
      }
      return result;
    },

    updateModel: function () {

      // This line is here because readOnly input fields can have fired events,
      //  however we don't want to do anything about it
      if (this.model.attributes.isReadOnly) {
        return;
      }

      // Check to see if the value changed, if it does, update the Model backing this View
      //  and let others know.
      var value = this.getValue();
      if (this.model.attributes.value !== value) {
        this.model.set('value', value, {silent: true});
        this.model.isValid();
        this.render();

        // After we know this input field is good, let the parent form update itself with this data
        Backbone.trigger('model-changed', this.model.attributes.dataModel, this.model.attributes.value);

        if (!this.model.attributes.uiAttribute) {
          // Then trigger any ancillary inputs that need to be changed because of one thing or another...
          console.log(this.model.attributes.dataModel + '-changed (' + this.model.attributes.value + ')');
          Backbone.trigger(this.model.attributes.dataModel + '-changed', this.model.attributes.dataModel, this.model.attributes.value);
        }
      }

      // Regardless if the value changed, if this is a trigger based action, fire off the destination
      //  of the triggered action with the associated property
      if (this.model.attributes.uiAttribute) {
        var dotIndex = this.model.attributes.dataModel.indexOf('.');
        var dataModel = this.model.attributes.dataModel.substr(0, dotIndex);
        var dataModelProperty = this.model.attributes.dataModel.substr(dotIndex + 1);
        // Then trigger any ancillary inputs that need to be changed because of one thing or another...
        console.log(dataModel + '-changed (' + dataModelProperty + ')[' + this.model.attributes.value + ']');
        Backbone.trigger(dataModel + '-changed', dataModelProperty, this.model.attributes.value);
      }
    }


  });
})(jQuery);