HackFSU Web Console
===================

#### Description
This is the top-secret code behind [HackFSU](http://hackfsu.com) and its accompanying
web-based services (i.e. preview, registration, landing page, admin apps, etc).

### Languages and Frameworks
Hackathons are all about pushing the boundary of technology and using the latest and
greatest for development. We here at HackFSU agree with this, so we use the latest and greatest (in our opinions) for our development as well. We're talking
* Node.js and Express.js backend
* Jade templates
* ES6-based JavaScript code (both on the Node backend and client frontend)
* HTML5 and CSS (maybe in the future, we'll get with SASS or LESS)
* Parse database system
* Our own home-grown, somewhat-still-in-development Node framework being dev'd by
Jared and Trevor

#### Setup and Deployment Instructions

###### Prerequisites:

1. Have [NPM](https://www.npmjs.com/) and [Node](https://nodejs.org/en/) installed. NPM comes pre-packaged with Node, but you can look into installing
`n` as a Node version manager (`npm install -g n`) and running `n stable` to get the
latest stable version of Node.
2. Have [Git](https://git-scm.com/downloads) installed.
3. `.env` is needed to connect to our various external APIs (such as Parse, Mandrill, etc)  and it is `.gitignore`'d for security, ask Jared or Trevor for this file).


#### Setup Documentation
Below are commands to run to setup the development environment on a given OS. If you are on Windows (why would you be?), use PowerShell and remove the `sudo` prefix from these
commands.

```bash
# [Linux or OS X] Update your node
$ sudo npm install -g n
$ sudo n stable

# Install global node modules
$ sudo npm install -g nodemon bower gulp

# [Optional] Create a git folder...
$ cd ~
$ mkdir git
$ cd ~/git

# ...or navigate to your project directory
$ cd my/project/dir

# Setup repo
$ git clone https://YOUR_GITHUB_USERNAME@github.com/HackFSU/hackfsu-console.git
$ cd hackfsu-console
$ npm install
$ bower install
$ gulp    # Build system

# Start the server (while in repo directory)
$ npm start
```

Jared recommends adding password caching to git if you haven't already. See [this](http://stackoverflow.com/questions/5343068/is-there-a-way-to-skip-password-typing-when-using-https-github).
```bash
$ git config --global credential.helper "cache --timeout=7200"
```

Or you can just use SSH.

Now open a browser and go to `http://localhost:5003` to see your local server,
running our sacred code!

#### Angular
###### Dashboard
Currently, only our admin-facing dashboard is being developed in AngularJS. We have the
following pages:
* `/dashboard/#/hackers` Queries `/api/hackers` and parses result into a table.

#### API
###### Hackers
* `GET /api/hackers` Returns an array of all hacker objects (including their assoc. user).
	* **TODO**: Add an optional query parameter to limit the queried attributes (tl;dr save our
		system resources!) Something like: `GET /api/hackers?q=user.firstName,user.lastName,school`
