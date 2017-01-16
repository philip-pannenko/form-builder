var app = app || {};
(function ($) {
  'use strict';
  app.FormView = Backbone.View.extend({

    el: '.container',

    events: {
      'click #submit': 'submitForm'
    },

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

        if (!this.model.attributes.modelDomIds[element.model]) {
          this.model.attributes.modelDomIds[element.model] = [];
        }

        this.model.attributes.modelDomIds[element.model].push(element.id);

        // Reverse lookup element by domId
        this.model.attributes.domIdElement[element.id] = elementModel;

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

        // TODO: There's got to be a safer and more conventional way in Javascript to add a property to an existing 3rd party object (jsrule.Rule in this case)
        formRule.target = ruleSchema.target;
        formRule.targetAttribute = ruleSchema.targetAttribute;

        // Add lookup of rule by behavior name
        this.model.attributes.rules[ruleSchema.name] = formRule;

      }, this);

      // Any time an Element model is changed, update the Form model
      Backbone.on('model-changed', this.updateModel, this);

      // console.log('rendering FormView');
      this.$el.append(
        _.template(
          '<h1>Generated Form</h1>' +
          '<form id="form"></form>' +
          '<hr><input id="submit" class="button-primary" type="submit" value="submit input">' +
          '<h5> Real-time Form Model Results </h5>' +
          '<table id="results" class="u-full-width"><thead><tr><th>Model</th><th>Value(s)</th></tr></thead><tbody></table>'));
      this.$results = $('#results tbody');

      this.model.attributes.elements.each(function (element) {
        this.$('#form').append(new app.ElementView({model: element}).render().$el);
      }, this);

      // Run all of the behaviors to render actual interacted form
      _.each(this.model.attributes.modelRules, function (ruleName, model) {
        this.runFormRules(model);
      }, this);

      this.render();

    },

    runFormRules: function (model) {

      // Find all rules associated with the model property changed
      _.each(this.model.attributes.modelRules[model], function (rule) {
        console.log('running Rule(' + rule.name + ')');
        var fact = new jsrules.RuleContext(rule.name + '-fact');

        // Build the jsrule to execute
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

        // Run the jsRule against all Elements that's bound to that model
        var element = this.model.attributes.domIdElement[rule.target];

        // Run the jsRule using real-time model values to generate a true or false
        var ruleResult = rule.evaluate(fact).value;

        // If the rule is found to be valued differently than the previous value, update the model associated with the rule
        if (element.attributes[rule.targetAttribute] !== ruleResult) {
          console.log('rule(' + rule.name + ') caused dom-id(' + rule.target + ') attribute(' + rule.targetAttribute + ') to change to ' + ruleResult);

          // Update the Element properties causing the Element View to be re-rendered.
          element.changeAttribute(rule.targetAttribute, ruleResult);
        }


      }, this);
    },

    updateModel: function (domIdUpdated, model, value) {

      if (this.model.updateModel(model, value)) {
        this.runFormRules(model, value);

        _.each(this.model.attributes.modelDomIds[model], function (domId) {

          // Don't update the value that was just update to prevent a recursive chain
          // TODO: Clean this recursive chain up by passing the calling domId chain into the event
          if (domIdUpdated !== domId) {
            var element = this.model.attributes.elements.get(domId);
            element.set('value', value);
          }

        }, this);

        // Then trigger any ancillary elements that need to be changed because of one thing or another...
        console.log('model(' + model + ') changed to: ' + value);
        Backbone.trigger(model + '-changed', model, value);

        this.render();
      }
    },

    submitForm: function () {
      console.log(this.model.attributes.model);
    },

    // TODO: Render the generated behavior model attributes to demonstrate how they look generated
    render: function () {

      var template = _.template('<tr><td><%= model %></td><td><%= value %></td></tr>');
      this.$results.empty();
      _.each(this.model.attributes.model, function (value, model) {

        if (_.isObject(value)) {
          this.$results.append(template({model: model, value: _.values(value).toString()}));
        } else if (_.isArray(value)) {
          this.$results.append(template({model: model, value: value.toString()}));
        } else {
          this.$results.append(template({model: model, value: value}));
        }
      }, this);

      return this;
    }


  });
})(jQuery);