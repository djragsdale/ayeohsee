module.exports = function test(description, fn) {
  try {
    fn();

    console.log('👍 ' + description);
  } catch (err) {
    console.error('👎 ' + description, err);
  }
};
