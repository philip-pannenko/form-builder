var app = app || {};
(function ($) {
  'use strict';
  app.FormView = Backbone.View.extend({

    el: '.container',

    events: {
      'click #submit': 'submitForm'
    },

    template: _.template('<h1>Generated Form</h1><form id="form"></form><input id="submit" class="button-primary" type="submit" value="submit input">'),

    model: app.Form,

    inputs: app.Inputs,
    behaviors: {},

    initialize: function () {

      _.each(PAYLOAD, function (item) {
        var input = new app.Input(_.clone(item));

        input.set('uiAttribute', input.attributes.dataModel.indexOf('.') !== -1);
        this.model.set(input.attributes.dataModel, input.attributes.value);

        // Build the behavior tree by linking each adjacently associated model with one another
        this.collection.add(input);
        _.each(input.attributes.behaviors, function (behavior) {

          console.log('Input(' + input.attributes.dataModel + ') Behavior (' + behavior.method.name + ')');
          _.each(behavior.conditions, function (condition) {
            if (!this.behaviors[condition.dataModel]) {
              this.behaviors[condition.dataModel] = {};
            }

            var behaviorEvents = this.behaviors[condition.dataModel];
            behaviorEvents[input.attributes.dataModel] = {
              model: input,
              method: behavior.method,
              conditions: []
            };

            //console.log('Input(' + input.attributes.dataModel + ') Behavior (' + behavior.method.name + ') original condition (' + condition.dataModel + ')');
            _.each(behavior.conditions, function (condition) {

              //console.log('Input(' + input.attributes.dataModel + ') Behavior (' + behavior.method.name + ') related conditions (' + condition.dataModel + ')');
              behaviorEvents[input.attributes.dataModel]['conditions'].push({
                dataModel: condition.dataModel,
                value: condition.value,
                isVisible: condition.isVisible,
                isReadOnly: condition.isReadOnly
              });

            }, this)
          }, this)
        }, this);
      }, this);

      // Assign each behavior an event to trigger off of
      _.each(this.behaviors, function (behavior, key, name) {
        Backbone.on(key + '-changed', this.refreshForm, this);
      }, this);

      //console.log(JSON.stringify(this.behaviors, function (key, value) {
      //  if (typeof value === 'function') {
      //    return value.name;
      //  } else {
      //    return value;
      //  }
      //}, 2));

      // Any time an Input model is changed, update the Form model
      Backbone.on('model-changed', this.updateModel, this);

      // Build all of the Inputs onto the form separate from one another
      this.render();

      // Run all of the behaviors consolidated from each Input
      // to render the form according to how the Inputs ended up interacting with one another
      _.each(this.behaviors, function (behavior, key) {
        var dotIndex = key.indexOf('.');
        var dataModel = (dotIndex !== -1) ? key.substr(0, dotIndex) : key;
        var property = (dotIndex !== -1) ? key.substr(dotIndex + 1) : key;
        var value = this.model.attributes[key];
        Backbone.trigger(dataModel + '-changed', property, value);
      }, this);

    },

    refreshForm: function (dataModel, value) {

      // Gets called when an Input changes values and then
      //  we find out what other Inputs are associated with this change
      //  so that we fire off the other Inputs behavior / validation methods
      _.each(this.behaviors[dataModel], function (dataModel) {

        var data = [];
        _.each(dataModel.conditions, function (condition) {

          // Build a packet of actual/expected data which'll be used for validation / behaviors
          data.push({
            dataModel: condition.dataModel,
            actual: this.model.get(condition.dataModel),
            expected: condition.dataModel.endsWith('.isVisible') ? condition.isVisible : condition.dataModel.endsWith('.isReadOnly') ? condition.isReadOnly : condition.value
          });
        }, this);

        // Perform the validation / behavior
        dataModel.method(dataModel.model, data);
      }, this);
    },

    updateModel: function (property, value) {
      this.model.updateModel(property, value);
    },

    submitForm: function () {
      console.log(this.model.toJSON());
    },

    render: function () {
      //console.log('rendering FormView');
      this.$el.append(this.template());
      this.collection.each(function (input) {
        this.$('#form').append(new app.InputView({model: input}).render().$el);
      }, this);

    }

  });
})(jQuery);