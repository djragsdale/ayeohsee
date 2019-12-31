var tests = [];

function test(description, fn) {
  tests.push({ description: description, fn: fn });
};

function runTests() {
  for (var i = 0; i < tests.length; i++) {
    const description = tests[i].description;
    const fn = tests[i].fn;
    try {
      fn();

      console.log('👍   ' + description);
    } catch (err) {
      console.error('👎   ' + description, err);
    }
  }
}

function cleanTests() {
  tests.length = 0;
}

module.exports = {
  test,
  runTests,
  cleanTests
};
