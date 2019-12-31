var assert = require('assert');
var fs = require('fs');
var path = require('path');
var test = require('../helpers/test').test;

var JsonApplicationContext = require('./').JsonApplicationContext;

test('CJS module matches the script', function () {
  const scriptText = fs.readFileSync(path.join(__dirname, './script.js'), 'UTF-8').trim();
  const cjsModuleText = fs.readFileSync(path.join(__dirname, './index.js'), 'UTF-8');
  const moduleImport = "var applyAndNew = require('../common').applyAndNew;";
  const moduleExport = 'module.exports = {\n' +
    '  JsonApplicationContext: JsonApplicationContext\n' +
    '};';
  const cjsWithoutImportOrExport = cjsModuleText
    .replace(moduleImport, '')
    .replace(moduleExport, '')
    .trim();
  assert.equal(scriptText, cjsWithoutImportOrExport);
});

test('JsonApplicationContext is a function', function() {
  assert.equal(typeof JsonApplicationContext, 'function');
});

function ConstantService(TEST_CONSTANT) {
  function getConstant() {
    return TEST_CONSTANT;
  }

  return {
    getConstant: getConstant
  };
}

function DataService(constantService) {
  function getValue() {
    return constantService.getConstant();
  }

  return {
    getValue: getValue
  };
}

var testConstant = 'testValue';

test('injects a simple dependency', function() {
  var bean = {
    constantService: {
      proto: ConstantService,
      constructorArgs: [{
        value: testConstant
      }]
    }
  };

  var ctx = new JsonApplicationContext(bean);

  var returnedValue = ctx.getBean('constantService').getConstant();
  assert.equal(returnedValue, testConstant);
});

test('injects nested dependencies', function () {
  function NeedsService(service) {
    function doStuff() {
      return service.getValue();
    }
    
    return {
      doStuff: doStuff
    };
  }

  var bean = {
    constantService: {
      proto: ConstantService,
      constructorArgs: [{
        value: testConstant
      }]
    },
    dataService: {
      proto: DataService,
      constructorArgs: [{
        ref: 'constantService'
      }]
    },
    needsService: {
      proto: NeedsService,
      constructorArgs: [{
        ref: 'dataService'
      }]
    }
  };
var ctx = new JsonApplicationContext(bean);

var returnedValue = ctx.getBean('needsService').doStuff();
assert.equal(returnedValue, testConstant);
});

// TODO: Test property setting