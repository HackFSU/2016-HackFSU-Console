HackFSU Console
===============

#### Setup and Deployment Instructions

###### Prerequisites: 
Install Node.JS, NPM, and Heroku Toolbelt (https://toolbelt.heroku.com/)

###### To setup and run project:

1. Clone or fork repository
2. `cd path/to/project`
3. `npm install`
4. `npm start`

###### To deploy to Heroku:

1. Have Heroku toolbelt installed and configured
2. `git remote add heroku git@heroku.com:hackfsu-console.git` 
3. `git push heroku master`

#### Project Structure

* `app/` Contains controllers, helpers, and views (models are handled for use by Parse (Kaiseki))
  * `assets` TODO: Create asset pipeline for CSS and client JS
  * `controllers/` Each controller should be defined as an exported app-wide class
  * `helpers/` General helper functions. These are autoloaded into the app.helpers object.
  * `views/` Jade templates. File names should match the matching function call from the controller and HTTP route
* `boot/` Contains generally boot scripts for when the server is started. 
  * `config.coffee` Configuration for the app. Module dependencies should go here.
  * `index.coffee` Loads the other boot scripts and starts the server
  * `routes.coffee` Specify HTTP routes in this file
* `lib/` Libraries
  * `autoload.coffee` Function to autoload modules in a directory (recursively)
* `public/` Served as static content from the server (directly accessible from the web). Similar to `public_html` in Apache.
    TODO: Move CSS and JS to `app/assets/` and create asset pipeline
* `package.json` Contains general project information and npm dependencies.
* `server.js` Loads the coffeescript module and boot scripts (probably will never need to be changed)
* 
