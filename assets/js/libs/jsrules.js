(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsrules = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
  var DateVariable, Proposition;

  Proposition = require('./proposition');

  DateVariable = function(name, value) {
    this.name = name;
    this.value = value;
    this.type = 'jsrules.DateVariable';

    this.equalTo = function(variable) {
      var name = '(' + this.name + ' === ' + variable.name + ')';
      return new Proposition(name, this.value.getTime() === variable.value.getTime());
    };

    this.greaterThan = function(variable) {
      var name = '(' + this.name + ' > ' + variable.name + ')';
      return new Proposition(name, this.value.getTime() > variable.value.getTime());
    };

    this.greaterThanOrEqualTo = function(variable) {
      var name = '(' + this.name + ' >= ' + variable.name + ')';
      return new Proposition(name, this.value.getTime() >= variable.value.getTime());
    };

    this.lessThan = function(variable) {
      var name = '(' + this.name + ' < ' + variable.name + ')';
      return new Proposition(name, this.value.getTime() < variable.value.getTime());
    };

    this.lessThanOrEqualTo = function(variable) {
      var name = '(' + this.name + ' <= ' + variable.name + ')';
      return new Proposition(name, this.value.getTime() <= variable.value.getTime());
    };

    this.notEqualTo = function(variable) {
      var name = '(' + this.name + ' !== ' + variable.name + ')';
      return new Proposition(name, this.value.getTime() !== variable.value.getTime());
    };

    this.toString = function() {
      return 'DateVariable name = ' + this.name + ', value = ' + this.value;
    };
  };

  module.exports = DateVariable;

},{"./proposition":6}],2:[function(require,module,exports){
  'use strict';

  var jsrules = {
    Proposition            : require('./proposition'),
    Operator               : require('./operator'),
    InvalidOperatorError   : require('./invalidoperatorerror'),
    InvalidRuleElementError: require('./invalidruleelementerror'),
    Variable               : require('./variable'),
    Rule                   : require('./rule'),
    RuleContext            : require('./rulecontext'),
    DateVariable           : require('./datevariable'),
    ruleLoader             : require('./ruleloader')
  };

  module.exports = jsrules;

},{"./datevariable":1,"./invalidoperatorerror":3,"./invalidruleelementerror":4,"./operator":5,"./proposition":6,"./rule":7,"./rulecontext":8,"./ruleloader":9,"./variable":11}],3:[function(require,module,exports){
  'use strict';
  var InvalidOperatorError;

  InvalidOperatorError = function(message) {
    this.name = 'InvalidOperatorError';
    this.message = message || 'InvalidOperatorError';
  };

  InvalidOperatorError.prototype = new TypeError();

  module.exports = InvalidOperatorError;

},{}],4:[function(require,module,exports){
  'use strict';
  var InvalidRuleElementError;

  InvalidRuleElementError = function(message) {
    this.name = 'InvalidRuleElementError';
    this.message = message;
  };

  InvalidRuleElementError.prototype = new TypeError();

  module.exports = InvalidRuleElementError;

},{}],5:[function(require,module,exports){
  'use strict';

  var Operator, validOperatorVals, InvalidOperatorError;

  InvalidOperatorError = require('./invalidoperatorerror');

  validOperatorVals = [];

  function isValidOperator(operator) {
    if (validOperatorVals.indexOf(operator) !== -1) {
      return true;
    }
    return false;
  }

  Operator = function(operator) {
    if (!isValidOperator(operator)) {
      throw new InvalidOperatorError('InvalidOperatorError: "' + operator +'" is not a recoginzed Boolean operator. Please use ' + validOperatorVals.join(', ') + '.');
    }
    this.name = operator;
    this.type = 'jsrules.Operator';
    this.toString = function() {
      return this.name;
    };
  };

  Operator.AND = 'AND';
  Operator.OR = 'OR';
  Operator.XOR = 'XOR';
  Operator.NOT = 'NOT';
  Operator.EQUAL_TO = 'EQUALTO';
  Operator.NOT_EQUAL_TO = 'NOTEQUALTO';
  Operator.LESS_THAN = 'LESSTHAN';
  Operator.GREATER_THAN = 'GREATERTHAN';
  Operator.LESS_THAN_OR_EQUAL_TO = 'LESSTHANOREQUALTO';
  Operator.GREATER_THAN_OR_EQUAL_TO = 'GREATERTHANOREQUALTO';
  Operator.INCLUDES = 'INCLUDES';

  validOperatorVals = (function() {
    var i, keys, vals;
    vals = [];
    keys  = Object.keys(Operator);
    for (i = 0; i < keys.length; i++) {
      vals.push(Operator[keys[i]]);
    }
    return vals;
  }());

  module.exports = Operator;

},{"./invalidoperatorerror":3}],6:[function(require,module,exports){
  'use strict';
  var Proposition;

  Proposition = function(name, value) {
    this.name = name;
    this.value = value;
    this.type = 'jsrules.Proposition';
    this.and = function(proposition) {
      var result = {
        name: '(' + this.name + ' AND ' + proposition.name + ')',
        value: this.value && proposition.value
      };
      return new Proposition(result.name, result.value);
    };

    this.not = function() {
      var result = {
        name: '(NOT ' + this.name + ')',
        value: !this.value
      };
      return new Proposition(result.name, result.value);
    };

    this.or = function(proposition) {
      var result = {
        name: '(' + this.name + ' OR ' + proposition.name + ')',
        value: this.value || proposition.value
      };
      return new Proposition(result.name, result.value);
    };

    this.xor = function(proposition) {
      var result = {
        name: '(' + this.name + ' XOR ' + proposition.name + ')',
        /* jshint ignore:start */
        value: !this.value !== !proposition.value
        /* jshint ignore:end */
      };
      return new Proposition(result.name, result.value);
    };

    this.toString = function() {
      return 'Proposition statement = ' + this.name + ', value = ' + this.value;
    };
  };

  module.exports = Proposition;

},{}],7:[function(require,module,exports){
  'use strict';
  var Rule, stack, DateVariable, Operator, Proposition, Variable, util;

  DateVariable = require('./datevariable');
  Operator = require('./operator');
  Proposition = require('./proposition');
  Variable = require('./variable');
  util = require('./util');

  function processAnd() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.and(lhs));
  }

  function processEqualTo() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.equalTo(lhs));
  }

  function processGreaterThan() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.greaterThan(lhs));
  }

  function processGreaterThanOrEqualTo() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.greaterThanOrEqualTo(lhs));
  }

  function processLessThan() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.lessThan(lhs));
  }

  function processLessThanOrEqualTo() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.lessThanOrEqualTo(lhs));
  }

  function processNot() {
    var rhs = stack.pop();
    stack.push(rhs.not());
  }

  function processNotEqualTo() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.notEqualTo(lhs));
  }

  function processOr() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.or(lhs));
  }

  function processXor() {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.xor(lhs));
  }

  function processProposition(proposition) {
    stack.push(proposition);
  }

  function processVariable(variable) {
    stack.push(variable);
  }

  function processIncludes(variable) {
    var lhs, rhs;
    lhs = stack.pop();
    rhs = stack.pop();
    stack.push(rhs.includes(lhs));
  }

  function processOperator(operator) {
    switch (operator.name) {
      case Operator.AND:
        processAnd();
        break;
      case Operator.XOR:
        processXor();
        break;
      case Operator.OR:
        processOr();
        break;
      case Operator.NOT:
        processNot();
        break;
      case Operator.EQUAL_TO:
        processEqualTo();
        break;
      case Operator.LESS_THAN:
        processLessThan();
        break;
      case Operator.GREATER_THAN:
        processGreaterThan();
        break;
      case Operator.LESS_THAN_OR_EQUAL_TO:
        processLessThanOrEqualTo();
        break;
      case Operator.GREATER_THAN_OR_EQUAL_TO:
        processGreaterThanOrEqualTo();
        break;
      case Operator.NOT_EQUAL_TO:
        processNotEqualTo();
        break;
      case Operator.INCLUDES:
        processIncludes();
        break;
    }
  }

  /* jshint unused:false */
  function process(elements) {
    var i, element;
    stack = [];
    for (i = 0; i < elements.length; i++) {
      element = elements[i];
      if (util.ruleElement.isOperator(element)) {
        processOperator(element);
      }
      else if (util.ruleElement.isProposition(element)) {
        processProposition(element);
      }
      else if (util.ruleElement.isVariable(element)) {
        processVariable(element);
      }
      else {
        throw new TypeError('InvalidRuleElementError');
      }
    }
    return stack.shift();
  }

  Rule = function(name) {
    this.name = name;
    this.elements = [];
    this.addOperator = function(operator) {
      if (util.ruleElement.isRuleElement(operator)) {
        this.elements.push(operator);
      }
      else {
        this.elements.push(new Operator(operator));
      }
      return this;
    };
    this.addProposition = function(element, value) {
      if (util.ruleElement.isProposition(element)) {
        this.elements.push(element);
      }
      else {
        this.elements.push(new Proposition(element, value));
      }
      return this;
    };
    this.addVariable = function(element, value, type) {
      var variable;
      if (util.ruleElement.isVariable(element)) {
        variable = element;
      }
      else {
        type = type || util.ruleElement.TYPE.variable;
        variable = util.ruleElement.factory(element, value, type);
      }
      this.elements.push(variable);
      return this;
    };
    this.evaluate = function(ruleContext) {
      var i, element, elem, elements;
      elements = [];
      for (i = 0; i < this.elements.length; i++) {
        element = this.elements[i];
        if (util.ruleElement.isProposition(element) || util.ruleElement.isVariable(element)) {
          elem = ruleContext.findElement(element);
          if (null === element.value) {
            element.value = elem.value;
          }
          else if (null === elem.value) {
            elem.value = element.value;
          }
          element.value = elem.value;
        }
      }
      return process(this.elements);
    };
  };

  module.exports = Rule;

},{"./datevariable":1,"./operator":5,"./proposition":6,"./util":10,"./variable":11}],8:[function(require,module,exports){
  'use strict';
  var RuleContext, InvalidRuleElementError, DateVariable, Proposition, Variable,
    util;

  DateVariable = require('./datevariable');
  InvalidRuleElementError = require('./invalidruleelementerror');
  Proposition = require('./proposition');
  Variable = require('./variable');
  util = require('./util');

  RuleContext = function(name) {
    this.name = name;
    this.elements = {};
    this.addProposition = function(element, value) {
      if (util.ruleElement.isProposition(element)) {
        this.elements[element.name] = element;
      }
      else {
        this.elements[element] = new Proposition(element, value);
      }
      return this;
    };
    this.addVariable = function(element, value, type) {
      var variable;
      type = type || util.ruleElement.TYPE.variable;
      if (util.ruleElement.isVariable(element)) {
        variable = element;
      }
      else {
        variable = util.ruleElement.factory(element, value, type);
      }
      this.elements[variable.name] = variable;
      return this;
    };
    this.findElement = function(element) {
      return this.elements[element.name] || null;
    };
  };

  module.exports = RuleContext;

},{"./datevariable":1,"./invalidruleelementerror":4,"./proposition":6,"./util":10,"./variable":11}],9:[function(require,module,exports){
  'use strict';
  var ruleLoader, ruleElementFactory, Operator, Proposition, Variable,
    DateVariable, Rule, RuleContext;

  Operator = require('./operator');
  Proposition = require('./proposition');
  Variable = require('./variable');
  DateVariable = require('./datevariable');
  Rule = require('./rule');
  RuleContext = require('./rulecontext');

  ruleElementFactory = {
    create: function(obj) {
      switch (obj.type) {
        case 'jsrules.Operator':
          return new Operator(obj.name, obj.value);
        case 'jsrules.Proposition':
          return new Proposition(obj.name, obj.value);
        case 'jsrules.Variable':
          return new Variable(obj.name, obj.value);
        case 'jsrules.DateVariable':
          return new DateVariable(obj.name, obj.value);
        default:
          return undefined;
      }
    }
  };

  ruleLoader = {
    loadRule: function (json) {
      var obj, ruleElement, rule, i;
      obj = JSON.parse(json);
      rule = new Rule(obj.name);
      for (i = 0; i < obj.elements.length; i++) {
        ruleElement = obj.elements[i];
        rule.elements.push(ruleElementFactory.create(ruleElement));
      }
      return rule;
    },
    loadRuleContext: function (json) {
      var obj, ruleElement, ruleContext, i;
      obj = JSON.parse(json);
      ruleContext = new RuleContext(obj.name);
      for (i = 0; i < obj.elements.length; i++) {
        ruleElement = obj.elements[i];
        ruleContext.elements[ruleElement.name] = ruleElementFactory.create(ruleElement);
      }
      return ruleContext;
    },
    loadFact: function (json) {
      return this.loadRuleContext(json);
    }
  };

  module.exports = ruleLoader;

},{"./datevariable":1,"./operator":5,"./proposition":6,"./rule":7,"./rulecontext":8,"./variable":11}],10:[function(require,module,exports){
  'use strict';
  var util, InvalidRuleElementError, Proposition, Variable, DateVariable,
    Operator, TYPE;

  InvalidRuleElementError = require('./invalidruleelementerror');
  DateVariable = require('./datevariable');
  Operator = require('./operator');
  Proposition = require('./proposition');
  Variable = require('./variable');

  TYPE = {
    dateVariable: 'jsrules.DateVariable',
    operator    : 'jsrules.Operator',
    proposition : 'jsrules.Proposition',
    variable    : 'jsrules.Variable'
  };

  function createRuleElement(name, value, ruleElementType) {
    var type = ruleElementType.replace('jsrules.', '');
    if ('Proposition' === type) {
      return new Proposition(name, value);
    }
    else if ('Variable' === type) {
      return new Variable(name, value);
    }
    else if ('DateVariable' === type) {
      return new DateVariable(name, value);
    }
    else if ('Operator' === type) {
      return new Operator(name);
    }
    else {
      throw new InvalidRuleElementError('"jsrules.' + type + '" is undefined.');
    }
  }

  function isOperator(ruleElement) {
    return TYPE.operator === ruleElement.type;
  }

  function isProposition(ruleElement) {
    return TYPE.proposition === ruleElement.type;
  }

  function isRuleElement(arg) {
    return typeof arg === 'object' && arg.type.indexOf('jsrules.') === 0;
  }

  function isVariable(ruleElement) {
    var pattern = /jsrules\.[a-z$]*Variable/ig;
    return pattern.test(ruleElement.type);
  }

  util = {
    ruleElement: {
      factory      : createRuleElement,
      isOperator   : isOperator,
      isProposition: isProposition,
      isRuleElement: isRuleElement,
      isVariable   : isVariable,
      TYPE         : TYPE
    }
  };

  module.exports = util;

},{"./datevariable":1,"./invalidruleelementerror":4,"./operator":5,"./proposition":6,"./variable":11}],11:[function(require,module,exports){
  'use strict';
  var Proposition, Variable, DateVariable, InvalidRuleElementError;

  Proposition = require('./proposition');
  DateVariable = require('./datevariable');
  InvalidRuleElementError = require('./invalidruleelementerror');

  Variable = function(name, value) {
    this.name = name;
    this.value = value;
    this.type = 'jsrules.Variable';

    this.equalTo = function(variable) {
      var name = '(' + this.name + ' === ' + variable.name + ')';
      return new Proposition(name, this.value === variable.value);
    };

    this.eq = this.equalTo;

    this.greaterThan = function(variable) {
      var name = '(' + this.name + ' > ' + variable.name + ')';
      return new Proposition(name, this.value > variable.value);
    };

    this.gt = this.greaterThan;

    this.greaterThanOrEqualTo = function(variable) {
      var name = '(' + this.name + ' >= ' + variable.name + ')';
      return new Proposition(name, this.value >= variable.value);
    };

    this.gte = this.greaterThanOrEqualTo;

    this.lessThan = function(variable) {
      var name = '(' + this.name + ' < ' + variable.name + ')';
      return new Proposition(name, this.value < variable.value);
    };

    this.lt = this.lessThan;

    this.lessThanOrEqualTo = function(variable) {
      var name = '(' + this.name + ' <= ' + variable.name + ')';
      return new Proposition(name, this.value <= variable.value);
    };

    this.lte = this.lessThanOrEqualTo;

    this.notEqualTo = function(variable) {
      var name = '(' + this.name + ' !== ' + variable.name + ')';
      return new Proposition(name, this.value !== variable.value);
    };

    this.neq = this.notEqualTo;

    this.includes = function(variable) {
      var name = '(' + this.name + ' INCLUDES ' + variable.name + ')';
      return new Proposition(name, this.value.indexOf(variable.value) !== -1);
    };

    this.toString = function() {
      return 'Variable name = ' + this.name + ', value = ' + this.value;
    };
  };

  module.exports = Variable;

},{"./datevariable":1,"./invalidruleelementerror":4,"./proposition":6}]},{},[2])(2)
});