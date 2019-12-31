var assert = require('assert');
var fs = require('fs');
var path = require('path');
var test = require('../helpers/test').test;

// NOTE: getContext's baseContext must be properly ordered
var angularJsLib = require('./');
var angularJsInjector = angularJsLib.angularJsInjector;
var getContext = angularJsLib.getContext;

test('CJS module matches the script', function() {
  const scriptText = fs.readFileSync(path.join(__dirname, './script.js'), 'UTF-8').trim();
  const cjsModuleText = fs.readFileSync(path.join(__dirname, './index.js'), 'UTF-8');
  const moduleExport = 'module.exports = {\n' +
    '  angularJsInjector: angularJsInjector,\n' +
    '  getContext: getContext\n' +
    '};';
  const cjsWithoutExport = cjsModuleText.replace(moduleExport, '').trim();
  assert.equal(scriptText, cjsWithoutExport);
});

test('angularJsInjector is a function', function() {
  assert.equal(typeof angularJsInjector, 'function');
});

test('getContext is a function', function () {
  assert.equal(typeof getContext, 'function');
});
