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

    // TODO: These three variables are begging for a better name
    rules: {},
    findRuleNameByDataModel: {},
    uiBehaviors: {},

    initialize: function () {

      // TODO: Move a number of the attributes from this view into the model
      _.each(FormSchema, function (component) {

        if (component.dataModel) {
          // Assign the values from the form to the form model
          if (!_.isUndefined(component.default)) {
            this.model.set(component.dataModel, component.default);
          } else {
            this.model.set(component.dataModel, null);
          }
        }
        this.collection.add(new app.Input(component));

      }, this);

      _.each(BehaviorSchema, function (behavior) {
        var formRule = new jsrules.Rule(behavior.name);

        // TODO Add static references instead of string comparisons
        _.each(behavior.rules, function (rule, i) {

          if (rule.type === 'proposition') {
            formRule.addProposition(rule.element, rule.value);
          } else if (rule.type === 'variable') {
            formRule.addVariable(rule.element + 'expected', rule.value);
            formRule.addVariable(rule.element, null); // actual
            // TODO: Expand this to accept a number of additional Operators
            formRule.addOperator(jsrules.Operator.EQUAL_TO);
          } else if (rule.type === 'operator') {
            // TODO: Expand this to accept a number of additional Operators
            formRule.addOperator(jsrules.Operator.AND);
          }

          if (rule.type !== 'operator') {
            // Reverse lookup rules by dataModel so that all behaviors can be run if the dataModel is changed
            if (!this.findRuleNameByDataModel[rule.element]) {
              console.log(rule.element);
              this.findRuleNameByDataModel[rule.element] = [];
            }
            this.findRuleNameByDataModel[rule.element].push(behavior.name);
          }
        }, this);

        // Add lookup of rule by behavior name
        this.rules[behavior.name] = formRule;

        // Add reverse lookup of
        this.uiBehaviors[behavior.name] = {id: behavior.target, value: true, type: behavior.type}

      }, this);

      // Any time an Input model is changed, update the Form model
      Backbone.on('model-changed', this.updateModel, this);

      // Build all of the Inputs onto the form separate from one another
      this.render();

      // Run all of the behaviors to render actual interacted form
      _.each(this.findRuleNameByDataModel, function (ruleName, dataModel) {
        this.runFormRules(dataModel);
      }, this);

    },

    runFormRules: function (property) {
      _.each(this.findRuleNameByDataModel[property], function (ruleName) {

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
              fact.addVariable(element.name, null); // add placeholder for JSRules to be able to lookup rule
            }
          }
        }, this);

        // TODO: Clean this up and add other ui properties aside from isVisible (ie: readonly?)
        var uiBehavior = this.uiBehaviors[ruleName];
        var ruleResult = rule.evaluate(fact).value;
        if (uiBehavior.value !== ruleResult) {
          console.log('ruleName' + ruleName + ', uiBehavior:' + uiBehavior.value + ', ruleResult:' + ruleResult + ', ');
          uiBehavior.value = ruleResult;
          var input = this.collection.get(uiBehavior.id);
          var properties = uiBehavior.value ? {isVisible: uiBehavior.value} : {
              isVisible: uiBehavior.value,
              value: null
            };
          input.set(properties);

        }

      }, this);
    },

    updateModel: function (property, value) {
      this.model.updateModel(property, value);
      this.runFormRules(property, value);

      // TODO: After a model is updated, make sure self components are listening to change in case multiple components are bound to the same model

      // Then trigger any ancillary inputs that need to be changed because of one thing or another...
      console.log(property + '-changed, (' + value + ')');
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