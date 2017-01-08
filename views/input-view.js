var app = app || {};
(function ($) {
  'use strict';

  app.InputView = Backbone.View.extend({

    model: app.Input,

    // Different input types like to be triggered differently, all point to same underlying handling method
    events: {
      'blur input[type=text]': 'updateModel',
      'click input[type=radio],[type=checkbox]': 'updateModel',
      'click input[type=button]': 'updateModel'
    },

    errorTemplate: _.template('<p class="alert alert-error"><%= obj.validationError %></p>'),

    initialize: function () {

      this.template = _.template(this.model.attributes.template);


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
        // do nothing
      } else {
        this.model.set(property, (value === 'toggle' ? !this.model.attributes[property] : value));
      }
    },

    render: function () {
      console.log('rendering InputView-' + this.model.attributes.domId);

      // Remove from DOM an invisible Input
      // if (!this.model.attributes.isVisible) {
      //   this.$el.empty();
      //   return;
      // }

      if (this.model.attributes.list) {
        if(this.model.attributes.type === 'checkbox') {
          this.$el.empty();
          _.each(this.model.attributes.list, function (item) {
            var foo = this.model.toJSON();
            foo.value = item;
            foo.label = item;
            foo.checked = this.model.attributes.checked ? this.model.attributes.checked[item] || this.model.attributes.checked === item  : false;
            this.$el.append(this.template(foo));
          }, this)
        } else if(this.model.attributes.type === 'radio') {
          this.$el.empty();
          _.each(this.model.attributes.list, function (item) {
            var foo = this.model.toJSON();
            foo.value = item;
            foo.label = item;
            foo.checked = this.model.attributes.checked ? this.model.attributes.checked[item] || this.model.attributes.checked === item  : false;
            this.$el.append(this.template(foo));
          }, this)
        }
      } else {
        this.$el.html(this.template(this.model.toJSON()));
      }
      // Assign a ReadOnly if appropriate
      // this.$el.prop('readonly', this.model.attributes.isReadOnly);

      // If validation errors were identified, add that template
      if (this.model.validationError) {
        this.$el.prepend(this.errorTemplate(this.model));
      }
      return this;
    },

    updateModel: function (e) {
      // This line is here because readOnly input fields can have fired events,
      //  however we don't want to do anything about it
      if (this.model.attributes.isReadOnly) {
        return;
      }

      if (!this.model.attributes.dataModel) {
        return;
      }


      // Check to see if the value changed, if it does, update the Model backing this View
      //  and let others know.
      var value = e.target.value;

      debugger;
      // If this is a list of items, check what changed
      if (this.model.attributes.list) {

          if (!this.model.attributes.checked) {
            this.model.set('checked', {}, {silent: true});
          }
          if (e.target.checked) {
            if(e.target.type === 'radio') {
              this.model.attributes.checked = {};
            }
            this.model.attributes.checked[value] = e.target.checked;
          } else {
            delete this.model.attributes.checked[value];
            if (_.size(this.model.attributes.checked) === 0) {
              this.model.set('checked', null, {silent: true});
            }
          }
        if (e.target.type === 'checkbox') {
          value = _.clone(this.model.attributes.checked);
        }

      }
      else if (e.target.type === 'checkbox') {
        this.model.set('checked', e.target.checked, {silent: true});
        value = this.model.attributes.checked;
      } else if (e.target.type === 'radio') {
        this.model.set('checked', value, {silent: true});
      }
      else if (this.model.attributes.value !== value) {
        this.model.set('value', value, {silent: true}); // silent because we don't want to re-render DOM if it's not valid
      }

      this.model.isValid(); // validate the value is accurate
      this.render(); // only after it's accurate, repaint the dom


      // After we know this input field is good, let the parent form update itself with this data
      console.log('model-changed, ' + this.model.attributes.dataModel + ', ' + value);
      Backbone.trigger('model-changed', this.model.attributes.dataModel, value);


      // // Regardless if the value changed, if this is a trigger based action, fire off the destination
      // //  of the triggered action with the associated property
      // if (this.model.attributes.uiAttribute) {
      //   var dotIndex = this.model.attributes.dataModel.indexOf('.');
      //   var dataModel = this.model.attributes.dataModel.substr(0, dotIndex);
      //   var dataModelProperty = this.model.attributes.dataModel.substr(dotIndex + 1);
      //   // Then trigger any ancillary inputs that need to be changed because of one thing or another...
      //   console.log(dataModel + '-changed (' + dataModelProperty + ')[' + this.model.attributes.value + ']');
      //   Backbone.trigger(dataModel + '-changed', dataModelProperty, this.model.attributes.value);
      // }
    }


  });
})(jQuery);