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
    rules: {},
    reverseRulesLookup: {},

    initialize: function () {

      this.model.set('domIds', {}, {silent: true});

      _.each(FormSchema, function (component) {

        if (component.dataModel) {
          if (typeof component.value !== 'undefined') {
            this.model.set(component.dataModel, component.value);
          } else if (component.checked) {
            if (typeof component.checked === "string") {
              this.model.set(component.dataModel, component.checked);
            } else {
              this.model.set(component.dataModel, _.keys(component.checked));
            }
          } else {
            this.model.set(component.dataModel, null);
          }
        }
        this.model.get('domIds')[component.domId] = true;
        this.collection.add(new app.Input(component));

      }, this);

      _.each(BehaviorSchema, function (behavior) {
        var formRule = new jsrules.Rule(behavior.name);

        _.each(behavior.rules, function (rule, i) {

          if (rule.type === 'proposition') {
            formRule.addProposition(rule.element, rule.value);
          } else if (rule.type === 'variable') {
            formRule.addVariable(rule.element + 'expected', rule.value);
            formRule.addVariable(rule.element, null); // actual
            formRule.addOperator(jsrules.Operator.EQUAL_TO);
          } else if (rule.type === 'operator') {
            formRule.addOperator(jsrules.Operator.AND);
          }

          // Reverse lookup rules by dataModel so that all behaviors can be run if the dataModel is changed
          if (!this.reverseRulesLookup[rule.element]) {
            this.reverseRulesLookup[rule.element] = [];
          }
          this.reverseRulesLookup[rule.element].push(behavior.name);
        }, this);
        this.rules[behavior.name] = formRule;

      }, this);

      // Assign each behavior an event to trigger off of
      // _.each(this.behaviors, function (behavior, key, name) {
      //   Backbone.on(key + '-changed', this.refreshForm, this);
      // }, this);

      //console.log(JSON.stringify(this.behaviors, function (key, value) {
      //  if (typeof value === 'function') {
      //    return value.name;
      //  } else {
      //    return value;
      //  }
      //}, 2));

      // Any time an Input model is changed, update the Form model
      Backbone.on('model-changed', this.updateModel, this);
      //
      // Build all of the Inputs onto the form separate from one another
      this.render();

      //
      // // Run all of the behaviors consolidated from each Input
      // // to render the form according to how the Inputs ended up interacting with one another
      // _.each(this.behaviors, function (behavior, key) {
      //   var dotIndex = key.indexOf('.');
      //   var dataModel = (dotIndex !== -1) ? key.substr(0, dotIndex) : key;
      //   var property = (dotIndex !== -1) ? key.substr(dotIndex + 1) : key;
      //   var value = this.model.attributes[key];
      //   Backbone.trigger(dataModel + '-changed', property, value);
      // }, this);

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

      debugger;

      _.each(this.reverseRulesLookup[property], function (ruleName) {

        var rule = this.rules[ruleName];
        console.log('The following rule is going to be run: ' + rule.name);

        var fact = new jsrules.RuleContext(rule.name + 'Fact');
        _.each(rule.elements, function (element) {
          if (element.type === 'jsrules.Proposition') {
            fact.addProposition(element.name, this.model.attributes[element.name]);
          } else if (element.type === 'jsrules.Variable') {
            if (typeof this.model.attributes[element.name] != 'undefined') {
              fact.addVariable(element.name, this.model.attributes[element.name]);
            } else {
              // Need to add placeholder for JSRules to be able to lookup rule
              fact.addVariable(element.name, null);
            }
          }
        }, this);
        console.log(rule.evaluate(fact).value);
      }, this);

      // Then trigger any ancillary inputs that need to be changed because of one thing or another...
      console.log(property + '-changed, ' + value);
      Backbone.trigger(property + '-changed', property, value);

    },

    submitForm: function () {
      console.log(this.model.toJSON());
    },

    render: function () {
      console.log('rendering FormView');
      this.$el.append(this.template());
      this.collection.each(function (input) {
        this.$('#form').append(new app.InputView({model: input}).render().$el);
      }, this);

    }

  });
})(jQuery);