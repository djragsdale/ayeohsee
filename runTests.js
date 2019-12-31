// Get tests
var tests = [
  './angularjs/index.test.js',
  './beans/index.test.js',
  './setter-prototype/index.test.js',
  './symfony/index.test.js',
];

// Run them each in a giant try/catch
var results = [];
for (var i = 0; i < tests.length; i++) {
  try {
    require(tests[i]);
    results.push('success');
  } catch (err) {
    results.push('failure');
  }
}

// Report results
var failureCount = results.filter(function (result) {
  return results === 'failure';
}).length;
if (failureCount > 0) {
  console.error(failureCount + ' fatal errors occurred.');
} else {
  console.log('\n\nTESTS COMPLETE.');
}
