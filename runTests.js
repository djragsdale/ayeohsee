var testHelper = require('./helpers/test');

var runTests = testHelper.runTests;
var cleanTests = testHelper.cleanTests;

// Get tests
// An exercise is simplicity. Why scan all your subdirectories for a pattern to find 4 files?
var tests = [
  './angularjs/index.test.js',
  './beans/index.test.js',
  './common/index.test.js',
  './setter-prototype/index.test.js',
  './symfony/index.test.js',
];

// Run them each in a giant try/catch
var fileResults = [];
for (var i = 0; i < tests.length; i++) {
  try {
    console.log('\nTesting ' + tests[i] + '\n');
    require(tests[i]);
    fileResults.push('success');

    runTests();
  } catch (err) {
    console.error('\nA fatal error occurred when running ' + tests[i], err);
    fileResults.push('failure');
  } finally {
    cleanTests();
  }
}

// Report results
var failureCount = fileResults.filter(function (result) {
  return result === 'failure';
}).length;
if (failureCount > 0) {
  console.error(failureCount + ' fatal error(s) occurred.');
} else {
  console.log('\n\nTESTS COMPLETE.');
}
