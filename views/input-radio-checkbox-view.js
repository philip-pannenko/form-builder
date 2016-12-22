var app = app || {};
(function ($) {
    'use strict';

    app.InputRadioCheckboxView = {

        radioCheckboxTemplate: _.template(
            '<label for="<%= domId %>">' +
            '  <input type="<%= type %>" name="<%= dataModel %>" id="<%= domId %>" value="<%= value %>" <%= isReadOnly? "readonly" : "" %>/>' +
            '  <span class="label-body"><%= label %></span>' +
            '</label>'
        ),

        render: function() {
            this.$el.html(this.groupTemplate(this.model));
            var checkedDom;
            var $group = this.$('#' + this.model.attributes.domId);
            _.each(this.model.attributes.inputs, function (input) {
                if (this.model.attributes.value === input.value) {
                    checkedDom = input.domId;
                }
                if (!input.isReadOnly) {
                    input.isReadOnly = false;
                }
                $group.append(this.radioCheckboxTemplate(input));
            }, this);

            if (checkedDom) {
                this.$('#' + checkedDom).prop("checked", this.model.attributes.value);
            }

            // MyView.prototype.sayFoo.call(this);
            return app.Input.prototype.render.call(this);

        }

    };

})(jQuery);