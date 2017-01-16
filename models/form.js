var app = app || {};
(function () {
  'use strict';
  app.Form = Backbone.Model.extend({

    defaults: {
      rules: {}, // this is interpreted from the incoming json file
      elements: new app.Elements(), // this is also interpreted from the incoming json file

      model: {}, // this identifies the models on the form
      modelRules: {}, // this is a reverse lookup and is generated. pointer to rule
      domIdElements: {} // this is a reverse lookup and is generated. pointer to rule

    },

    // Static Data Structures
    // List of rules: <<Checkout the rules configuration file to see this structure>>
    // List of elements: << Checkout the elemetns configuration file to see this structure>>

    // Generated Data Structures
    // Variable: model
    //  Find the value associated with the models on this form
    //    { dataModel1: value, dataModel2: value, ... }
    // Variable: modelRules
    //  Find the rules associated with a model
    //    { dataModel1: [app.Rule, app.Rule, app.Rule], ... }
    // Variable: domIdElements
    //  Find the domIds associated with a model
    //    { dataModel1: [app.Element, app.Element, app.Element], ... }

    // In general, rules can be applied to any form element however adjacent form elements can only
    //  be triggered by binding to a form element. If an element needs to change it's value, it needs to bind to model

    updateModel: function (modelProperty, value) {
      var model = this.attributes.model;


      if (model[modelProperty] !== undefined && model[modelProperty] !== value) {
        model[modelProperty] = value;
        return true;
      } else {
        return false;
      }

    },

    createModel: function (modelProperty, value) {
      var model = this.attributes.model;
      if (model[modelProperty] === undefined) {
        model[modelProperty] = value;
      }
    }

  });
})();