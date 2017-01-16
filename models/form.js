var app = app || {};
(function () {
  'use strict';
  app.Form = Backbone.Model.extend({

    defaults: {
      // Static from JSON
      rules: {}, // this is interpreted from the incoming json file
      elements: new app.Elements(), // this is also interpreted from the incoming json file

      // Generated from JSON
      model: {}, // one-to-one
      modelRules: {}, // one-to-many
      modelDomIds: {}, // one-to-many
      domIdElement: {} // one-to-one

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
    // Variable modelDomIds
    //  Find the domIds associated to an Element
    //    { dataModel: [domId1, domId2, ...],
    // Variable: domIdElements
    //  Find the Element associated to a single domId
    //    { domId: app.Element, domId: app.Element, ... }

    // In general, rules can be applied to any form element however adjacent form elements can only
    //  be triggered by binding to a form element. If an element needs to change it's value, it needs to bind to model

    updateModel: function (modelProperty, value) {

      var model = this.attributes.model;

      // Don't assign nothing to nothing
      if(_.isUndefined(modelProperty) && _.isUndefined(value)) {
        return false;
      }

      // If the value is undefined, it means we'll clear out this model property
      // Otherwise we'll create it or update it
      if(_.isUndefined(value)) {
        delete model[modelProperty];
      } else {
        model[modelProperty] = value;
      }

      return true;

    },

    createModel: function (modelProperty, value) {
      var model = this.attributes.model;
      if (model[modelProperty] === undefined) {
        model[modelProperty] = value;
      }
    }

  });
})();