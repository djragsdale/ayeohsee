var assert = require('assert');
var test = require('../helpers/test');

// NOTE: getContext's baseContext must be properly ordered
var {
  angularJsInjector,
  getContext,
} = require('./');

test('angularJsInjector is a function', function() {
  assert(typeof angularJsInjector === 'function');
});

test('getContext is a function', function () {
  assert(typeof getContext === 'function');
});
