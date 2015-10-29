Programming Guidelines
======================

Everyone must follow the following coding guidelines outlined in this document.

## General

* use the project wide app variable to reference resources
* large sections of the site should use their
* every model should correspond to a Parse class in the database
* Every file shall have a comment block at the top describing what it is for
* comment frequently
* try not to exceed ~80 character width
    - I like to use Sublime's rulers for this:
```json
{
    "rulers": [
            78
    ]
}
```
* use tabs for spacing, rather than spaces. Use tab width of 4.
* use unix line endings (Sublime: View > Line Endings > Unix)
* Sublime Text 3 is the prefered text editior
    - Notepad++ is a piece of crap

## JavaScript Language

* use jshint
* always declare all variables at the top of the block in which it is hoisted
    - var/function are hoisted at the function level
    - let/const are hoisted at the block level
    - initialize them just before they are needed if they are large objects that have the possiblility of not being used (like if it the function errors)
* adhere to new ES6 practices
    - use const whenever possible, especially for referencing external utilites
    - use let instead of var unless function scope is desired for some reason
    - use import over require
    - use export & export default over CommonJS's module.export
    - use the new class syntax where appropriate
    - use template strings instead of concatenation where possible
* all imports should be at the top of the file, just under `'use strict';`
* only make functions as variables for clarity
* always use single quotes
* start code blocks on the line where they start, rather than on the next line.
* block comments should be made with [these](https://github.com/spadgos/sublime-jsdocs)
* use the ternary (?:) operators in place of short if statements ([docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator))

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


## Global app

Files that need the `app` variable should be structured as so, and need to be imported with the customLoader. This allows us to break apart our code, be more organized, and access the same resources across the project.

*Note:* `customLoader.loadAllExports(app, pathFromProjectRoot)` 

```javascript

/* local code not requiring app  */

export default function(app) {
    /* stuff needing app */
}
```

The `customLoader.loadAllExports()` function can be used to load in files or all of a directory's decendants. It will pass the object, app, into the default export if it is a function. Non-function default exports and any other exports will be ignored.

```javascript
import customLoader from 'path/to/lib/customLoader';

...

// with app in scope
customLoader.loadAllExports(app, '/path/to/resourceFile');
customLoader.loadAllExports(app, '/path/to/other/resourcesDir');

```


The base properies of `app` should ONLY be defined in the `/boot/config.js` file. When adding to app in other files, add them to sub objects already within app. Also, modules used project-wide should be imported in the config and added to app, rather than importing it multiple times. If the module is used frequently in the same file, use a `const` reference to simplify things.

```javascript
// /boot/config.js
import someModule from 'someModule';

app.coolFunctions = {};
customLoader(app, '/path/to/code'); //also accepts directories

app.someModule = someModule;

// /path/to/code
export default function(app) {
    /* stuff needing app */
    app.coolFunctions.foo = function() {
        /* code */
    };

    const someModule = app.someModule;
    someModule.someFunction();
    someModule.someOtherFunction();
    let a = someModule.someResourceString + ' boop'
}

```


## lib vs. helper 
Write library utilites for things that can be seen as non-project specifc, and write helper utilites for things that are app wide and project specific.

*lib*
* general javascript utility will go in lib
* does not use `app`, imports own resources
* throws purposeful unhandled errors to break code

*helper*
* uses project data or resources
* okay to be used anywhere in app when appropriate
* may be used in jade
* never throws unhandled errors


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
In the best case senario, all front end input should be validated & sanitized. This assures that when you use the data being passed in that you should know what to expect to occur.

> You can **never** be certain of what will be sent, and it may crash the server or worse.

Validation involves checking to make sure what

We use the [express-validator](https://github.com/ctavan/express-validator) to help us do this.

Here is an example showing all steps.

```javascript
TODO
```

