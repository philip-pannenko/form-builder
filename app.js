var app = app || {};
$(function () {
  'use strict';
  app.formView = new app.FormView({model: new app.Form(), collection: new app.Inputs()});

});
