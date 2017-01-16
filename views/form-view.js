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

    initialize: function () {

      this.model = new app.Form();

      // Go through each form schema element and add it to the form model
      _.each(app.FormSchema, function (element) {

        if (element.model) {
          // Assign the values from the form to the form model
          if (!_.isUndefined(element.default)) {
            this.model.createModel(element.model, element.default);
          } else {
            this.model.createModel(element.model, null);
          }
        }

        // Create a Backbone model and add it to the collection of Element models
        var elementModel = new app.Element(element);
        this.model.attributes.elements.add(elementModel);

        // Reverse lookup element by domId
        if (!this.model.attributes.domIdElements[element.id]) {
          this.model.attributes.domIdElements[element.id] = [];
        }
        this.model.attributes.domIdElements[element.id].push(elementModel);

      }, this);

      // Go through each behavior schema and add it the the form model
      _.each(app.RulesSchema, function (ruleSchema) {
        var formRule = new jsrules.Rule(ruleSchema.name);

        _.each(ruleSchema.rules, function (rule) {

          if (rule.type === app.BehaviorType.Proposition) {
            formRule.addProposition(rule.model, rule.value);
          } else if (rule.type === app.BehaviorType.Variable) {
            formRule.addVariable(rule.model + 'expected-', rule.value);
            formRule.addVariable(rule.model, null); // this is needed to fulfill jsrule template
            formRule.addOperator(rule.operator);
          } else if (rule.type === app.BehaviorType.Operator) {
            formRule.addOperator(rule.operator);
          }

          // Reverse lookup rules by modelName
          if (rule.type !== app.BehaviorType.Operator) {
            if (!this.model.attributes.modelRules[rule.model]) {
              this.model.attributes.modelRules[rule.model] = [];
            }
            this.model.attributes.modelRules[rule.model].push(formRule);
          }
        }, this);

        // TODO: There's got to be a safer and more conventional way to add a property to the jsrule.Rule object
        formRule.target = ruleSchema.target;

        // Add lookup of rule by behavior name
        this.model.attributes.rules[ruleSchema.name] = formRule;

      }, this);

      // Any time an Element model is changed, update the Form model
      Backbone.on('model-changed', this.updateModel, this);

      // Build all of the Elements onto the form separate from one another
      this.render();

      // Run all of the behaviors to render actual interacted form
      _.each(this.model.attributes.modelRules, function (ruleName, model) {
        this.runFormRules(model);
      }, this);

    },

    runFormRules: function (property) {

      _.each(this.model.attributes.modelRules[property], function (rule) {

        console.log('running Rule(' + rule.name + ')');

        var fact = new jsrules.RuleContext(rule.name + '-fact');
        _.each(rule.elements, function (element) {
          if (element.type === 'jsrules.Proposition') {
            fact.addProposition(element.name, this.model.attributes.model[element.name]);
          } else if (element.type === 'jsrules.Variable') {
            if (typeof this.model.attributes.model[element.name] != 'undefined') {
              fact.addVariable(element.name, this.model.attributes.model[element.name]);
            } else {
              fact.addVariable(element.name, null); // add placeholder for JSRules to be able to lookup rule
            }
          }
        }, this);

        _.each(this.model.attributes.domIdElements[rule.target], function (element) {

          // Run the jsRule using real-time model values to generate a true or false
          var ruleResult = rule.evaluate(fact).value;

          // If the rule is found to be valued differently than the previous value, update the model associated with the rule
          if (element.attributes.isVisible !== ruleResult) {
            console.log('rule(' + rule.name + ') caused dom-id(' + rule.target + ') to change');
            // Update the Element properties causing the Element View to be re-rendered.
            element.set({
              isVisible: ruleResult, value: null
            });
          }
        }, this);


      }, this);
    },

    updateModel: function (property, value) {

      if (this.model.updateModel(property, value)) {
        this.runFormRules(property, value);

        // TODO: After a model is updated, make sure self components are listening to change in case multiple components are bound to the same model

        // Then trigger any ancillary elements that need to be changed because of one thing or another...
        console.log(property + '-changed, (' + value + ')');
        Backbone.trigger(property + '-changed', property, value);
      }
    },

    submitForm: function () {
      console.log(this.model.attributes.model);
    },

    render: function () {
      console.log('rendering FormView');
      this.$el.append(this.template());
      this.model.attributes.elements.each(function (element) {
        this.$('#form').append(new app.ElementView({model: element}).render().$el);
      }, this);

    }

  });
})(jQuery);