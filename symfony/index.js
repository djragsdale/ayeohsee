var applyAndNew = require('../common').applyAndNew;

function ContainerReference(containerName) {
  this.containerName = containerName;
}

function SymfonyContainer(containerBuilder, className, classProto) {
  this.containerBuilder = containerBuilder;
  this.className = className;
  this.classProto = classProto;
  this.instance = null;
  this.arguments = [];
  this.methodCalls = [];
}
SymfonyContainer.prototype.addArgument = function addArgument(value) {
  var argument;
  if (
    typeof value === 'string' &&
    value[0] === '%' &&
    value[value.length - 1] === '%'
  ) {
    var parameterName = value.substring(1, value.length - 1);
    if (!this.containerBuilder.parameters[parameterName]) {
      throw new Error('Parameter "' + parameterName + '" is not a valid parameter.');
    }
    argument = this.containerBuilder.parameters[parameterName];
    this.arguments.push(argument);
    return this;
  }

  if (value instanceof ContainerReference) {
    argument = this.containerBuilder.get(value.containerName);
    this.arguments.push(argument);
    return this;
  }

  argument = value;
  this.arguments.push(argument);
  return this;
};
SymfonyContainer.prototype.addMethodCall = function addMethodCall(methodName, parameters) {
  this.methodCalls.push({
    methodName: methodName,
    parameters: parameters
  });
};
SymfonyContainer.prototype.build = function build() {
  if (this.instance) {
    return this;
  }

  var appliedClass = applyAndNew(this.classProto, this.arguments);
  this.instance = new appliedClass;
  // in ES6
  // this.instance = new this.classProto(...this.arguments);
  var self = this;

  this.methodCalls.forEach(function (methodCall) {
    self.instance[methodCall.methodName].apply(methodCall.parameters);
  });
};

function ContainerBuilder(classes) {
  this.classes = classes;
  this.containers = {};
  this.parameters = {};
}
ContainerBuilder.prototype.register = function register(instanceName, className) {
  this.containers[instanceName] = new SymfonyContainer(this, className, this.classes[className]);

  return this.containers[instanceName];
};
ContainerBuilder.prototype.setParameter = function setParameter(name, value) {
  this.parameters[name] = value;
  return this;
};
// Bootstrap a container when it is requested
ContainerBuilder.prototype.get = function get(name) {
  this.containers[name].build();
  return this.containers[name].instance;
};
ContainerBuilder.prototype.getClass = function getClass(name) {
  return this.classes[name];
};

module.exports = {
  ContainerReference: ContainerReference,
  SymfonyContainer: SymfonyContainer,
  ContainerBuilder: ContainerBuilder
};
