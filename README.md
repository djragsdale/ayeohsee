# eyeohsee
zero-dependency dependency injection dependency

## Summary

Don't over-engineer your solution. This package is usable, however it is an example of simple engineering. Dependency Injection and Front End Frameworks aren't usually needed. If injection is barely needed, use closures. Only if those do not meet your needs should you use one of the included techniques. If you are architecting a 100,000 file application, use a framework. The point of this library is to illustrate how much you can accomplish with 0 tooling and no frameworks. As for the tests, I am definitely not arguing to forego a testing framework. Adjust your tooling and dependencies to your needs, and err on the side of simplicity.

## Usage

Use deep imports to only get the code you need.

```javascript
// Old school
var createInjector = require('eyeohsee/setter-prototype').createInjector;

// CJS
const { createInjector } = require('eyeohsee/setter-prototype');

// ESM
import { createInjector } from 'eyeohsee/setter-prototype';
```

If using as a raw script, make sure to include common first. Injectors that handle instantiation rely on it for supporting browsers without spread syntax.

```html
<script src="/assets/vendor/eyeohsee/common/script.js">
<script src="/assets/vendor/eyeohsee/beans/script.js">
```

## Desired Features

- Each container type fully tested
- Each container type has a full browser script for legacy browsers
- Each container type has a full browser module (ESM)
- Each container type has a full CJS module
- No dependencies ever
