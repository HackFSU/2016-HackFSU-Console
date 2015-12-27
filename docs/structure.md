Project Structure & Development Guidelines
==========================================
This document serves to help when developing the HackFSU website, whether it be
the backend API or the front-end application.

## Backend
All of the backend code is contained within this `hackfsu-console` repository.
The current directory structure is as follows:

#### `bin/`
"Executable" code. Currently only contains a single `www` file that is the start
script for the server. Call it through `npm start` rather than directly.

#### `common/`
Common, shared, bundled, *whatever you want to call it*. The code in this folder
is common among components of the backend (AKA it can (and should) be reused in
multiple files).

###### `common/lib/`
Contains library functions written **specific** to this project, but does not fit
into any of the other folders within `common/`. An example is `emailer.js`, a
custom module based on the Mandrill API that creates a simple interface for sending
emails through Mandrill.

###### `common/models/`
These are our data models for everything we store in the database. We use
[Parse](http://parse.com) for our database storage, but every table in Parse needs
a model. These in general should not have any direct dependencies on this project's
code.
> That means don't require anything from `common/lib/` or do any kind of logging
> in these files. Errors related to the database can and should propogate from the
> models, but **should be handled in a middleware or route function.**

Every model **requires** a `static new(attrs)` function. This function is used to create
a **new** object (read: not one queried from the database) with an `attrs` object
specifying what attributes to set. Do validation in this function.

###### `common/store/`
This is a handy folder to contain project-specific constants that should not
or don't necessarily belong in the system environment configuration (the `.env` file).
This includes things like social media links, form inputs (for selects, checkboxes, etc),
common text to display in sever-rendered views (like copyright information), etc.

These values may be used in server-rendered templates because they are loaded into the
`app.locals` object when the server is being initialized.

#### `config/`
Currently unused but **TODO:** split up `server.js` into configuration files.

#### `docs/`
Fairly self explanatory. If you are new to the project, PLEASE read the documents
in this folder! If you are not new but have questions about how to do something,
PLEASE read the documents in this folder!
> Pro-tip: In Sublime or Atom, there are good packages for previewing markdown text
> to make the docs easily readable without having to go to GitHub.

#### `node_modules/`
This folder is actually gitignored (so you won't see it until you run `npm install`),
but one thing is worth mentioning here. Due to the way Node requires/imports work,
importing code within your project can become unwieldy with relative path links.
There are many ways to handle this, but a commonly accepted and super-awesome method
is to create a symbolic link to the common code your project depends on. Can you
guess what that code is in this project? You're right. It's the `common/` folder.
That means that once the symbolic link is set up, we can access our own modules
from a non-relative path, meaning our import statements are easier to read and
easier to write, and don't require any thought as to where your file is currently
located relative to the common code files.

On Unix (Linux, OS X, etc), you can create this symbolic link by running
`ln -s common node_modules/common` in a terminal in the root directory of the project.

#### `public/`
This folder contains all publicly available files (aka, they can be accessed by
anyone by sending an HTTP GET request to the file).

####### `public/assets/`
CSS, fonts, images, etc...

###### `public/app/`
Angular app code. Currently a big **TODO**.

###### `public/es6` & `public/js/`
This needs to be restructured badly, but the gist is this: write ES6, front-end JS
code in the `es6/` folder, and use `gulp transpile-frontend` to compile it into
browser-ready ES5 code accessed through the `js/` folder.

#### `routes/`
This folder contains all the fun stuff! Each route mount point is defined in
`index.js`, and then has it's actual code inside a folder of the same name.
A special case is the `api/` folder, which serves as a sort of namespace for API
routes.

Each route folder contains an `index.js` file that contains the route endpoints.
These are essentially equivalent to the HTTP verb used to call the function, but
additional middleware may be called for things like logging, authentication, etc
before accessing specific routes. Additionally, a `middleware.js` file OR a
`middleware/` folder contains the business logic for all of the route endpoints.
A single file is preferable when there are only a few routes, but when it becomes
more than two or three, separate the middlewares into a folder based on the route.

These routes/middlewares replace "controllers" that we had in the old system, and
takes advantage of the new Express 4.0 `express.Router`.

#### `scripts/`
Not much to say. These are scripts that are relevant to our project, but don't need
or don't currently have web functionality.

#### `test/`
We need to get with testing, but it'll take some time to get it right.

#### `views/`
This is where server-side rendered views live. All views have access to `app.locals`
(in the view, you don't need to use `app.locals`, eg `app.locals.hello` in a
template can be access simply by `hello`).

The subfolders should **generally** mirror the structure of the `routes/` folder,
with the special exception of `layouts/` which contain global layout files.

**Special Note:** We're kind of phasing these out in favor of developing the front-end
using AngularJS. There are a lot of benefits to AngularJS and in specific not rendering
templates on the server-side, including:
* Reduced server load (use client resources instead)
* Separating the API from the views so more than just the website can access API
functions.
* A smoother and more dynamic experience for the user.

#### `/` (The Base Folder)
The base/root folder of this project contains several configuration/initialization
files for some of our dependencies (like Bower, NPM, dotenv, JSHint, etc).
In general, it's best not to mess with these unless you know what you're doing as
you could break the build/install system and render the system unable to boot.

###### A Note on `server.js`
In the old project setup, you called 'server.js' to boot the server. The new setup
uses this file to set up the project, while the server is actually run with `bin/www`.
This is the preferable way to do things the "Express" way.

Regardless of what script does what, ALWAYS use `npm start` to start the server.
Anyone familiar with Node will immediately be able to start the server without requiring
knowledge about the project structure, and on the live server, we won't need to mess
with the system.d file if the start scripts change (it'll call `npm start`, which
we can define to be anything from within the `package.json` file).
