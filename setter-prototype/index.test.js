var assert = require('assert');
var fs = require('fs');
var path = require('path');
var test = require('../helpers/test').test;

var createInjector = require('./').createInjector;

test('CJS module matches the script', function () {
  const scriptText = fs.readFileSync(path.join(__dirname, './script.js'), 'UTF-8').trim();
  const cjsModuleText = fs.readFileSync(path.join(__dirname, './index.js'), 'UTF-8');
  const moduleExport = 'module.exports = {\n' +
    '  createInjector: createInjector\n' +
    '};';
  const cjsWithoutExport = cjsModuleText.replace(moduleExport, '').trim();
  assert.equal(scriptText, cjsWithoutExport);
});

test('sets properties on components not needed for constructor', function() {
  var testConstant = 'some constant';

  function ConstantService() {
    this.constantValue = testConstant;
  }
  ConstantService.prototype.getConstant = function() {
    return this.constantValue;
  };
  ConstantService.prototype.getDependencies = function() {
    return [];
  };

  function DataService() {}
  DataService.prototype.getDependencies = function() {
    return ['ConstantService'];
  };
  DataService.prototype.setConstantService = function(constantService) {
    this.constantService = constantService;
  };
  DataService.prototype.getValue = function() {
    return this.constantService.getConstant();
  };

  function MyComponent(uniqueValue) {
    this.uniqueValue = uniqueValue;
  }
  MyComponent.prototype.getDependencies = function() {
    return ['DataService'];
  };
  MyComponent.prototype.getValue = function () {
    return this.dataService.getValue(this.uniqueValue); // Not needed, but available if so
  };
  MyComponent.prototype.setDataService = function (dataService) {
    this.dataService = dataService;
  };

  var injectDependencies = createInjector({
    ConstantService: ConstantService,
    DataService: DataService
  });
  var myComponent = new MyComponent('abcd1234');
  injectDependencies(myComponent);
  const returnedValue = myComponent.getValue();

  assert.equal(returnedValue, testConstant);
});
