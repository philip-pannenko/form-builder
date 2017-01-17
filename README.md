# form-builder
Configuration Driven Form w/ Validation, Behaviors & Sanitized Form Submission

## Feature Set
* Basic HTML input attributes implemented
* Input scoped validation
* Input templates work in 100% isolation
* Form scoped behaviors, ie: the behaviors tie together aspects of the form with one another
* Form model is built dynamically from configuration
* Form model is kept clean (especially when fields appear/disappear)
* Behavior trees are built using the provided rules
* Behaviors cascade value changes to bound Form Elements

## Remaining
* ~~Load form with defaults~~
* Split up InputView and Input to separate Mixins
* Add additional HTML elements (textarea, label, fieldset, ...)
* Test Input/InputViews to demonstrate true isolation
* Add 'complicated' Input component
* Profile all of the events and triggers being used
* Add headless form verification test
* Add configurable dropdown to Behavior tree to change the configuration JSON in real-time

## Example Configuration
```javascript

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
}]

app.RulesSchema = [{
    name: 'showIceCreamLabel',
    target: 'ice-cream-label',
    targetAttribute: 'isVisible',
    rules: [{
      type: app.BehaviorType.Proposition,
      model: 'isDessert',
      value: true
    }]
}]
```
