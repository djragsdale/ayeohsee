var assert = require('assert');
var fs = require('fs');
var path = require('path');
var test = require('../helpers/test').test;

var symfonyLib = require('./');
var ContainerReference = symfonyLib.ContainerReference;
var SymfonyContainer = symfonyLib.SymfonyContainer;
var ContainerBuilder = symfonyLib.ContainerBuilder;

test('CJS module matches the script', function () {
  const scriptText = fs.readFileSync(path.join(__dirname, './script.js'), 'UTF-8').trim();
  const cjsModuleText = fs.readFileSync(path.join(__dirname, './index.js'), 'UTF-8');
  const moduleImport = "var applyAndNew = require('../common').applyAndNew;";
  const moduleExport = 'module.exports = {\n' +
    '  ContainerReference: ContainerReference,\n' +
    '  SymfonyContainer: SymfonyContainer,\n' +
    '  ContainerBuilder: ContainerBuilder\n' +
    '};';
  const cjsWithoutImportOrExport = cjsModuleText
    .replace(moduleImport, '')
    .replace(moduleExport, '')
    .trim();
  assert.equal(scriptText, cjsWithoutImportOrExport);
});

test('ContainerReference is a function', function () {
  assert.equal(typeof ContainerReference, 'function');
});

test('SymfonyContainer is a function', function () {
  assert.equal(typeof SymfonyContainer, 'function');
});

test('ContainerBuilder is a function', function () {
  assert.equal(typeof ContainerBuilder, 'function');
});


function ConstantService(TEST_CONSTANT) {
  this.TEST_CONSTANT = TEST_CONSTANT;
}
ConstantService.prototype.getConstant = function () {
  return this.TEST_CONSTANT;
};

function DataService(constantService) {
  this.constantService = constantService;
}
DataService.prototype.getValue = function () {
  return this.constantService.getConstant();
}

test('injects a simple dependency', function() {
  var testConstant = 'testValue';

  var containerBuilder = new ContainerBuilder({
    ConstantService: ConstantService
  });

  containerBuilder
    .register('constantService', 'ConstantService')
    .addArgument(testConstant);

  // Lazy instantiated containers only get injected when .get() is called
  // This makes everything a Singleton, but could be adjusted to get classes themselves
  // It would be recommended to get the container instances at app bootstrapping only
  var constantService = containerBuilder.get('constantService');

  var returnedValue = constantService.getConstant();
  assert.equal(returnedValue, testConstant);
});

test('injects nested dependencies', function () {
  var testConstant = 'fresh value';

  function NeedsService(service) {
    this.service = service;
  }
  NeedsService.prototype.doStuff = function() {
    return this.service.getValue();
  };

  var containerBuilder = new ContainerBuilder({
    ConstantService: ConstantService,
    DataService: DataService,
    NeedsService: NeedsService
  });

  containerBuilder.setParameter('TEST_CONSTANT', testConstant);

  containerBuilder
    .register('constantService', 'ConstantService')
    .addArgument('%TEST_CONSTANT%');

  containerBuilder
    .register('dataService', 'DataService')
    .addArgument(new ContainerReference('constantService'));

  containerBuilder
    .register('needsService', 'NeedsService')
    .addArgument(new ContainerReference('dataService'));

  var needsService = containerBuilder.get('needsService');

  var returnedValue = needsService.doStuff();
  assert.equal(returnedValue, testConstant);
});

// TODO: Test property setting