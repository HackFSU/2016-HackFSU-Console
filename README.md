HackFSU Web Console
===================

#### Description
This will be the final landing page + background management website for HackFSU, to be hosted at hackfsu.com. Admin users have access to admin tools, while other users will just be able to login and register + do app stuff. 

#### Setup and Deployment Instructions

###### Prerequisites: 

1.  node.js & npm ([link](https://nodejs.org/en/download/))
2. Install *command line* git
3. `.env` is needed to connect to Parse (gitignored for security, ask Jared)


#### Setup Documentation
Below are commands to run to setup the development environment on a given OS. If you are on Windows, use PowerShell and remove the `sudo` prefix from these 
commands.

```bash
# [Linux only] Update your node
$ sudo npm install -g n
$ sudo n latest

# Install global node modules
$ sudo npm install -g nodemon bower forever coffee-script

# [Optional] Create a git folder
$ cd ~
$ mkdir git
$ cd ~/git

# Setup repo (from your git folder)
$ git clone https://YOUR_GITHUB_USERNAME@github.com/HackFSU/hackfsu-console.git
$ cd hackfsu-console
$ npm install
$ bower install

# Start the server (while in repo directory)
$ nodemon server.js

```

I also recommend adding password caching to git if you haven't already. See [this](http://stackoverflow.com/questions/5343068/is-there-a-way-to-skip-password-typing-when-using-https-github).
```bash
$ git config --global credential.helper "cache --timeout=7200"
```

Now open a browser and go to `http://localhost:5003` to see your local server, changing the port number if necessary. 

##### USE SUBLIME TEXT 3 WITH THESE PACKAGES:
- Package manager (of course)
- BetterCoffeeScript
- Jade
- Jade Build

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
* `.env` (not in git for security) Contains environment variables, such as keys/usernames/passwords to connect to outside sources 


#### Pages
##### Public Access
* `/` `/index` `/home` -- homepage
* `/sponsor` -- sponsorship information and sponsor of the month
* `/apply` -- apply for HackFSU
* `/signin` -- signin to account
* `/mentor` `/mentors` -- mentor application/information page
* `/help` -- mentor help request form for hackers
* `/spreadtheword` -- shareables + contest page
* `/sponsor` -- Sponsor of the month page
* `/signup` -- create account. Access key required for success
* ~~`/updates` -- view updates~~
* `/schedule` -- schedule information
* `/confirm/:cId` -- app acceptance confirmation, requiring a confirmationId
* `/stats` -- Application statistics page
* ~~`/contact` -- HacFSU contact info~~
* ~~`/signin/passwordreset` -- reset password via email~~
* ~~`/error` -- misc error thrown~~
* 404 -- page not found

##### User Access
* `/user/signout` -- signout
* `/user/profile` -- view user profile

##### Admin Access
* `/admin` -- admin home
* `/admin/updates` -- manage updates
* `/admin/applications` -- manage apps
* `/admin/users` -- manage users
* `/admin/emails` -- manage emails
* `/` 
* `/` 

#### Use Cases
##### Public
* Apply (wave 1) -- account not created
* Signup (wave 2) -- creates an account to signin with
* View information

##### User
* View Profile
* View Updates
* Signin
* Reset Password using email
* Logout
* ???

##### Admin
* view/accept/deny/delete applications
* view/send/edit/delete global updates (seen on web+iOS+android)
* search/browse/checkin users
* ???

#### Parse
* We are using the kaiseki API - https://github.com/shiki/kaiseki
* currently using HackFSU-test
* PreviewSubscription
	Contains the email for the preview email subscription
* Tables must be protected correctly in parse
* TODO: backup last year's stuff
* The .env file is required to make this work (get it from Jared). It has our private Parse keys

#### Notes
* If you add a page, PLEASE ADD IT TO THIS README!
* We are using Jade over HTML and CoffeScript over Javascript. Learn them! They are quite nice. Also, in Sublime there are some good addons for syntax/conversion to make them even easier.
* Please try to document! It helps the development process move along faster + more smoothly. 
* If there is time, we could implement a 'view participants' page that shows people's categories + team status, as well as a way to contact them (via facebook?). A LFG essentailly. Could be tied into app
