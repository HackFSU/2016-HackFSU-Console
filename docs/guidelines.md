Programming Guidelines
======================

Everyone must follow the following coding guidelines outlined in this document.

## General

* If you need a reference to `app` outside of the server/config file, use `req.app`.
We no longer import the app object into route or middleware files.
* Every model should correspond to a Parse class in the database
* Every file shall have a comment block at the top describing what it is for.
* Every function should have a comment block at the top describing what it is for.
* Comment frequently.
* Try not to exceed ~80 character width
    - I like to use Sublime's rulers for this:
```json
{
    "rulers": [
            80
    ]
}
```
* Use tabs for spacing, rather than spaces.
* Use unix line endings (Sublime: View > Line Endings > Unix)
* Use Sublime Text 3 with the recommended packages, or if you're feeling frisky,
try out Atom (pro: built-in Git support!)
* Don't use "magic" code. That means: be expressive about what modules a file is
loading AKA don't use automatic loaders. It makes it more difficult to tell what
modules a file depends on when it uses pre-loaded modules. This means each file
should `import` all of the modules it will use.

## JavaScript Language

* Use jshint
* Always declare all variables at the top of the block in which it is hoisted
    - `var`/`function` are hoisted at the function level
    - `let`/`const` are hoisted at the block level
    - Initialize them just before they are needed if they are large objects that have the possibility of not being used (like if the function errs)
* Adhere to new ES6 practices
    - Use `const` whenever possible, especially for referencing external utilities
    - Use `let` instead of `var` unless function scope is desired for some reason
    - Use `import` over CommonJS `require`
    - Use `export` & `export default` over CommonJS's `module.export`
    - Use the new `class` syntax where appropriate
    - Use template strings instead of concatenation where possible
* All imports should be at the top of the file, just under `'use strict';`
* Only make functions as variables for clarity
* Always use single quotes (or back-ticks for template strings)
* Start code blocks on the line where they start, rather than on the next line.
* Block comments should be made with [these](https://github.com/spadgos/sublime-jsdocs)
* Use the ternary (`?` `:`) operators in place of short if statements ([docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator))

*Good*
```javascript
let a = 10;
let foo = function() {

};

let bar = function() {

};

let b = [
    'rawr',
    'rwar'
];

/**
 * This is a block comment
 * hurr durr durr
 */
```

*Bad*
```javascript
var a = 10;
function foo() {

}

let bar = function ()
{

};

let b =
[
    'rawr',
    bar
]

/*
This is a block comment
hurr durr durr
 */
```



## Jade Language

TODO


## lib vs. helper
Write library utilities for things that can be seen as non-project specific (i.e.,
code that you could reuse in another project), and write helper utilities for
things that are project specific.

**Warning!** Helpers are _library_ functions that _help_ the app in some way. For
example, a function that formats a string in a specific way to display in a template.
Do not make the mistake of factoring out model or controller **logic** into a helper!
Refactor your logic as private (read: non-exported) functions in the controller
or model file.

*`lib/`*
* General JavasSript utilities _created by our team_ will go in `lib/`
	- Third-party libraries (that aren't in NPM) should go in a `vendor/` folder.
	- But almost everything is in NPM, so this will likely never come up.
* Do not use `app`, import own resources
* Throw purposeful unhandled errors to break code
	- _**Note**_: We actually don't want that. We should have documentation for each
	library function that defines how and when errors might show up, and examples on
	how to handle them in your code. Libraries shouldn't break your app!

*`helper/`*
* Can use project data or resources
* Okay to be used anywhere in app when appropriate, but usually just in views and
 controllers
* Never throws unhandled errors


## Throwing Errors
Errors can be an amazingly helpful debugging tool. If your code may be used by something else outside of the section you are coding, you need to do some error checking. This is especially important when we work as a team so that someone else knows if they are misusing your code without having to debug it themselves.

* Do **NOT** throw errors on something directly dealing with front-end input unless it has been sanitized. See [Handling front-end input](#Handling-front-end-input)
* Try to avoid error checking on code that is called very frequently, as it may slow things down
    - Be very careful about this
* Write descriptive errors
* Always throw errors with an one of the javascript error classes, such as Error, so that the stack trace is printed.

You can use the `/lib/validate` utility function to streamline this process when functions already exist to preform your check. [lodash](https://lodash.com/docs) becomes very handy for this.

*Example*
```javascript
import validate from 'path/to/lib/validate';
import _ as 'lodash';

export function foo(someString, someNum) {
    validate(someString, _.isString);
    validate(someNum, _.isNumber);

    if(someString.length > 100) {
        throw new Error(
            `InvalidParameter: someString must be less than 100 characters, got "${someString.substring(200)}"
            ${someString.length > 200 ? '(truncated)' : ''}`
        );
    }
    /* rest of function */
}

```


## Handling Front-End Input
In the best case scenario, all front end input should be validated & sanitized. This assures that when you use the data being passed in that you should know what to expect to occur.

> You can **never** be certain of what will be sent, and it may crash the server or worse.

Validation involves checking to make sure what `...`

We use the [express-validator](https://github.com/ctavan/express-validator) to help us do this.

Here is an example showing all steps.

```javascript
TODO
```
