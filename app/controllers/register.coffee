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
