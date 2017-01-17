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

  app.Type = {
    Button: {
      type: 'button',
      styleClass: null,
      template: '<input id="<%= id %>" type="button" ' +
      '<%= styleClass ? " class=\'" + styleClass + "\'"  : ""%>' +
      '<%= isReadOnly? " readonly" : "" %>' +
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
      '<%= isReadOnly? " readonly" : "" %>' +
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
      '  <%= isReadOnly? " readonly" : "" %>' +
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
      '  <%= model ? " name=\'" + model + "\'" : "" %>' +
      '  <%= isReadOnly? " readonly" : "" %>' +
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

  // TODO: Add button functionality example
  // {
  //   type: app.Type.Button,
  //   id: 'button',
  //   value: 'Click Here to Clear Name Model'
  // },

  app.FormSchema = [{
    type: app.Type.Text,
    id: 'name',
    label: 'Name',
    placeholder: 'Joe',
    model: 'name',
    validationRules: [
      {method: app.Validation.notEmpty},
      {method: app.Validation.maxLength, options: {length: 10}}
    ]
  }, {
    type: app.Type.Text,
    id: 'another-name',
    label: 'Another Name Input Field Bound to Same Model but w/ Different Validations',
    placeholder: 'Jane',
    model: 'name',
    validationRules: [
      {method: app.Validation.notEmpty},
      {method: app.Validation.maxLength, options: {length: 15}}
    ]
  }, {
    type: app.Type.Text,
    id: 'read-only-name',
    label: 'Read-Only Bound to Name Same Model as Above 2 Inputs',
    placeholder: 'Read-Only Placeholder',
    model: 'name',
    isReadOnly: true
  }, {
    type: app.Type.Text,
    id: 'secret-number',
    label: 'Do you know the secret number?',
    model: 'secretNumber'
  }, {
    type: app.Type.Checkbox,
    id: 'my-checkbox',
    label: 'Color',
    model: 'color',
    list: [{label: 'Blue', value: 'blue'}, {label: 'Red', value: 'red'}, {label: 'Green', value: 'green'}],
    default: ['blue', 'red']
  }, {
    type: app.Type.Radio,
    id: 'show-dessert-radio',
    label: 'Show Dessert Menu?',
    model: 'isDessert',
    list: [{label: 'Yes!', value: true}, {label: 'No thanks.', value: false}],
    default: true
  }, {
    type: app.Type.Radio,
    id: 'choose-dessert-radio',
    label: 'Dessert',
    model: 'dessert',
    list: [{label: 'Cookies', value: 'cookies'}, {label: 'Ice Cream', value: 'iceCream'}],
    default: 'cookies'
  }, {
    type: app.Type.Label,
    id: 'ice-cream-label',
    label: 'Whip cream and sprinkles w/ ice cream is awesome!'
  }, {
    type: app.Type.Label,
    id: 'cookie-label',
    label: 'Can\'t do it without milk'
  }];

  app.BehaviorType = {
    Proposition: 'proposition',
    Operator: 'operator',
    Variable: 'variable',
    Rule: 'rule'
  };

  app.Operator = {
    AND: {name: 'AND', value: '&&'},
    OR: {name: 'OR', value: '||'},
    XOR: {name: 'XOR'},
    NOT: {name: 'NOT', value: '!'},
    EQUALTO: {name: 'EQUALTO', value: '=='},
    NOTEQUALTO: {name: 'NOTEQUALTO', value: '!='},
    LESSTHAN: {name: 'LESSTHAN', value: '<'},
    GREATERTHAN: {name: 'GREATERTHAN', value: '>'},
    LESSTHANOREQUALTO: {name: 'LESSTHANOREQUALTO', value: '<='},
    GREATERTHANOREQUALTO: {name: 'GREATERTHANOREQUALTO', value: '>='},
    INCLUDES: {name: 'INCLUDES'}
  };

  app.RulesSchema = [{
    name: 'showIceCreamLabel',
    target: 'ice-cream-label',
    targetAttribute: 'isVisible',
    rules: [{
      type: app.BehaviorType.Proposition,
      model: 'isDessert',
      value: true
    }, {
      type: app.BehaviorType.Variable,
      model: 'dessert',
      operator: app.Operator.EQUALTO,
      value: 'iceCream'
    }, {
      type: app.BehaviorType.Operator,
      operator: app.Operator.AND
    }, {
      type: app.BehaviorType.Variable,
      model: 'name',
      operator: app.Operator.EQUALTO,
      value: 'Philip'
    }, {
      type: app.BehaviorType.Operator,
      operator: app.Operator.OR
    }, {
      type: app.BehaviorType.Variable,
      model: 'secretNumber',
      operator: app.Operator.GREATERTHAN,
      value: 40
    }, {
      type: app.BehaviorType.Operator,
      operator: app.Operator.OR
    }]
  }, {
    name: 'showCookieLabel',
    target: 'cookie-label',
    targetAttribute: 'isVisible',
    rules: [{
      type: app.BehaviorType.Proposition,
      model: 'isDessert',
      value: true
    }, {
      type: app.BehaviorType.Variable,
      model: 'dessert',
      operator: app.Operator.EQUALTO,
      value: 'cookies'
    }, {
      type: app.BehaviorType.Operator,
      operator: app.Operator.AND
    }]
  }, {
    name: 'showDessertOptions',
    target: 'choose-dessert-radio',
    targetAttribute: 'isVisible',
    rules: [{
      type: app.BehaviorType.Proposition,
      model: 'isDessert',
      value: true
    }]
  }];


})();
