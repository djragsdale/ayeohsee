var assert = require('assert');
var fs = require('fs');
var path = require('path');
var test = require('../helpers/test').test;

// NOTE: getContext's baseContext must be properly ordered
var angularJsLib = require('./');
var angularJsInjector = angularJsLib.angularJsInjector;
var getContext = angularJsLib.getContext;

function getMockServices() {
  ConstantService.$inject = ['TEST_CONSTANT'];
  function ConstantService(TEST_CONSTANT) {
    function getConstant() {
      return TEST_CONSTANT;
    }

    return {
      getConstant: getConstant
    }
  }

  DataService.$inject = ['ConstantService'];
  function DataService(Service) {
    var nestedService = new Service();

    function getValue() {
      return nestedService.getConstant();
    }

    return {
      getValue: getValue
    };
  }

  needsService.$inject = ['DataService'];
  function needsService(Service) {
    const service = new Service();
    return service.getValue();
  }

  return {
    ConstantService: ConstantService,
    DataService: DataService,
    needsService: needsService
  }
}

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


test('injects a simple dependency', function() {
  needsParam.$inject = ['TEST_CONSTANT'];
  function needsParam(param0) {
    return param0;
  }

  var testConstant = 'testValue';

  var injectedFn = angularJsInjector({
    TEST_CONSTANT: testConstant
  }, needsParam);
  var returnedValue = injectedFn();
  assert.equal(returnedValue, testConstant);
})

test('injects dependencies of dependencies', function () {
  var mockServices = getMockServices();

  var testConstant = 'testValue';

  var injectedConstantService = angularJsInjector({
    TEST_CONSTANT: testConstant
  }, mockServices.ConstantService);
  var injectedDependency = angularJsInjector({
    ConstantService: injectedConstantService,
  }, mockServices.DataService);
  var injectedFn = angularJsInjector({
    DataService: injectedDependency
  }, mockServices.needsService);
  var returnedValue = injectedFn();
  assert.equal(returnedValue, testConstant);
});

test('getContext is a function', function() {
  assert.equal(typeof getContext, 'function');
});

test('getContext nests dependencies when in proper order', function() {
  var mockServices = getMockServices();

  var testConstant = 'testValue';

  // Desired output context without injection
  var baseContext = {
    TEST_CONSTANT: testConstant,
    ConstantService: mockServices.ConstantService,
    DataService: mockServices.DataService,
    needsService: mockServices.needsService
  };

  var ctx = getContext(baseContext);

  var returnedValue = ctx.needsService();
  assert.equal(returnedValue, testConstant);
});

test('getContext errors when in improper order', function () {
  var mockServices = getMockServices();

  var testConstant = 'testValue';

  // Desired output context without injection
  var baseContext = {
    needsService: mockServices.needsService,
    DataService: mockServices.DataService,
    ConstantService: mockServices.ConstantService,
    TEST_CONSTANT: testConstant
  };

  var failed = false;

  try {
    var ctx = getContext(baseContext);
    ctx.needsService();
  } catch (err) {
    failed = true;
  }

  assert.equal(failed, true);
});
