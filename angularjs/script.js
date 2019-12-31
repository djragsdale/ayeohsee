function angularJsInjector(dependencies, fn) {
  var fnDependencies = fn.$inject || [];
  var $inject = fnDependencies.slice(0);

  while (fnDependencies.length > 0) {
    var dependencyName = fnDependencies.shift();
    if (!dependencies[dependencyName]) {
      throw new Error('Dependency "' + dependencyName + '" is not a valid dependency.');
    }
    // WARNING: this blocks prototypes from being bound correctly
    fn = fn.bind(null, dependencies[dependencyName]);
  }

  fn.$inject = $inject;
  return fn;
}

function getContext(baseContext) {
  var context = baseContext;

  Object.keys(context).forEach(function (key) {
    context[key] = angularJsInjector(context, context[key]);
  });

  return context;
}
