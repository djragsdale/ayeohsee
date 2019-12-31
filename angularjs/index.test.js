var assert = require('assert');
var fs = require('fs');
var test = require('../helpers/test').test;

// NOTE: getContext's baseContext must be properly ordered
var {
  angularJsInjector,
  getContext,
} = require('./');

test('CJS module matches the script', function() {
  assert.fail();
});

test('angularJsInjector is a function', function() {
  assert.equal(typeof angularJsInjector, 'function');
});

test('getContext is a function', function () {
  assert.equal(typeof getContext, 'function');
});
