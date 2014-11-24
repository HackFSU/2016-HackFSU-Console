###
# Registration controller
#
# Author: Trevor Helms
###

module.exports = (app) ->
    class app.RegisterController
        #-----------------------------------------------------------------------
        # Starts a new registration form
        #-----------------------------------------------------------------------
        @new = (req, res) ->
            res.render 'register/new',
                title: 'Start a Registration'

        #-----------------------------------------------------------------------
        # Submits registration
        #-----------------------------------------------------------------------
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
                    if (success)
                        # On success, send a confirmation email
                        message = {
                            'html': '<strong>TODO!</strong> Fill in content here.',
                            'subject': 'We\'ve Received Your HackFSU Registration!',
                            'from_email': 'register@hackfsu.com',
                            'from_name': 'HackFSU Registration'
                            'to': [{
                                'email': req.body.email + '.edu',
                                'name': req.body.firstName + ' ' + req.body.lastName,
                                'type': 'to'
                            }]
                        }
                        app.mandrill.messages.send 'message': message, 'async': false, (result) ->
                            console.log(result)   
                        , (e) ->
                            console.log 'A mandrill error occurred: ' + e.name + ' - ' + e.message

                        res.location '/registration/success'
                        res.render 'registration/success',
                            title: 'Your Registration has been Submitted!'
                    else
                        res.send 'Well something went wrong'
            else
                res.location '/register'
                res.render 'register/new',
                    title: 'Your registration had some issues...'
