var Validation = {

  notEmpty: function (value, label) {
    if (value === '') {
      return label + " cannot be empty";
    }
  },

  maxLength: function (value, label, options) {
    if (value && value.length > options.length) {
      return label + " cannot have more than " + options.length + " characters";
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


var PAYLOAD = [{
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
},{
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
