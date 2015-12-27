Programming Guidelines
======================

Everyone must follow the following coding guidelines outlined in this document.

## General

* If you need a reference to `app` outside of the server/config file, use `req.app`.
* Every model should correspond to a Parse class in the database.
* Every file shall have a comment block at the top describing what it is for.
* Every function should have a comment block at the top describing what it is for.
* Comment frequently.
* Try not to exceed ~80 character width.
	* You can set a ruler to an 80 character width in most popular editors.
* Use tabs for spacing, rather than spaces.
	* There is a lot of [debate](http://www.emacswiki.org/emacs/TabsAreEvil) surrounding
	this, but using tabs helps when developers use different tab widths. There's no
	point in wasting time and energy making sure everyone is on the same page.

	**TL;DR Make sure you are using tabs. Width does not matter.**
* Use unix line endings (Sublime: View > Line Endings > Unix)
* Use Sublime Text 3 with the recommended packages, *OR* if you're feeling frisky,
try out Atom (pro: built-in Git support!)
* Don't use "magic" code. That means: be expressive about what modules a file depends on. **Don't** use or be tempted by automatic loaders. It makes it more difficult to
tell a file's dependencies, and leads to unmaintainable and unportable code.

## Deployment
#### `.env` File
* All custom environment variables must be set in the `.env` file. Do not set these
in `.bashrc`, `.bash_profile`, or any other system configuration file. This helps
with portability and ease of changing settings based on environment.
* `NODE_ENV`
	* This should usually be set to `development` when working on the project locally.
	> You can use `production` to test production settings before deploying to the server.

	* This can be accessed through `process.env.NODE_ENV` or `app.get('env')`. It's
	preferable not to directly access `process.env` variabels, **so when writing
	configuration based on the environment, use `app.get('env')`.**

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
