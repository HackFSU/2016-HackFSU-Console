###
# Registration controller
#
# Author: Trevor Helms
###

module.exports = (app) ->
    class app.RegisterController
        # Starts a new registration form
        @new = (req, res) ->
            res.render 'register/new',
                title: 'Start a Registration'

        # Submits registration
        @submit = (req, res) ->
            # Validate input
            req.assert('firstName', 'Error').notEmpty()
            req.assert('lastName', 'Error').notEmpty()

            errors = req.validationErrors()

            # Add to db if no errorss
            if (!errors)
                registration =
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    gender: req.body.gender,
                    school: req.body.school,
                    email: req.body.email + '.edu',
                    currentYear: req.body.currentYear,
                    major: req.body.major,
                    github: 'https://github.com/' + req.body.github
                    firstHack: req.body.firstHack

                app.kaiseki.createObject 'Registrations', registration, (err, result, body, success) ->
                    res.location '/registration/success'
                    res.render 'registration/success',
                        title: 'Your Registration has been Submitted!'
            else
                res.location '/register'
                res.render 'register/new',
                    title: 'Your registration had some issues...'
