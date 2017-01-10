# form-builder
Configuration Driven Form

## Feature Set
* Basic HTML input attributes implemented
* Input scoped validation
* Input templates work in 100% isolation
* Form scoped behaviors, ie: the behaviors tie together aspects of the form with one another
* Form model is built dynamically from configuration (pop open dev tools and check out the form submit console.log)
* Form model is kept clean (especially when fields appear/disappear)

## Remaining
* ~~Load form with defaults~~
* Split up InputView and Input to separate Mixins
* Add additional HTML elements (textarea, label, fieldset, ...)
* Test Input/InputViews to demonstrate true isolation
* Add 'complicated' Input component
* Profile all of the events and triggers being used

## Example Configuration
```javascript
 {
  label: 'First Name',
  placeholder: 'Joe',
  id: 'first-name',
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
}
```
