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

var Templates = {};

Templates.Button = {
  type: 'button',
  styleClass: null,
  template:
    '<input id="<%= domId %>" type="button" ' +
    '<%= styleClass ? " class=" + styleClass : ""%>' +
    '<%= value ? " value=" + value + "": "" %> >'
};
Templates.Label = {
  type: 'label',
  styleClass: null,
  template:
    '<label id="<%= domId %>" ' +
    '<%= forAttr ? " for=" + forAttr: ""%>' +
    '<%= styleClass ? " class=" + styleClass : ""%>> <%= label %> </label>'
};

Templates.Text = {
  type: 'text',
  styleClass: null,
  value: null,
  template:
    '<input id="<%= domId %>" type="text"' +
    '<%= styleClass ? " class=" + styleClass : ""%>' +
    '<%= placeholder ? " placeholder=" + placeholder : ""%>' +
    '<%= value ? " value=" + value : ""%>>'
};

Templates.Radio = {
  type: 'checkbox',
  styleClass: null,
  checked: null,
  value: null,
  template:
    '<label <%= styleClass ? " class=" + styleClass : ""%>>' +
    '  <input type="checkbox" id="<%= domId %>"' +
    '  <%= checked ? " checked" : "" %>' +
    '  <%= dataModel ? " name=" + dataModel : ""%>' +
    '  <%= value ? " value=" + value: ""%>>' +
    '  <span class="label-body"><%= label %></span>' +
    '</label>'
};

var Validation = {

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

var Behaviors = {

  toggleVisibility: function (model, datas) {
    var thisModel = model;
    var isVisible = true;
    _.each(datas, function (data) {
      if (data.expected != data.actual) {
        isVisible = false;
      }
    });
    if (model.attributes.isVisible != isVisible) {
      model.set('isVisible', isVisible);
      model.set('value', null);
      Backbone.trigger('model-changed', model.attributes.dataModel, null);
    }
  },

  toggleReadOnly: function (model, datas) {
    var thisModel = model;
    var isReadOnly = false;
    _.each(datas, function (data) {
      if (data.expected != data.actual) {
        isReadOnly = true;
      }
    });
    if (model.attributes.isReadOnly != isReadOnly) {
      model.set('isReadOnly', isReadOnly);
    }
  }
};

var PAYLOAD2 = [
  {
    template: Templates.Label,
    label: 'Name',
    forAttr: 'name'
  }, {
    template: Templates.Text,
    domId: 'name',
    placeholder: 'Joe',
    dataModel: 'name',
    validationRules: [
      {method: Validation.notEmpty},
      {method: Validation.maxLength, options: {length: 10}}
    ]
  }, {
    template: Templates.Button,
    domId: 'button',
    value: 'Click Here'
  }, {
    template: Templates.Label,
    label: 'Color',
    forAttr: 'my-radio'
  }, {
    template: Templates.Radio,
    domId: 'my-radio',
    dataModel: 'color',
    list: ['Blue', 'Red', 'Green']
  }, {
    template: Templates.Label,
    label: 'Single Radio',
    forAttr: 'one-radio'
  }, {
    template: Templates.Radio,
    domId: 'one-radio',
    dataModel: 'checkMe',
    label: 'Check Me Please',
    value: 'OneRadioChecked!'
  }
];


var PAYLOAD = [
  {
    label: 'Party Type',
    type: 'radio',
    domId: 'partyType',
    dataModel: 'partyType',
    value: 'individual',
    inputs: [{
      domId: 'party-type-business',
      value: 'business',
      type: 'radio',
      dataModel: 'partyType',
      label: 'Business'
    }, {
      domId: 'party-type-individual',
      value: 'individual',
      type: 'radio',
      dataModel: 'partyType',
      label: 'Individual'
    }]
  }, {
    type: 'checkbox',
    domId: 'show-middle-name',
    dataModel: 'middleName.isVisible',
    value: true,
    inputs: [{
      domId: 'show-middle-name-is-visible',
      value: true,
      type: 'checkbox',
      dataModel: 'middleName.isVisible',
      label: 'Show Middle Name'
    }],
    behaviors: [{
      method: Behaviors.toggleVisibility,
      conditions: [{
        dataModel: 'partyType',
        value: 'individual'
      }]
    }]
  }, {
    label: 'Business Name',
    placeholder: 'Joe\'s Coffee',
    domId: 'business-name',
    dataModel: 'businessName',
    validationRules: [
      {method: Validation.notEmpty},
      {method: Validation.maxLength, options: {length: 10}}
    ],
    behaviors: [{
      method: Behaviors.toggleVisibility,
      conditions: [{
        dataModel: 'partyType',
        value: 'business'
      }]
    }]
  }, {
    label: 'First Name',
    placeholder: 'Joe',
    domId: 'first-name',
    dataModel: 'firstName',
    validationRules: [
      {method: Validation.notEmpty},
      {method: Validation.maxLength, options: {length: 10}}
    ],
    behaviors: [{
      method: Behaviors.toggleVisibility,
      conditions: [{
        dataModel: 'partyType',
        value: 'individual'
      }]
    }]
  }, {
    label: 'Middle Name',
    placeholder: 'Bob',
    domId: 'middle-name',
    dataModel: 'middleName',
    validationRules: [
      {method: Validation.maxLength, options: {length: 5}}
    ],
    behaviors: [{
      method: Behaviors.toggleVisibility,
      conditions: [{
        dataModel: 'partyType',
        value: 'individual'
      }, {
        dataModel: 'middleName.isVisible',
        isVisible: true
      }]
    }]
  }, {
    label: 'Last Name',
    placeholder: 'Smith',
    domId: 'last-name',
    dataModel: 'lastName',
    validationRules: [
      {method: Validation.notEmpty},
      {method: Validation.maxLength, options: {length: 20}}
    ],
    behaviors: [{
      method: Behaviors.toggleVisibility,
      conditions: [{
        dataModel: 'partyType',
        value: 'individual'
      }]
    }]
  }, {
    label: 'Email',
    placeholder: 'joe.smith@domain.com',
    domId: 'email',
    type: 'email',
    dataModel: 'email',
    validationRules: [
      {method: Validation.emailAddress}
    ]
  }, {
    type: 'button',
    domId: 'make-email-read-only',
    dataModel: 'email.isReadOnly',
    value: true,
    label: 'Make E-Mail Read-Only'
  }, {
    type: 'button',
    domId: 'make-email-editable',
    dataModel: 'email.isReadOnly',
    value: false,
    label: 'Make E-Mail Editable'
  }, {
    type: 'button',
    domId: 'make-email-toggle-editability',
    dataModel: 'email.isReadOnly',
    value: 'toggle',
    label: 'Toggle E-Mail Read-Only'
  }];
