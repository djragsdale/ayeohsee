var assert = require('assert');
var fs = require('fs');
var path = require('path');
var test = require('../helpers/test').test;

test('CJS module matches the script', function () {
  const scriptText = fs.readFileSync(path.join(__dirname, './script.js'), 'UTF-8').trim();
  const cjsModuleText = fs.readFileSync(path.join(__dirname, './index.js'), 'UTF-8');
  const moduleExport = 'module.exports = {\n' +
    '  createInjector: createInjector\n' +
    '};';
  const cjsWithoutExport = cjsModuleText.replace(moduleExport, '').trim();
  assert.equal(scriptText, cjsWithoutExport);
});
