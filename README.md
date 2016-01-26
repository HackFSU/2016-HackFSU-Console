HackFSU Web Console
===================

#### Description
This is the top-secret code behind [HackFSU](http://hackfsu.com) and its accompanying
web-based services (i.e. preview, registration, landing page, admin apps, etc).

### Languages and Frameworks
* Node.js and Express.js backend
* Jade templates
* ES6-based JavaScript code (both on the Node backend and client frontend)
* HTML5 and CSS (maybe in the future, we'll get with SASS or LESS)
* Parse database system
* Socket.io for real-time apps

#### Setup and Deployment Instructions

###### Prerequisites:

1. Have [NPM](https://www.npmjs.com/) and [Node](https://nodejs.org/en/) installed. NPM comes pre-packaged with Node, but you can look into installing
`n` as a Node version manager (`npm install -g n`) and running `n stable` to get the
latest stable version of Node.
2. Have [Git](https://git-scm.com/downloads) installed.
3. `.env` is needed to connect to our various external APIs (such as Parse, Mandrill, etc)  and it is `.gitignore`'d for security, ask Jared or Trevor for this file.


#### Setup Documentation
Below are commands to run to setup the development environment on a given OS. If you are on Windows (why would you be?), use PowerShell and remove the `sudo` prefix from these
commands.

```bash
# [Linux or OS X] Update your node
$ sudo npm install -g n
$ sudo n stable

# Install global node modules
$ sudo npm install -g bower gulp

# Navigate to your projects directory
$ cd my/projects/dir

# Setup repo (https is used here, but you can replace it with ssh:// if you have that setup)
$ git clone https://YOUR_GITHUB_USERNAME@github.com/HackFSU/hackfsu-console.git
$ cd hackfsu-console
$ npm install
$ bower install
$ gulp build

# Start the server (while in repo directory)
$ npm start
```

> You'll know everything is up and running if you get output in your console like this:

```
> hackfsu-console@4.0.0 start /Users/trevor1/Projects/HackFSU/hackfsu-console
> node server.js | bunyan

[2016-01-25T21:08:27.004Z]  INFO: HackFSU/12013 on wc-dhcp238d030.student-secure.wireless.fsu.edu: Custom Environment Values
    environment: {
      "NODE_ENV": "development",
      "PORT": "5003",
      "PARSE_APP_ID": "redacted for safety",
      "PARSE_JS_KEY": "redacted for safety",
      "PARSE_MASTER_KEY": "redacted for safety",
      "MANDRILL_KEY": "redacted for safety"
    }
Listening on port 5003
```

Jared recommends adding password caching to git if you haven't already. See [this](http://stackoverflow.com/questions/5343068/is-there-a-way-to-skip-password-typing-when-using-https-github).
```bash
$ git config --global credential.helper "cache --timeout=7200"
```

Or you can just use SSH.

Now open a browser and go to `http://localhost:5003` to see your local server,
running our sacred code!

**For more information on working on the project, see the relevant documentation in
`/docs`.**
