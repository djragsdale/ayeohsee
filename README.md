# ayeohsee
zero-dependency dependency injection dependency

## Summary

Don't over-engineer your solution. This package is usable, however it is an example of simple engineering. Dependency Injection and Front End Frameworks aren't usually needed. If injection is barely needed, use closures. Only if those do not meet your needs should you use one of the included techniques. If you are architecting a 100,000 file application, use a framework. The point of this library is to illustrate how much you can accomplish with 0 tooling and no frameworks. As for the tests, I am definitely not arguing to forego a testing framework. Adjust your tooling and dependencies to your needs, and err on the side of simplicity.

## Usage

Use deep imports to only get the code you need.

```javascript
// Old school
var createInjector = require('ayeohsee/setter-prototype').createInjector;

// CJS
const { createInjector } = require('ayeohsee/setter-prototype');

// ESM
import { createInjector } from 'ayeohsee/setter-prototype';
```

If using as a raw script, make sure to include common first. Injectors that handle instantiation rely on it for supporting browsers without spread syntax.

```html
<script src="/assets/vendor/ayeohsee/common/script.js">
<script src="/assets/vendor/ayeohsee/beans/script.js">
```

## Container Types

### Closure

Pros:

- No libraries needed (not even this one)

Cons:

- Completely manual

### Setter-prototype

Pros:

- Highly flexible and don't disrupt class construction

Cons:

- Don't handle constants or factory functions
- Require manual creation of application context

### AngularJs

Pros:

- Handles constants, factory functions, and services

Cons:

- Requires context to be ordered so dependencies have already been injected with their own dependencies
- Doesn't handle prototypes or classes

### Beans

Pros:

- Handles constructor arguments of other dependencies as well as values
- Standardizes dependencies in a single location
- Dependencies don't have to be listed in a special order

Cons:

- Requires all proprties of the application context to have prototypes
  - However, could be amended to support constants and factory functions
- Does not make the bean configuration fully serializable (requires prototype passed in)
  - A Node or Browser-module specific method could handle this, but no platform agnostic method
  - ES Module dynamic imports is the most-supported method, but lacks legacy support for older versions of Node and browsers
  - I plan to add support for serializable bean configuration to the `ayeohsee/beans/module.mjs` entry point

### Symfony

Pros:

- Handles constructor arguments, method calls, and common parameters across containers
- Lazily builds the containers only when retrieved

Cons:

- Just plain complicated
- Requires manual, programmatic IOC container registration
- Requires containers to be registered in proper order
- Requires all proprties of the application context to have prototypes

## Desired Features

- Each container type fully tested
- Each container type has a full browser script for legacy browsers
- Each container type has a full browser module (ESM)
- Each container type has a full CJS module
- No dependencies ever
