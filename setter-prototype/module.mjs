// Accepts dependencies object
export function createInjector(dependencies) {
  // Dependencies needing dependencies might need to be done out of order

  return function setterPrototypeInjector(instance) {
    var requestedDependencies = instance.getDependencies();
    requestedDependencies.forEach(function (dependencyName) {
      if (!dependencies[dependencyName]) {
        throw new Error('Dependency "' + dependencyName + '" is not a valid dependency.');
      }

      if (!instance['set' + dependencyName]) {
        throw new Error('prototype missing dependency setter "set' + dependencyName + '"');
      }

      // This would allow the method to instantiate the class
      // This would not handle nested dependency injection
      // instance['set' + dependencyName](dependencies[dependencyName]);

      // Ideally the injector should instantiate the class, like this
      // This would not inject constants or factory functions
      var dependency = new dependencies[dependencyName]();
      if (dependency.getDependencies) {
        // This recursively handles nested dependencies
        setterPrototypeInjector(dependency);
      }
      instance['set' + dependencyName](dependency);
    });
  }
}

export default {
  createInjector,
};
