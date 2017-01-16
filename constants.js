var app = app || {};
(function ($) {
  'use strict';


// function HTMLElement(options, protectedVariables) {
//     protectedVariables = protectedVariables || {};
//     protectedVariables.styleClass = options.styleClass;
//     protectedVariables.domId = options && options.domId ? options.domId : _.uniqueId(protectedVariables.type + '-');
//     protectedVariables.template =
//       '<div id="<%= domId %>" ' +
//       '<%= styleClass ? " class=" + styleClass : ""%> ></div>';
//
//     this.getProperties = function () {
//         return _.clone(protectedVariables);
//     };
//
// }
//
// function ButtonElement(options) {
//     var protectedVariables = {type: 'button'};
//     HTMLElement.call(this, options, protectedVariables);
//
//     protectedVariables.value = options && options.value ? options.value: 'Button';
//     protectedVariables.template =
//       '<input id="<%= domId %>" type="button" ' +
//       '<%= styleClass ? " class=" + styleClass : ""%>' +
//       '<%= value ? " value=" + value + "": "" %> >';
// }
//
// ButtonElement.prototype = Object.create(HTMLElement.prototype);
// ButtonElement.constructor = ButtonElement;
//
// function LabelElement(options) {
//     var protectedVariables = {type: 'label'};
//     HTMLElement.call(this, options, protectedVariables);
//     protectedVariables.forAttr = options.forAttr;
//     protectedVariables.label = options.label;
//     protectedVariables.template =
//       '<label id="<%= domId %>" ' +
//       '<%= forAttr ? " for=" + forAttr: ""%>' +
//       '<%= styleClass ? " class=" + styleClass : ""%>> <%= label %> </label>';
// }
//
// LabelElement.prototype = Object.create(HTMLElement.prototype);
// LabelElement.constructor = LabelElement;
//
// function TextElement(options) {
//     var protectedVariables = {type: 'text'};
//     HTMLElement.call(this, options, protectedVariables);
//     protectedVariables.dataModel = options.dataModel;
//     protectedVariables.validationRules = options.validationRules;
//     protectedVariables.value = options.value;
//     protectedVariables.template =
//       '<input id="<%= domId %>" type="text"' +
//       '<%= styleClass ? " class=" + styleClass : ""%>' +
//       '<%= placeholder ? " placeholder=" + placeholder : ""%>' +
//       '<%= value ? " value=" + value : ""%>>';
//
// }
//
// TextElement.prototype = Object.create(HTMLElement.prototype);
// TextElement.constructor = TextElement;

// function HTMLComponent(options) {
//   this.elements = options && options.elements ? options.elements : [];
// }
//
// HTMLComponent.prototype.getProperties = function () {
//   var properties = [];
//   _.each(this.elements, function (element) {
//     properties.push(element.getProperties());
//   }, properties);
//
//   JSON.toString(properties);
//   return properties;
// };
//
// var Components = {};
//
// Components.LabelTextComponent = function (options) {
//     return new HTMLComponent({
//         elements: [
//             new LabelElement(options.label),
//             new TextElement(options.text)
//         ]
//     });
// };
//
// Components.ButtonComponent = function (options) {
//     return new HTMLComponent({
//         elements: [
//             new ButtonElement(options.button)
//         ]
//     });
// };

// TODO add a template that has an Add Party / Remove Party like behavior
  app.Type = {

    Button: {
      type: 'button',
      styleClass: null,
      template: '<input id="<%= id %>" type="button" ' +
      '<%= styleClass ? " class=\'" + styleClass + "\'"  : ""%>' +
      '<%= !_.isUndefined(value) ? " value=\'" + value + "\'" : "" %> >'
    },
    Label: {
      type: 'label',
      styleClass: null,
      forAttr: null,
      label: null,
      template: '<label id="<%= id %>" ' +
      '<%= forAttr ? " for=\'" + forAttr + "\'": ""%>' +
      '<%= styleClass ? " class=\'" + styleClass + "\'"  : ""%>> <%= label %> </label>'
    },

    Text: {
      type: 'text',
      styleClass: null,
      value: null,
      placeholder: null,
      template: '<input id="<%= id %>" type="text"' +
      '<%= styleClass ? " class=\'" + styleClass + "\'"  : ""%>' +
      '<%= placeholder ? " placeholder=\'" + placeholder + "\'"  : ""%>' +
      '<%= !_.isUndefined(value) && !_.isNull(value) ? " value=\'" + value + "\'" : ""%>>'
    },

    Checkbox: {
      type: 'checkbox',
      styleClass: null,
      checked: null,
      option: null,
      template: '<label <%= styleClass ? " class=\'" + styleClass  : ""%>>' +
      '  <input type="checkbox" id="<%= id %>"' +
      '  <%= checked ? " checked" : "" %>' +
      '  <%= !_.isUndefined(optionValue) ? " value=\'" + optionValue + "\'" : ""%>>' +
      '  <span class="label-body"><%= optionLabel %></span>' +
      '</label>'
    },

    Radio: {
      type: 'radio',
      styleClass: null,
      checked: null,
      option: null,
      template: '<label <%= styleClass ? " class=\'" + styleClass + "\'"  : ""%>>' +
      '  <input type="radio" id="<%= id %>"' +
      '  <%= dataModel ? " name=\'" + dataModel + "\'" : "" %>' +
      '  <%= checked ? " checked" : "" %>' +
      '  <%= !_.isUndefined(optionValue) ? " value=\'" + optionValue + "\'" : ""%>>' +
      '  <span class="label-body"><%= optionLabel %></span>' +
      '</label>'
    }


  };


  app.Validation = {

    notEmpty: function (value) {
      if (value === '') {
        return "Field cannot be empty";
      }
    },

    maxLength: function (value, options) {
      if (value && value.length > options.length) {
        return "Field cannot have more than " + options.length + " characters";
      }
    },

    emailAddress: function (value, label) {

      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(value)) {
        return label + " is an invalid email address";
      }
    }
  };

  app.FormSchema = [
    {
      type: app.Type.Text,
      id: 'name',
      label: 'Name',
      placeholder: 'Joe',
      dataModel: 'name',
      validationRules: [
        {method: app.Validation.notEmpty},
        {method: app.Validation.maxLength, options: {length: 10}}
      ]
    }, {
      type: app.Type.Button,
      id: 'button',
      value: 'Click Here'
    }, {
      type: app.Type.Text,
      id: 'name-2',
      label: 'Name',
      placeholder: 'Joe',
      dataModel: 'name',
      validationRules: [
        {method: app.Validation.notEmpty},
        {method: app.Validation.maxLength, options: {length: 10}}
      ]
    }, {
      type: app.Type.Checkbox,
      id: 'my-checkbox',
      label: 'Color',
      dataModel: 'color',
      list: [{label: 'Blue', value: 'blue'}, {label: 'Red', value: 'red'}, {label: 'Green', value: 'green'}],
      default: ['blue', 'red']
    }, {
      type: app.Type.Radio,
      id: 'one-checkbox',
      label: 'Show Dessert Menu?',
      dataModel: 'showDesserts',
      list: [{label: 'Yes!', value: true}, {label: 'No thanks.', value: false}],
      default: true
    }, {
      type: app.Type.Radio,
      id: 'my-radio',
      label: 'Dessert',
      dataModel: 'dessert',
      list: [{label: 'Cookies', value: 'cookies'}, {label: 'Ice Cream', value: 'iceCream'}],
      default: 'cookies'
    }, {
      type: app.Type.Label,
      id: 'iceCreamLogic',
      label: 'Whip cream and sprinkles w/ ice cream is awesome!'
    }, {
      type: app.Type.Label,
      id: 'cookieLogic',
      label: 'Can\'t do it without milk'
    }
  ];

  app.BehaviorSchema = [{
    name: 'showIceCreamLogic',
    target: 'iceCreamLogic',
    type: 'isVisible',
    rules: [{
      type: 'proposition',
      element: 'showDesserts',
      value: true
    }, {
      type: 'variable',
      element: 'dessert',
      operator: 'EQUALS',
      value: 'iceCream'
    }, {
      type: 'operator',
      element: 'AND'
    }]
  }, {
    name: 'showCookieLogic',
    target: 'cookieLogic',
    type: 'isVisible',
    rules: [{
      type: 'proposition',
      element: 'showDesserts',
      value: true
    }, {
      type: 'variable',
      element: 'dessert',
      operator: 'EQUALS',
      value: 'cookies'
    }, {
      type: 'operator',
      element: 'AND'
    }]
  }, {
    name: 'showDessertLogic',
    target: 'my-radio',
    type: 'isVisible',
    rules: [{
      type: 'proposition',
      element: 'showDesserts',
      value: true
    }]
  }];

  app.BehaviorType = {
    Proposition: 'proposition',
    Operator: 'operator',
    Variable: 'variable',
    Rule: 'rule'
  };

  app.Operator = {
    AND: 'AND',
    OR: 'OR',
    XOR: 'XOR',
    NOT: 'NOT',
    EQUAL_TO: 'EQUALTO',
    NOT_EQUAL_TO: 'NOTEQUALTO',
    LESS_THAN: 'LESSTHAN',
    GREATER_THAN: 'GREATERTHAN',
    LESS_THAN_OR_EQUAL_TO: 'LESSTHANOREQUALTO',
    GREATER_THAN_OR_EQUAL_TO: 'GREATERTHANOREQUALTO',
    INCLUDES: 'INCLUDES'
  };

})();
